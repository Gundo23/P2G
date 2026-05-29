export default async function handler(req, res) {
  const response = await fetch(
    "https://uk-golf-course-data-api.p.rapidapi.com/courses/3b36d523-65e4-4834-93e5-496f27a67b55/scorecard",
    {
      headers: {
        "X-RapidAPI-Key": process.env.UK_GOLF_API_KEY,
        "X-RapidAPI-Host": "uk-golf-course-data-api.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  res.status(200).json(data);
}
