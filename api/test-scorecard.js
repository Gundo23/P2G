import { createClient } from "@supabase/supabase-js";

const API_HOST = "uk-golf-course-data-api.p.rapidapi.com";

function normalise(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stripSuffixes(value) {
  return normalise(value)
    .replace(/\bgolf club\b/g, "")
    .replace(/\bgolf course\b/g, "")
    .replace(/\bclub\b/g, "")
    .replace(/\bcourse\b/g, "")
    .replace(/\bmunicipal\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchScore(a, b) {
  const na = normalise(a);
  const nb = normalise(b);

  const sa = stripSuffixes(a);
  const sb = stripSuffixes(b);

  if (na === nb) return 100;
  if (sa === sb) return 95;

  if (na.includes(nb) || nb.includes(na)) return 90;
  if (sa.includes(sb) || sb.includes(sa)) return 85;

  const at = sa.split(" ").filter(Boolean);
  const bt = sb.split(" ").filter(Boolean);

  const shared = at.filter((t) => bt.includes(t)).length;

  if (shared >= 2) return 75;
  if (shared === 1) return 50;

  return 0;
}

function bestMatch(items, search, nameGetter = (x) => x?.name) {
  const scored = (items || [])
    .map((item) => ({
      item,
      score: matchScore(nameGetter(item), search),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score >= 25 ? scored[0].item : null;
}

function extractHolesForTee(scorecard, matchedTee) {
  const teeId = matchedTee?.id;
  const wantedTee = normalise(matchedTee?.colour || matchedTee?.name);

  const teeSets =
    scorecard?.tee_sets ||
    scorecard?.teeSets ||
    scorecard?.course?.tee_sets ||
    [];

  if (Array.isArray(teeSets) && teeSets.length) {
    const teeSet =
      teeSets.find((t) => t.id === teeId) ||
      teeSets.find((t) => normalise(t.colour || t.name) === wantedTee) ||
      teeSets.find((t) => normalise(t.colour || t.name).includes(wantedTee));

    if (Array.isArray(teeSet?.holes)) {
      return { holes: teeSet.holes, teeSet };
    }
  }

  const flatHoles =
    scorecard?.holes ||
    scorecard?.scorecard ||
    scorecard?.data?.holes ||
    [];

  if (Array.isArray(flatHoles) && flatHoles.length) {
    const filtered = teeId
      ? flatHoles.filter((h) => h.tee_set_id === teeId || h.teeSetId === teeId)
      : [];

    return {
      holes: filtered.length ? filtered : flatHoles,
      teeSet: matchedTee,
    };
  }

  const singleTee = scorecard?.tee_set || scorecard?.teeSet;

  if (Array.isArray(singleTee?.holes)) {
    return { holes: singleTee.holes, teeSet: singleTee };
  }

  return { holes: [], teeSet: matchedTee };
}

export default async function handler(req, res) {
  const { course, tee, debug } = req.query;

  const API_KEY = process.env.UK_GOLF_API_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase =
    SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      : null;

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
      throw new Error(data?.message || data?.error || `UK Golf API error ${response.status}`);
    }

    return data;
  }

  async function findClub() {
    if (supabase) {
      const strippedSearch = stripSuffixes(selectedCourseName);
      let rows = [];

      ({ data: rows } = await supabase
        .from("clubs")
        .select("id, name, normalised_name")
        .ilike("normalised_name", `%${normalise(selectedCourseName)}%`)
        .limit(30));

      if (!rows?.length) {
        const words = strippedSearch.split(" ").filter(Boolean);

        for (const word of words) {
          if (word.length < 4) continue;

          ({ data: rows } = await supabase
            .from("clubs")
            .select("id, name, normalised_name")
            .ilike("normalised_name", `%${word}%`)
            .limit(30));

          if (rows?.length) break;
        }
      }

      if (!rows?.length) {
        ({ data: rows } = await supabase
          .from("clubs")
          .select("id, name, normalised_name")
          .limit(500));
      }

      const matched = bestMatch(rows, selectedCourseName, (r) => r.name || r.normalised_name);
      if (matched?.id) return matched;
    }

    const clubSearch = await apiFetch(`/clubs?search=${encodeURIComponent(selectedCourseName)}`);
    const clubs = clubSearch?.clubs || clubSearch?.data || clubSearch || [];

    const matched = bestMatch(clubs, selectedCourseName);
    return matched || clubs[0] || null;
  }

  try {
    if (!API_KEY) throw new Error("UK_GOLF_API_KEY is missing");

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

    const club = await findClub();

    if (!club?.id) {
      throw new Error(`${selectedCourseName} was not found`);
    }

    const coursesResponse = await apiFetch(`/clubs/${club.id}/courses`);

    const courseList = Array.isArray(coursesResponse)
      ? coursesResponse
      : coursesResponse?.courses || coursesResponse?.data || [];

    const matchedCourse =
      bestMatch(courseList, selectedCourseName) ||
      courseList[0];

    if (!matchedCourse?.id) {
      throw new Error(`No course ID found for ${selectedCourseName}`);
    }

    const teeSets = matchedCourse?.tee_sets || matchedCourse?.teeSets || [];

    const matchedTee =
      bestMatch(teeSets, selectedTee, (t) => t.colour || t.name) ||
      teeSets.find((t) => normalise(t.colour || t.name).includes(normalise(selectedTee))) ||
      teeSets[0];

    if (!matchedTee?.id) {
      throw new Error(`${selectedTee} tee was not found for ${selectedCourseName}`);
    }

    const scorecard = await apiFetch(`/courses/${matchedCourse.id}/scorecard`);

    const { holes, teeSet } = extractHolesForTee(scorecard, matchedTee);

    if (!Array.isArray(holes) || holes.length !== 18) {
      throw new Error(`No 18-hole scorecard found for ${selectedCourseName} ${selectedTee}`);
    }

    const finalScorecard = {
      course_id: matchedCourse.id,
      course_name: matchedCourse.name || scorecard.course_name || selectedCourseName,
      tee_set: {
        ...matchedTee,
        ...teeSet,
        id: matchedTee.id,
        colour: matchedTee.colour || teeSet?.colour || selectedTee.toLowerCase(),
        par: matchedTee.par || teeSet?.par,
        course_rating: matchedTee.course_rating || teeSet?.course_rating,
        slope_rating: matchedTee.slope_rating || teeSet?.slope_rating,
        holes,
      },
    };

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
        ? {
            source: "uk_golf_api",
            cacheId,
            club_id: club.id,
            course_id: matchedCourse.id,
            tee_set_id: matchedTee.id,
            data: finalScorecard,
          }
        : finalScorecard
    );
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Scorecard failed to load",
    });
  }
}
