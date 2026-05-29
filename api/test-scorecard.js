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
    const selectedCourseName = course || "Leasowe Golf Club";
    const selectedTee = tee || "Yellow";

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

    res.status(200).json({
      course_id: scorecard.course_id || courseId,
      course_name: scorecard.course_name || selectedCourseName,
      tee_set: {
        ...teeSet,
        holes,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message || "Scorecard failed to load",
    });
  }
}
