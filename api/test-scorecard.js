export default async function handler(req, res) {
  const response = await fetch(
    "https://uk-golf-course-data-api.p.rapidapi.com/courses/3b36d523-65e4-4834-93e5-496f27a67b55/scorecard",
    {
      headers: {
        "X-RapidAPI-Key": process.env.UK_GOLF_API_KEY,
        "X-RapidAPI-Host": "uk-golf-course-data-api.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    }export default async function handler(req, res) {
  const { course, tee, courseId } = req.query;

  const API_HOST = "uk-golf-course-data-api.p.rapidapi.com";
  const API_KEY = process.env.UK_GOLF_API_KEY;

  const normalise = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  async function apiFetch(url) {
    const response = await fetch(url, {
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
    let selectedCourseId = courseId;

    if (!selectedCourseId && course) {
      const searchData = await apiFetch(
        `https://${API_HOST}/courses?search=${encodeURIComponent(course)}`
      );

      const courseList =
        searchData?.courses ||
        searchData?.data ||
        searchData?.results ||
        searchData ||
        [];

      const courses = Array.isArray(courseList) ? courseList : [];

      const matchedCourse =
        courses.find((c) => normalise(c.name) === normalise(course)) ||
        courses.find((c) => normalise(c.name).includes(normalise(course))) ||
        courses[0];

      selectedCourseId =
        matchedCourse?.id ||
        matchedCourse?.course_id ||
        matchedCourse?.uuid;
    }

    if (!selectedCourseId) {
      selectedCourseId = "3b36d523-65e4-4834-93e5-496f27a67b55";
    }

    const scorecardData = await apiFetch(
      `https://${API_HOST}/courses/${selectedCourseId}/scorecard`
    );

    const teeSets =
      scorecardData?.tee_sets ||
      scorecardData?.teeSets ||
      scorecardData?.course?.tee_sets ||
      scorecardData?.course?.teeSets ||
      [];

    const selectedTeeSet =
      Array.isArray(teeSets) && tee
        ? teeSets.find((t) =>
            normalise(t.colour || t.color || t.name).includes(normalise(tee))
          ) || teeSets[0]
        : scorecardData?.tee_set || scorecardData?.teeSet || teeSets[0];

    res.status(200).json({
      ...scorecardData,
      course_id: selectedCourseId,
      course_name:
        scorecardData?.course_name ||
        scorecardData?.course?.name ||
        course ||
        "Selected course",
      tee_set: selectedTeeSet,
    });
  } catch (error) {
    console.log("Scorecard API failed", error);

    res.status(500).json({
      error: true,
      message: error.message || "Scorecard failed to load",
    });
  }
}
  );

  const data = await response.json();

  res.status(200).json(data);
}
