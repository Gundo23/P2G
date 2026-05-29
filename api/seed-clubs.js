// seed-clubs.js
// Run once locally: node seed-clubs.js
// Requires: npm install @supabase/supabase-js node-fetch
//
// Set these env vars before running:
//   SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
//   UK_GOLF_API_KEY=your-rapidapi-key

import { createClient } from "@supabase/supabase-js";

const API_HOST = "uk-golf-course-data-api.p.rapidapi.com";
const API_KEY = process.env.UK_GOLF_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing env vars. Set UK_GOLF_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const normalise = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

async function fetchPage(page) {
  const res = await fetch(
    `https://${API_HOST}/clubs?page=${page}&per_page=20`,
    {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error(`API error ${res.status} on page ${page}`);
  return res.json();
}

async function seed() {
  console.log("Fetching page 1 to get total pages...");
  const first = await fetchPage(1);
  const totalPages = first.total_pages || 134;
  console.log(`Total pages: ${totalPages} (${first.total} clubs)`);

  let allClubs = [...(first.clubs || [])];

  for (let page = 2; page <= totalPages; page++) {
    // Stay within rate limit — 5 req/min on Basic, 20/min on Pro
    // Wait 400ms between requests = ~2.5 req/sec = safe for Pro
    await new Promise((r) => setTimeout(r, 400));

    try {
      const data = await fetchPage(page);
      allClubs = [...allClubs, ...(data.clubs || [])];
      process.stdout.write(`\rFetched page ${page}/${totalPages} (${allClubs.length} clubs)`);
    } catch (err) {
      console.error(`\nFailed page ${page}: ${err.message} — retrying in 5s`);
      await new Promise((r) => setTimeout(r, 5000));
      try {
        const data = await fetchPage(page);
        allClubs = [...allClubs, ...(data.clubs || [])];
      } catch (err2) {
        console.error(`\nSkipping page ${page}: ${err2.message}`);
      }
    }
  }

  console.log(`\n\nTotal clubs fetched: ${allClubs.length}`);
  console.log("Upserting to Supabase...");

  // Batch upsert in chunks of 500
  const chunkSize = 500;
  for (let i = 0; i < allClubs.length; i += chunkSize) {
    const chunk = allClubs.slice(i, i + chunkSize).map((c) => ({
      id: c.id,
      name: c.name,
      city: c.city || null,
      county: c.county || null,
      postcode: c.postcode || null,
      country_code: c.country_code || null,
      normalised_name: normalise(c.name),
    }));

    const { error } = await supabase
      .from("clubs")
      .upsert(chunk, { onConflict: "id" });

    if (error) {
      console.error(`Supabase error on chunk ${i}:`, error.message);
    } else {
      console.log(`Upserted clubs ${i + 1}–${Math.min(i + chunkSize, allClubs.length)}`);
    }
  }

  console.log("Done! clubs table is populated.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
