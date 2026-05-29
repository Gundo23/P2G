import { createClient } from "@supabase/supabase-js";

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

  // Strip common suffixes so "Royal Liverpool Golf Club" matches "Royal Liverpool"
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

  // Score how well two names match (higher = better)
  function matchScore(apiName, searchName) {
    const a = normalise(apiName);
    const b = normalise(searchName);
    const aStripped = stripSuffixes(apiName);
    const bStripped = stripSuffixes(searchName);

    if (a === b) return 100;
    if (aStripped === bStripped) return 90;
    if (a.includes(bStripped) || b.includes(aStripped)) return 80;
    if (aStripped.includes(bStripped) || bStripped.includes(aStripped)) return 70;

    // Token overlap scoring
    const aTokens = aStripped.split(" ").filter(Boolean);
    const bTokens = bStripped.split(" ").filter(Boolean);
    const shared = aTokens.filter((t) => bTokens.includes(t)).length;
    const total = Math.max(aTokens.length, bTokens.length);
    return total > 0 ? Math.round((shared / total) * 60) : 0;
  }

  function bestMatch(list, searchName, nameKey = "name") {
    if (!list?.length) return null;
    return list
      .map((item) => ({ item, score: matchScore(item[nameKey], searchName) }))
      .sort((a, b) => b.score - a.score)[0]?.item || list[0];
  }

  const selectedCourseName = course || "Leasowe Golf Club";
  const selectedTee = tee || "Yellow";
  const cacheId = `${normalise(selectedCourseName)}__${normalise(selectedTee)}`;

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

    // 2. Try multiple search queries to maximise chance of finding the club
    const strippedName = stripSuffixes(selectedCourseName);
    const searchTerms = [
      selectedCourseName,           // "Royal Liverpool Golf Club"
      strippedName,                 // "royal liverpool"
      strippedName.split(" ")[0],   // "royal" (first word)
      strippedName.split(" ").slice(0, 2).join(" "), // "royal liverpool"
    ].filter((v, i, arr) => v && arr.indexOf(v) === i); // dedupe

    let bestClub = null;
    let bestScore = 0;
    let allClubs = [];

    for (const term of searchTerms) {
      try {
        const result = await apiFetch(
          `/clubs?search=${encodeURIComponent(term)}`
        );
        const clubs = result?.clubs || [];
        allClubs = [...allClubs, ...clubs];

        for (const club of clubs) {
          const score = matchScore(club.name, selectedCourseName);
          if (score > bestScore) {
            bestScore = score;
            bestClub = club;
          }
        }

        // Good enough match found — stop searching
        if (bestScore >= 70) break;
      } catch (_) {
        // Try next search term
      }
    }

    if (!bestClub?.id) {
      const tried = allClubs.map((c) => c.name).slice(0, 8).join(", ");
      throw new Error(
        `"${selectedCourseName}" was not found in the UK Golf API. Closest results: ${tried || "none"}`
      );
    }

    // 3. Get courses for the club
    const coursesResponse = await apiFetch(`/clubs/${bestClub.id}/courses`);
    const courseList = Array.isArray(coursesResponse)
      ? coursesResponse
      : coursesResponse?.courses || coursesResponse?.data || [];

    const matchedCourse = bestMatch(courseList, selectedCourseName) || courseList[0];

    if (!matchedCourse?.id) {
      throw new Error(`No course found under club "${bestClub.name}"`);
    }

    // 4. Get full course detail to find tee sets
    const courseDetail = await apiFetch(`/courses/${matchedCourse.id}`);
    const teeSets = courseDetail?.tee_sets || matchedCourse?.tee_sets || [];

    const matchedTee =
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

    // 5. Fetch scorecard using the TEE SET ID
    const scorecard = await apiFetch(`/courses/${matchedTee.id}/scorecard`);

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
        ? { source: "uk_golf_api", cacheId, clubFound: bestClub.name, matchScore: bestScore, data: finalScorecard }
        : finalScorecard
    );
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Scorecard failed to load",
    });
  }
}
