import { createClient } from "@supabase/supabase-js";

// ─── Manual club ID overrides ─────────────────────────────────────────────────
// Add entries here for any course the API can't find by pagination.
// To find a club ID: use /api/ukgolf?path=clubs and page through until you find it,
// or check the RapidAPI docs/console.
const CLUB_ID_OVERRIDES = {
  "royal liverpool golf club": "your-royal-liverpool-club-id-here",
  // "another golf club": "uuid-here",
};

// ─── Manual tee set ID overrides ─────────────────────────────────────────────
// If you know the exact tee set ID, add it here as "club name__tee colour"
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

  const supabase =
    SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      : null;

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
  const overrideKey = normalise(selectedCourseName);
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

  // Page through clubs API to find a matching club
  async function findClubByPaging(searchName) {
    const stripped = stripSuffixes(searchName);
    const firstLetter = stripped.charAt(0).toUpperCase();
    let bestClub = null;
    let bestScore = 0;

    // Only scan pages where club names starting with the right letter would appear
    // Clubs are alphabetical — scan up to 10 pages around likely position
    const totalPages = 134;
    const guessPage = Math.max(
      1,
      Math.min(
        totalPages,
        Math.round(((firstLetter.charCodeAt(0) - 65) / 26) * totalPages)
      )
    );

    const pagesToTry = [];
    for (let offset = 0; offset <= 6; offset++) {
      if (guessPage + offset <= totalPages) pagesToTry.push(guessPage + offset);
      if (guessPage - offset >= 1 && offset > 0) pagesToTry.push(guessPage - offset);
    }

    for (const page of pagesToTry) {
      const result = await apiFetch(`/clubs?page=${page}&per_page=20`);
      const clubs = result?.clubs || [];

      for (const club of clubs) {
        const score = matchScore(club.name, searchName);
        if (score > bestScore) {
          bestScore = score;
          bestClub = club;
        }
      }

      if (bestScore >= 80) break;
    }

    return { club: bestClub, score: bestScore };
  }

  try {
    // 1. Check Supabase cache first
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

    // 2. Find the club — check override map first, then page through API
    let clubId = CLUB_ID_OVERRIDES[overrideKey] || null;
    let clubFoundName = overrideKey;

    if (!clubId) {
      const { club, score } = await findClubByPaging(selectedCourseName);
      if (!club?.id || score < 40) {
        throw new Error(
          `"${selectedCourseName}" could not be found. Add it to CLUB_ID_OVERRIDES in test-scorecard.js`
        );
      }
      clubId = club.id;
      clubFoundName = club.name;
    }

    // 3. Get courses for the club
    const coursesResponse = await apiFetch(`/clubs/${clubId}/courses`);
    const courseList = Array.isArray(coursesResponse)
      ? coursesResponse
      : coursesResponse?.courses || coursesResponse?.data || [];

    const matchedCourse =
      courseList.sort((a, b) => matchScore(b.name, selectedCourseName) - matchScore(a.name, selectedCourseName))[0];

    if (!matchedCourse?.id) {
      throw new Error(`No course found under club "${clubFoundName}"`);
    }

    // 4. Check tee override, otherwise get tee sets from course detail
    let teeId = TEE_ID_OVERRIDES[teeOverrideKey] || null;
    let matchedTee = null;

    if (!teeId) {
      const courseDetail = await apiFetch(`/courses/${matchedCourse.id}`);
      const teeSets = courseDetail?.tee_sets || matchedCourse?.tee_sets || [];

      matchedTee =
        teeSets.find((t) => normalise(t.colour) === normalise(selectedTee)) ||
        teeSets.find((t) => normalise(t.name) === normalise(selectedTee)) ||
        teeSets.find((t) =>
          normalise(t.colour || t.name).includes(normalise(selectedTee))
        );

      if (!matchedTee?.id) {
        const available = teeSets.map((t) => t.colour || t.name).join(", ");
        throw new Error(
          `"${selectedTee}" tee not found for ${selectedCourseName}. Available: ${available || "none"}`
        );
      }

      teeId = matchedTee.id;
    }

    // 5. Fetch scorecard using the tee set ID
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

    // 6. Cache in Supabase
    if (supabase) {
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
    }

    return res.status(200).json(
      debug === "1"
        ? { source: "uk_golf_api", cacheId, clubFound: clubFoundName, data: finalScorecard }
        : finalScorecard
    );
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Scorecard failed to load",
    });
  }
}
