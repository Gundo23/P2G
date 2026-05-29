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
    if (supabase) {
      const { data: cachedRow, error: cacheReadError } = await supabase
        .from("scorecard_cache")
        .select("data")
        .eq("id", cacheId)
        .maybeSingle();

      if (cacheReadError && debug === "1") {
        return res.status(500).json({
          stage: "cache_read",
          error: cacheReadError.message,
        });
      }

      if (cachedRow?.data) {
        if (debug === "1") {
          return res.status(200).json({
            source: "supabase_cache",
            cacheId,
            data: cachedRow.data,
          });
        }

        return res.status(200).json(cachedRow.data);
      }
    }

    let courseId = "3b36d523-65e4-4834-93e5-496f27a67b55";

    if (course) {
      const clubSearch = await apiFetch(
        `/clubs?search=${encodeURIComponent(selectedCourseName)}`
      );

      const clubs = clubSearch?.clubs || [];

      const club =
        clubs.find((c) => normalise(c.name) === normalise(selectedCourseName)) ||
        clubs.find((c) =>
          normalise(c.name).includes(
            normalise(selectedCourseName).replace(" golf club", "")
          )
        ) ||
        clubs[0];

      if (!club?.id) {
        throw new Error(`${selectedCourseName} was not found`);
      }

      const coursesResponse = await apiFetch(`/clubs/${club.id}/courses`);

      const courseList = Array.isArray(coursesResponse)
        ? coursesResponse
        : coursesResponse?.courses || coursesResponse?.data || [];

      const matchedCourse =
        courseList.find((c) =>
          normalise(selectedCourseName).includes(normalise(c.name))
        ) || courseList[0];

      if (!matchedCourse?.id) {
        throw new Error(`No course ID found for ${selectedCourseName}`);
      }

      courseId = matchedCourse.id;
    }

    const scorecard = await apiFetch(`/courses/${courseId}/scorecard`);

    const holes = scorecard?.holes || [];
    const teeSet = scorecard?.tee_set || {};

    if (!Array.isArray(holes) || holes.length !== 18) {
      throw new Error(`No 18-hole scorecard found for ${selectedCourseName}`);
    }

    const finalScorecard = {
      course_id: scorecard.course_id || courseId,
      course_name: scorecard.course_name || selectedCourseName,
      tee_set: {
        ...teeSet,
        holes,
      },
    };

    let cacheWrite = null;

    if (supabase) {
      const { data: savedRow, error: cacheWriteError } = await supabase
        .from("scorecard_cache")
        .upsert(
          {
            id: cacheId,
            course_name: selectedCourseName,
            tee: selectedTee,
            data: finalScorecard,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select("id")
        .single();

      cacheWrite = {
        saved: !cacheWriteError,
        id: savedRow?.id || null,
        error: cacheWriteError?.message || null,
      };
    } else {
      cacheWrite = {
        saved: false,
        error: "Supabase environment variables missing",
      };
    }

    if (debug === "1") {
      return res.status(200).json({
        source: "uk_golf_api",
        cacheId,
        cacheWrite,
        data: finalScorecard,
      });
    }

    return res.status(200).json(finalScorecard);
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Scorecard failed to load",
    });
  }
}
