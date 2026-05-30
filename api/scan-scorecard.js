// api/scan-scorecard.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image, mediaType = "image/jpeg", courseName, tee = "Yellow" } = req.body;
  if (!image) return res.status(400).json({ error: "No image provided" });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: image },
            },
            {
              type: "text",
              text: `This is a golf scorecard photo. Extract all data for the ${tee} tees (or nearest available tee if ${tee} not shown).

Return ONLY a valid JSON object, absolutely nothing else before or after it:

{
  "course_name": "Full Golf Club Name",
  "tee": "Yellow",
  "par": 72,
  "course_rating": 71.4,
  "slope_rating": 129,
  "total_yardage": 6200,
  "holes": [
    {"hole_number": 1, "par": 4, "stroke_index": 9, "yardage": 378},
    {"hole_number": 2, "par": 3, "stroke_index": 17, "yardage": 145},
    {"hole_number": 3, "par": 4, "stroke_index": 5, "yardage": 320},
    {"hole_number": 4, "par": 4, "stroke_index": 13, "yardage": 290},
    {"hole_number": 5, "par": 5, "stroke_index": 3, "yardage": 490},
    {"hole_number": 6, "par": 4, "stroke_index": 11, "yardage": 360},
    {"hole_number": 7, "par": 3, "stroke_index": 15, "yardage": 155},
    {"hole_number": 8, "par": 4, "stroke_index": 7, "yardage": 380},
    {"hole_number": 9, "par": 4, "stroke_index": 1, "yardage": 420},
    {"hole_number": 10, "par": 4, "stroke_index": 2, "yardage": 410},
    {"hole_number": 11, "par": 4, "stroke_index": 10, "yardage": 350},
    {"hole_number": 12, "par": 3, "stroke_index": 18, "yardage": 140},
    {"hole_number": 13, "par": 4, "stroke_index": 6, "yardage": 395},
    {"hole_number": 14, "par": 5, "stroke_index": 4, "yardage": 480},
    {"hole_number": 15, "par": 4, "stroke_index": 14, "yardage": 300},
    {"hole_number": 16, "par": 3, "stroke_index": 16, "yardage": 165},
    {"hole_number": 17, "par": 4, "stroke_index": 8, "yardage": 375},
    {"hole_number": 18, "par": 4, "stroke_index": 12, "yardage": 340}
  ]
}

Critical rules:
- Return EXACTLY 18 holes
- stroke_index: the SI / Hdcp / Index / HCP column — 1 is hardest, 18 is easiest
- yardage: yards for the tee colour being read
- par: 3, 4 or 5 only
- course_rating and slope_rating: from the ratings box on the card if visible, otherwise estimate
- course_name: read from the top of the scorecard
- If a value is unclear, make a reasonable estimate — do not leave anything null
- ONLY output the JSON, no explanation, no markdown, no code blocks`,
            },
          ],
        }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `Claude API error ${response.status}`);

    const text = data.content?.map((c) => c.text || "").join("") || "";
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("Could not parse scorecard from image");

    const parsed = JSON.parse(text.slice(start, end + 1));
    if (!parsed.holes || parsed.holes.length !== 18) {
      throw new Error(`Expected 18 holes, got ${parsed.holes?.length || 0}. Please retake the photo.`);
    }

    return res.status(200).json({
      success: true,
      course_name: parsed.course_name || courseName || "Golf Club",
      tee: parsed.tee || tee,
      par: parsed.par || 72,
      course_rating: parsed.course_rating || 70.0,
      slope_rating: parsed.slope_rating || 120,
      total_yardage: parsed.total_yardage || 0,
      holes: parsed.holes.map((h) => ({
        hole_number: Number(h.hole_number),
        par: Number(h.par),
        stroke_index: Number(h.stroke_index),
        yardage: Number(h.yardage),
        metres: null,
      })),
    });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message || "Failed to scan scorecard" });
  }
}
