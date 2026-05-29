export default async function handler(req, res) {
  const { course, tee } = req.query;

  const API_HOST = "uk-golf-course-data-api.p.rapidapi.com";
  const API_KEY = process.env.UK_GOLF_API_KEY;

  const normalise = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const courseIds = {
    "leasowe golf club": "3b36d523-65e4-4834-93e5-496f27a67b55",
  };

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
    const selectedCourseName = course || "Leasowe Golf Club";
    const selectedTee = tee || "Yellow";

    let selectedCourseId = courseIds[normalise(selectedCourseName)];

    if (!selectedCourseId) {
      throw new Error(
        `${selectedCourseName} is not mapped yet. Add its UK Golf API course ID to test-scorecard.js.`
      );
    }

    const data = await apiFetch(
      `https://${API_HOST}/courses/${selectedCourseId}/scorecard`
    );

    const teeSets =
      data?.tee_sets ||
      data?.teeSets ||
      data?.course?.tee_sets ||
      data?.course?.teeSets ||
      [];

    const selectedTeeSet =
      Array.isArray(teeSets)
        ? teeSets.find((t) =>
            normalise(t.colour || t.color || t.name).includes(
              normalise(selectedTee)
            )
          ) || teeSets[0]
        : data?.tee_set || data?.teeSet;

    res.status(200).json({
      ...data,
      course_id: selectedCourseId,
      course_name:
        data?.course_name ||
        data?.course?.name ||
        selectedCourseName,
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
