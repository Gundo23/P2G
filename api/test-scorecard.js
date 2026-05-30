import { createClient } from "@supabase/supabase-js";

const TEE_ID_OVERRIDES = {
  "leasowe golf club__yellow": "8a278b30-e89f-4f90-85b8-d24d8bf9db59",
};

export default async function handler(req, res) {
  const { course, tee, debug } = req.query;

  const API_HOST = "uk-golf-course-data-api.p.rapidapi.com";
  const API_KEY = process.env.UK_GOLF_API_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const normalise = (v) =>
    String(v || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();

  const stripSuffixes = (name) =>
    normalise(name)
      .replace(/\bgolf club\b/g, "").replace(/\bgolf course\b/g, "")
      .replace(/\bgolf\b/g, "").replace(/\bclub\b/g, "")
      .replace(/\bcourse\b/g, "").replace(/\bresort\b/g, "")
      .replace(/\bthe\b/g, "").replace(/\s+/g, " ").trim();

  function matchScore(a, b) {
    const na = normalise(a), nb = normalise(b);
    const sa = stripSuffixes(a), sb = stripSuffixes(b);
    if (na === nb) return 100;
    if (sa === sb) return 90;
    if (na.includes(sb) || nb.includes(sa)) return 80;
    if (sa.includes(sb) || sb.includes(sa)) return 70;
    const at = sa.split(" ").filter(Boolean);
    const bt = sb.split(" ").filter(Boolean);
    const shared = at.filter(t => bt.includes(t)).length;
    const total = Math.max(at.length, bt.length);
    return total > 0 ? Math.round((shared / total) * 60) : 0;
  }

  const selectedCourseName = course || "Leasowe Golf Club";
  const selectedTee = tee || "Yellow";
  const cacheId = `${normalise(selectedCourseName)}__${normalise(selectedTee)}`;
  const teeOverrideKey = `${normalise(selectedCourseName)}__${normalise(selectedTee)}`;
  const trace = [];

  async function apiFetch(path) {
    const response = await fetch(`https://${API_HOST}${path}`, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || `API error ${response.status} at ${path}`);
    return data;
  }

  async function findClubFromSupabase(searchName) {
    const normSearch = normalise(searchName);
    const strippedSearch = stripSuffixes(searchName);

    let { data: rows } = await supabase
      .from("clubs").select("id, name, normalised_name")
      .eq("normalised_name", normSearch).limit(5);

    if (!rows?.length) {
      ({ data: rows } = await supabase
        .from("clubs").select("id, name, normalised_name")
        .ilike("normalised_name", `%${strippedSearch}%`).limit(10));
    }

    if (!rows?.length) {
      const firstWord = strippedSearch.split(" ")[0];
      if (firstWord.length > 3) {
        ({ data: rows } = await supabase
          .from("clubs").select("id, name, normalised_name")
          .ilike("normalised_name", `%${firstWord}%`).limit(20));
      }
    }

    if (!rows?.length) return null;
    const scored = rows.map(r => ({ ...r, score: matchScore(r.name, searchName) }))
      .sort((a, b) => b.score - a.score);
    return scored[0]?.score >= 40 ? scored[0] : null;
  }

  try {
    // 1. Check scorecard cache
    const { data: cachedRow } = await supabase
      .from("scorecard_cache").select("data").eq("id", cacheId).maybeSingle();

    if (cachedRow?.data) {
      return res.status(200).json(
        debug === "1" ? { source: "cache", cacheId, data: cachedRow.data } : cachedRow.data
      );
    }
    trace.push("cache: miss");

    // 2. Find club in Supabase
    const clubRow = await findClubFromSupabase(selectedCourseName);
    if (!clubRow?.id) throw new Error(`"${selectedCourseName}" not found in clubs table`);
    trace.push(`club: ${clubRow.name} (${clubRow.id})`);

    // 3. Get courses for the club
    const coursesResponse = await apiFetch(`/clubs/${clubRow.id}/courses`);
    const courseList = Array.isArray(coursesResponse)
      ? coursesResponse
      : coursesResponse?.courses || coursesResponse?.data || [];
    trace.push(`courses found: ${courseList.length} — ${courseList.map(c => c.name).join(", ")}`);

    const matchedCourse = courseList
      .map(c => ({ ...c, score: matchScore(c.name, selectedCourseName) }))
      .sort((a, b) => b.score - a.score || (b.tee_sets?.length || 0) - (a.tee_sets?.length || 0))[0];

    if (!matchedCourse?.id) throw new Error(`No course found under club "${clubRow.name}"`);
    trace.push(`matched course: ${matchedCourse.name} (${matchedCourse.id}), tee_sets: ${matchedCourse.tee_sets?.length || 0}`);

    // 4. Find tee set
    let teeId = TEE_ID_OVERRIDES[teeOverrideKey] || null;
    let matchedTee = null;

    if (!teeId) {
      let teeSets = matchedCourse?.tee_sets || [];
      if (!teeSets.length) {
        teeSets = courseList.flatMap(c => c.tee_sets || []);
      }
      trace.push(`tee_sets available: ${teeSets.map(t => t.colour || t.name).join(", ")}`);

      const TEE_FALLBACK_ORDER = ["yellow", "white", "cream", "silver", "blue", "green", "red"];

      matchedTee =
        teeSets.find(t => normalise(t.colour) === normalise(selectedTee)) ||
        teeSets.find(t => normalise(t.name) === normalise(selectedTee)) ||
        teeSets.find(t => normalise(t.colour || t.name).includes(normalise(selectedTee)));

      if (!matchedTee?.id) {
        for (const fc of TEE_FALLBACK_ORDER) {
          if (fc === normalise(selectedTee)) continue;
          matchedTee = teeSets.find(t => normalise(t.colour) === fc || normalise(t.name) === fc);
          if (matchedTee?.id) break;
        }
      }

      if (!matchedTee?.id && teeSets.length > 0) matchedTee = teeSets[0];
      if (!matchedTee?.id) throw new Error(`No tee sets found for ${selectedCourseName}`);

      teeId = matchedTee.id;
      trace.push(`matched tee: ${matchedTee.colour || matchedTee.name} (${teeId})`);
    }

    // 5. Fetch scorecard using tee set ID
    trace.push(`fetching: /courses/${teeId}/scorecard`);
    const scorecard = await apiFetch(`/courses/${teeId}/scorecard`);

    const holes =
      scorecard?.tee_set?.holes ||
      scorecard?.teeSet?.holes ||
      scorecard?.holes ||
      [];

    const teeSet = {
      ...matchedTee,
      ...(scorecard?.tee_set || scorecard?.teeSet || {}),
      holes,
    };

    if (!Array.isArray(holes) || holes.length !== 18) {
      throw new Error(`No 18-hole scorecard returned — got ${holes.length} holes`);
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

    // 6. Cache it
    await supabase.from("scorecard_cache").upsert({
      id: cacheId,
      course_name: selectedCourseName,
      tee: selectedTee,
      data: finalScorecard,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

    return res.status(200).json(
      debug === "1"
        ? { source: "api", cacheId, clubFound: clubRow.name, trace, data: finalScorecard }
        : finalScorecard
    );

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Scorecard failed to load",
      trace,
    });
  }
}
