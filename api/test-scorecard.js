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

    const clubSearch = await apiFetch(
      `/clubs?search=${encodeURIComponent(selectedCourseName)}`
    );

    const clubs = clubSearch?.clubs || [];
    const club =
      clubs.find((c) => normalise(c.name) === normalise(selectedCourseName)) ||
      clubs.find((c) =>
        normalise(c.name).includes(normalise(selectedCourseName).replace(" golf club", ""))
      ) ||
      clubs[0];

    if (!club?.id) {
      throw new Error(`${selectedCourseName} was not found in the UK Golf API`);
    }

    const courses = await apiFetch(`/clubs/${club.id}/courses`);

    const courseList = Array.isArray(courses)
      ? courses
      : courses?.courses || courses?.data || [];

    const matchedCourse =
      courseList.find((c) => normalise(c.name) === normalise(selectedCourseName)) ||
      courseList.find((c) =>
        normalise(selectedCourseName).includes(normalise(c.name))
      ) ||
      courseList[0];

    if (!matchedCourse) {
      throw new Error(`No course data found for ${selectedCourseName}`);
    }

    const teeSets =
      matchedCourse?.tee_sets ||
      matchedCourse?.teeSets ||
      matchedCourse?.tees ||
      [];

    const selectedTeeSet =
      teeSets.find((t) =>
        normalise(t.name || t.colour || t.color).includes(normalise(selectedTee))
      ) ||
      teeSets.find((t) =>
        normalise(selectedTee).includes(normalise(t.name || t.colour || t.color))
      ) ||
      teeSets[0];

    if (!selectedTeeSet?.holes || selectedTeeSet.holes.length !== 18) {
      throw new Error(
        `No 18-hole ${selectedTee} scorecard found for ${selectedCourseName}`
      );
    }

    res.status(200).json({
      course_id: matchedCourse.id,
      course_name: matchedCourse.name || selectedCourseName,
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
