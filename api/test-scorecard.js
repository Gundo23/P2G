import { createClient } from "@supabase/supabase-js";

// ─── Manual tee set ID overrides ─────────────────────────────────────────────
// If a course's tee set ID is known, add it here as "course name__tee colour"
// to skip the API tee lookup entirely.
const TEE_ID_OVERRIDES = {
  "leasowe golf club__yellow": "8a278b30-e89f-4f90-85b8-d24d8bf9db59",
};
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const { course, tee, debug } = req.query;

  const API_HOST = "uk-golf-course-data-api.p.rapidapi.com";
  const API_KEY = process.env.UK_GOLF_API_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const normalise = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const stripSuffixes = (name) =>
    normalise(name)
      .replace(/\bgolf club\b/g, "")
      .replace(/\bgolf course\b/g, "")
      .replace(/\bgolf\b/g, "")
      .replace(/\bclub\b/g, "")
      .replace(/\bcourse\b/g, "")
      .replace(/\bresort\b/g, "")
      .replace(/\bthe\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

  function matchScore(apiName, searchName) {
    const a = normalise(apiName);
    const b = normalise(searchName);
    const aStripped = stripSuffixes(apiName);
    const bStripped = stripSuffixes(searchName);
    if (a === b) return 100;
    if (aStripped === bStripped) return 90;
    if (a.includes(bStripped) || b.includes(aStripped)) return 80;
    if (aStripped.includes(bStripped) || bStripped.includes(aStripped)) return 70;
    const aTokens = aStripped.split(" ").filter(Boolean);
    const bTokens = bStripped.split(" ").filter(Boolean);
    const shared = aTokens.filter((t) => bTokens.includes(t)).length;
    const total = Math.max(aTokens.length, bTokens.length);
    return total > 0 ? Math.round((shared / total) * 60) : 0;
  }

  const selectedCourseName = course || "Leasowe Golf Club";
  const selectedTee = tee || "Yellow";
  const cacheId = `${normalise(selectedCourseName)}__${normalise(selectedTee)}`;
  const teeOverrideKey = `${normalise(selectedCourseName)}__${normalise(selectedTee)}`;

  async function apiFetch(path) {
    const response = await fetch(`https://${API_HOST}${path}`, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `UK Golf API error ${response.status}`);
    }
    return data;
  }

  // Look up club from Supabase clubs table (populated by seed-clubs.js)
  async function findClubFromSupabase(searchName) {
    const normSearch = normalise(searchName);
    const strippedSearch = stripSuffixes(searchName);

    // Try exact normalised name first
    let { data: rows } = await supabase
      .from("clubs")
      .select("id, name, normalised_name")
      .eq("normalised_name", normSearch)
      .limit(5);

    if (!rows?.length) {
      // Try stripped name (without "golf club" etc)
      ({ data: rows } = await supabase
        .from("clubs")
        .select("id, name, normalised_name")
        .ilike("normalised_name", `%${strippedSearch}%`)
        .limit(10));
    }

    if (!rows?.length) {
      // Try first significant word
      const firstWord = strippedSearch.split(" ")[0];
      if (firstWord.length > 3) {
        ({ data: rows } = await supabase
          .from("clubs")
          .select("id, name, normalised_name")
          .ilike("normalised_name", `%${firstWord}%`)
          .limit(20));
      }
    }

    if (!rows?.length) return null;

    // Score all candidates and pick best
    const scored = rows
      .map((r) => ({ ...r, score: matchScore(r.name, searchName) }))
      .sort((a, b) => b.score - a.score);

    return scored[0]?.score >= 40 ? scored[0] : null;
  }

  try {
    // 1. Check scorecard cache first
    if (supabase) {
      const { data: cachedRow } = await supabase
        .from("scorecard_cache")
        .select("data")
        .eq("id", cacheId)
        .maybeSingle();

      if (cachedRow?.data) {
        return res.status(200).json(
          debug === "1"
            ? { source: "supabase_cache", cacheId, data: cachedRow.data }
            : cachedRow.data
        );
      }
    }

    // 2. Find club from Supabase (zero RapidAPI calls)
    const clubRow = await findClubFromSupabase(selectedCourseName);

    if (!clubRow?.id) {
      throw new Error(
        `"${selectedCourseName}" not found in clubs table. Run seed-clubs.js to populate it.`
      );
    }

    // 3. Get courses for the club (1 RapidAPI call)
    const coursesResponse = await apiFetch(`/clubs/${clubRow.id}/courses`);
    const courseList = Array.isArray(coursesResponse)
      ? coursesResponse
      : coursesResponse?.courses || coursesResponse?.data || [];

    const matchedCourse = courseList
      .map((c) => ({ ...c, score: matchScore(c.name, selectedCourseName) }))
      .sort((a, b) => b.score - a.score)[0];

    if (!matchedCourse?.id) {
      throw new Error(`No course found under club "${clubRow.name}"`);
    }

    // 4. Get tee set ID — check override first, then API (1 RapidAPI call)
    let teeId = TEE_ID_OVERRIDES[teeOverrideKey] || null;
    let matchedTee = null;

    if (!teeId) {
      const courseDetail = await apiFetch(`/courses/${matchedCourse.id}`);
      const teeSets = courseDetail?.tee_sets || matchedCourse?.tee_sets || [];

      // Fallback order when requested tee not found:
      // yellow -> white -> cream -> silver -> blue -> any male tee -> any tee
      const TEE_FALLBACK_ORDER = [
        "yellow", "white", "cream", "silver", "blue", "green", "red"
      ];

      // Try exact match first
      matchedTee =
        teeSets.find((t) => normalise(t.colour) === normalise(selectedTee)) ||
        teeSets.find((t) => normalise(t.name) === normalise(selectedTee)) ||
        teeSets.find((t) =>
          normalise(t.colour || t.name).includes(normalise(selectedTee))
        );

      // If not found, try fallback tee colours in order
      if (!matchedTee?.id) {
        for (const fallbackColour of TEE_FALLBACK_ORDER) {
          if (fallbackColour === normalise(selectedTee)) continue;
          matchedTee = teeSets.find(
            (t) =>
              normalise(t.colour) === fallbackColour ||
              normalise(t.name) === fallbackColour
          );
          if (matchedTee?.id) break;
        }
      }

      // Last resort — just use the first tee set available
      if (!matchedTee?.id && teeSets.length > 0) {
        matchedTee = teeSets[0];
      }

      if (!matchedTee?.id) {
        throw new Error(
          `No tee sets found for ${selectedCourseName}`
        );
      }

      teeId = matchedTee.id;
    }

    // 5. Fetch scorecard (1 RapidAPI call)
    const scorecard = await apiFetch(`/courses/${teeId}/scorecard`);

    const holes =
      scorecard?.tee_set?.holes ||
      scorecard?.teeSet?.holes ||
      scorecard?.holes ||
      [];

    const teeSet = scorecard?.tee_set || scorecard?.teeSet || matchedTee || {};

    if (!Array.isArray(holes) || holes.length !== 18) {
      throw new Error(
        `No 18-hole scorecard returned for ${selectedCourseName} (${selectedTee} tee)`
      );
    }

    const finalScorecard = {
      course_id: matchedCourse.id,
      course_name: selectedCourseName,
      tee_set: {
        ...teeSet,
        colour: teeSet.colour || selectedTee.toLowerCase(),
        holes,
      },
    };

    // 6. Cache scorecard in Supabase
    await supabase.from("scorecard_cache").upsert(
      {
        id: cacheId,
        course_name: selectedCourseName,
        tee: selectedTee,
        data: finalScorecard,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    return res.status(200).json(
      debug === "1"
        ? { source: "uk_golf_api", cacheId, clubFound: clubRow.name, data: finalScorecard }
        : finalScorecard
    );
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Scorecard failed to load",
    });
  }
}
