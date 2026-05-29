export default async function handler(req, res) {
  const tests = [
    {
      name: "Leasowe",
      courseId: "3b36d523-65e4-4834-93e5-496f27a67b55",
    },
    {
      name: "Wallasey",
      courseId: "666f7922-7593-4038-ab0c-4d8e81ce333d",
    },
  ];

  const results = [];

  for (const test of tests) {
    try {
      const response = await fetch(
        `https://uk-golf-course-data-api.p.rapidapi.com/courses/${test.courseId}/scorecard`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.UK_GOLF_API_KEY,
            "X-RapidAPI-Host": "uk-golf-course-data-api.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      results.push({
        name: test.name,
        success: true,
        courseName: data.course_name,
        teeColour: data.tee_set?.colour,
        holes: data.tee_set?.holes?.length || 0,
        firstHole: data.tee_set?.holes?.[0] || null,
      });
    } catch (err) {
      results.push({
        name: test.name,
        success: false,
        error: err.message,
      });
    }
  }

  res.status(200).json(results);
}
