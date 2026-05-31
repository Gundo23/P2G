import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const APP_USER = "pg2";
const APP_PASS = "golf2026";
const ADMIN_PASS = "1234";

const defaultPlayers = [
  { name: "Incey", handicap: 13.4 },
  { name: "Mark Weston", handicap: 15.3 },
  { name: "Ray", handicap: 18.1 },
  { name: "Liam G", handicap: 20.0 },
  { name: "Sam", handicap: 20.7 },
  { name: "Paul Davies", handicap: 20.7 },
  { name: "Franno", handicap: 21.0 },
  { name: "Lewis", handicap: 20.9 },
  { name: "R Boon", handicap: 23.6 },
  { name: "Gary K", handicap: 24.1 },
  { name: "James", handicap: 26.5 },
  { name: "Colin", handicap: 35.9 },
  { name: "Lloydy", handicap: 37.0 },
  { name: "Jack", handicap: 44.1 },
];

const defaultCourses = [
  { name: "Aldersey Green Golf Club", tee: "Yellow", par: 70, rating: 70.1, slope: 123 },
  { name: "Alwoodley Golf Club", tee: "Yellow", par: 72, rating: 73.0, slope: 138 },
  { name: "Ashton-under-Lyne Golf Club", tee: "Yellow", par: 70, rating: 69.8, slope: 126 },
  { name: "Astbury Golf Club", tee: "Yellow", par: 72, rating: 71.4, slope: 131 },
  { name: "Aldersey Green", tee: "Yellow", par: 70, rating: 70.1, slope: 123 },
  { name: "Beeston Fields Golf Club", tee: "Yellow", par: 71, rating: 70.5, slope: 128 },
  { name: "Blackpool North Shore Golf Club", tee: "Yellow", par: 72, rating: 71.2, slope: 130 },
  { name: "Bolton Old Links Golf Club", tee: "Yellow", par: 71, rating: 69.9, slope: 125 },
  { name: "Bradford Golf Club", tee: "Yellow", par: 71, rating: 70.8, slope: 129 },
  { name: "Bromborough Golf Club", tee: "Yellow", par: 70, rating: 69.1, slope: 122 },
  { name: "Caldy Golf Club", tee: "Yellow", par: 70, rating: 70.4, slope: 129 },
  { name: "Carlisle Golf Club", tee: "Yellow", par: 71, rating: 70.2, slope: 126 },
  { name: "Chester Golf Club", tee: "Yellow", par: 70, rating: 68.9, slope: 121 },
  { name: "Chorlton-cum-Hardy Golf Club", tee: "Yellow", par: 70, rating: 69.3, slope: 123 },
  { name: "Conwy Golf Club", tee: "Yellow", par: 72, rating: 72.5, slope: 136 },
  { name: "Coxmoor Golf Club", tee: "Yellow", par: 71, rating: 71.8, slope: 134 },
  { name: "Dean Wood Golf Club", tee: "Yellow", par: 71, rating: 70.6, slope: 128 },
  { name: "Delamere Forest Golf Club", tee: "Yellow", par: 72, rating: 72.1, slope: 135 },
  { name: "Dewsbury District Golf Club", tee: "Yellow", par: 71, rating: 70.2, slope: 127 },
  { name: "Didsbury Golf Club", tee: "Yellow", par: 70, rating: 69.7, slope: 124 },
  { name: "Dore & Totley Golf Club", tee: "Yellow", par: 70, rating: 69.8, slope: 125 },
  { name: "Eaton Golf Club", tee: "Yellow", par: 71, rating: 70.5, slope: 128 },
  { name: "Eastham Lodge Golf Club", tee: "Yellow", par: 72, rating: 70.0, slope: 120 },
  { name: "Ellesmere Port Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 130 },
  { name: "Fairhaven Golf Club", tee: "Yellow", par: 71, rating: 70.5, slope: 128 },
  { name: "Fleetwood Golf Club", tee: "Yellow", par: 71, rating: 70.1, slope: 126 },
  { name: "Formby Golf Club", tee: "Yellow", par: 72, rating: 73.2, slope: 139 },
  { name: "Formby Ladies Golf Club", tee: "Yellow", par: 72, rating: 71.1, slope: 131 },
  { name: "Fulford Golf Club", tee: "Yellow", par: 71, rating: 71.9, slope: 134 },
  { name: "Ganton Golf Club", tee: "Yellow", par: 72, rating: 72.8, slope: 137 },
  { name: "Halifax Bradley Hall Golf Club", tee: "Yellow", par: 70, rating: 69.5, slope: 124 },
  { name: "Hallamshire Golf Club", tee: "Yellow", par: 70, rating: 70.0, slope: 126 },
  { name: "Harrogate Golf Club", tee: "Yellow", par: 71, rating: 70.7, slope: 129 },
  { name: "Hawarden Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 123 },
  { name: "Headingley Golf Club", tee: "Yellow", par: 70, rating: 69.9, slope: 125 },
  { name: "Hesketh Golf Club", tee: "Yellow", par: 72, rating: 70.8, slope: 128 },
  { name: "Holywell Golf Club", tee: "Yellow", par: 69, rating: 68.8, slope: 120 },
  { name: "Huddersfield Golf Club", tee: "Yellow", par: 71, rating: 71.0, slope: 130 },
  { name: "Ilkley Golf Club", tee: "Yellow", par: 69, rating: 69.2, slope: 124 },
  { name: "Keighley Golf Club", tee: "Yellow", par: 70, rating: 69.3, slope: 122 },
  { name: "Lancaster Golf Club", tee: "Yellow", par: 71, rating: 70.4, slope: 127 },
  { name: "Leasowe Golf Club", tee: "Yellow", par: 71, rating: 71.4, slope: 129 },
  { name: "Leeds Golf Club", tee: "Yellow", par: 70, rating: 70.3, slope: 128 },
  { name: "Lightcliffe Golf Club", tee: "Yellow", par: 69, rating: 68.8, slope: 121 },
  { name: "Lindrick Golf Club", tee: "Yellow", par: 71, rating: 72.2, slope: 135 },
  { name: "Lymm Golf Club", tee: "Yellow", par: 71, rating: 69.8, slope: 124 },
  { name: "Maesdu Golf Club", tee: "Yellow", par: 70, rating: 69.7, slope: 124 },
  { name: "Manchester Golf Club", tee: "Yellow", par: 72, rating: 72.0, slope: 134 },
  { name: "Meltham Golf Club", tee: "Yellow", par: 71, rating: 70.5, slope: 128 },
  { name: "Mold Golf Club", tee: "Yellow", par: 69, rating: 69.0, slope: 122 },
  { name: "Moor Allerton Golf Club", tee: "Yellow", par: 71, rating: 70.9, slope: 129 },
  { name: "Moortown Golf Club", tee: "Yellow", par: 71, rating: 72.4, slope: 136 },
  { name: "Morecambe Golf Club", tee: "Yellow", par: 71, rating: 69.6, slope: 123 },
  { name: "North Wales Golf Club", tee: "Yellow", par: 71, rating: 71.2, slope: 131 },
  { name: "Northenden Golf Club", tee: "Yellow", par: 70, rating: 69.1, slope: 122 },
  { name: "Old Padeswood Golf Club", tee: "Yellow", par: 71, rating: 70.3, slope: 126 },
  { name: "Otley Golf Club", tee: "Yellow", par: 71, rating: 69.8, slope: 125 },
  { name: "Pannal Golf Club", tee: "Yellow", par: 70, rating: 70.8, slope: 130 },
  { name: "Pennant Park Golf Club", tee: "Yellow", par: 71, rating: 70.9, slope: 129 },
  { name: "Penrith Golf Club", tee: "Yellow", par: 70, rating: 69.7, slope: 124 },
  { name: "Prestatyn Golf Club", tee: "Yellow", par: 71, rating: 70.8, slope: 129 },
  { name: "Prestbury Golf Club", tee: "Yellow", par: 71, rating: 71.3, slope: 132 },
  { name: "Prenton Golf Club", tee: "Yellow", par: 71, rating: 69.9, slope: 124 },
  { name: "Rhuddlan Golf Club", tee: "Yellow", par: 69, rating: 68.9, slope: 121 },
  { name: "Rotherham Golf Club", tee: "Yellow", par: 70, rating: 70.4, slope: 128 },
  { name: "Royal Liverpool Golf Club", tee: "Yellow", par: 72, rating: 73.1, slope: 138 },
  { name: "Rudding Park Golf Club", tee: "Yellow", par: 72, rating: 71.6, slope: 132 },
  { name: "Saddleworth Golf Club", tee: "Yellow", par: 71, rating: 70.7, slope: 129 },
  { name: "Sand Moor Golf Club", tee: "Yellow", par: 71, rating: 71.3, slope: 132 },
  { name: "Sandiway Golf Club", tee: "Yellow", par: 70, rating: 69.8, slope: 126 },
  { name: "Sherwood Forest Golf Club", tee: "Yellow", par: 71, rating: 71.7, slope: 133 },
  { name: "Silloth on Solway Golf Club", tee: "Yellow", par: 72, rating: 72.3, slope: 137 },
  { name: "Skipton Golf Club", tee: "Yellow", par: 70, rating: 69.5, slope: 123 },
  { name: "Southport & Ainsdale Golf Club", tee: "Yellow", par: 71, rating: 71.9, slope: 134 },
  { name: "Stockport Golf Club", tee: "Yellow", par: 71, rating: 70.6, slope: 129 },
  { name: "Upton-by-Chester Golf Club", tee: "Yellow", par: 71, rating: 70.1, slope: 125 },
  { name: "Vicars Cross Golf Club", tee: "Yellow", par: 71, rating: 69.7, slope: 123 },
  { name: "Wakefield Golf Club", tee: "Yellow", par: 70, rating: 69.7, slope: 124 },
  { name: "Wallasey Golf Club", tee: "Yellow", par: 72, rating: 71.5, slope: 133 },
  { name: "The Warren Municipal Golf Club", tee: "Yellow", par: 72, rating: 70.0, slope: 120 },
  { name: "Warrington Golf Club", tee: "Yellow", par: 71, rating: 70.2, slope: 127 },
  { name: "West Lancashire Golf Club", tee: "Yellow", par: 72, rating: 72.4, slope: 136 },
  { name: "Wilmslow Golf Club", tee: "Yellow", par: 72, rating: 71.8, slope: 133 },
  { name: "Withington Golf Club", tee: "Yellow", par: 71, rating: 70.7, slope: 128 },
  { name: "Workington Golf Club", tee: "Yellow", par: 72, rating: 71.0, slope: 129 },
  { name: "Worsley Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 123 },
];


const LEASOWE_FALLBACK_SCORECARD = {
  course_id: "3b36d523-65e4-4834-93e5-496f27a67b55",
  course_name: "Leasowe Golf Club",
  tee_set: {
    id: "8a278b30-e89f-4f90-85b8-d24d8bf9db59",
    name: null,
    colour: "yellow",
    gender: null,
    total_yardage: 6282,
    total_metres: null,
    par: 71,
    course_rating: 71.4,
    slope_rating: 129,
    holes: [
      { hole_number: 1, par: 4, stroke_index: 17, yardage: 247, metres: null },
      { hole_number: 2, par: 4, stroke_index: 9, yardage: 298, metres: null },
      { hole_number: 3, par: 3, stroke_index: 13, yardage: 147, metres: null },
      { hole_number: 4, par: 4, stroke_index: 1, yardage: 456, metres: null },
      { hole_number: 5, par: 4, stroke_index: 7, yardage: 339, metres: null },
      { hole_number: 6, par: 5, stroke_index: 11, yardage: 561, metres: null },
      { hole_number: 7, par: 4, stroke_index: 5, yardage: 397, metres: null },
      { hole_number: 8, par: 4, stroke_index: 15, yardage: 277, metres: null },
      { hole_number: 9, par: 4, stroke_index: 3, yardage: 439, metres: null },
      { hole_number: 10, par: 4, stroke_index: 4, yardage: 478, metres: null },
      { hole_number: 11, par: 4, stroke_index: 16, yardage: 297, metres: null },
      { hole_number: 12, par: 3, stroke_index: 18, yardage: 156, metres: null },
      { hole_number: 13, par: 4, stroke_index: 8, yardage: 316, metres: null },
      { hole_number: 14, par: 4, stroke_index: 14, yardage: 354, metres: null },
      { hole_number: 15, par: 4, stroke_index: 6, yardage: 392, metres: null },
      { hole_number: 16, par: 4, stroke_index: 2, yardage: 395, metres: null },
      { hole_number: 17, par: 5, stroke_index: 12, yardage: 548, metres: null },
      { hole_number: 18, par: 3, stroke_index: 10, yardage: 185, metres: null },
    ],
  },
};

function isLeasoweCourseName(value) {
  return String(value || "").toLowerCase().includes("leasowe");
}

const achievementOptions = [
  { key: "winner", label: "Competition Winner", icon: "🏆" },
  { key: "par", label: "Made a Par", icon: "✅" },
  { key: "birdie", label: "Made a Birdie", icon: "🐦" },
  { key: "eagle", label: "Made an Eagle", icon: "🦅" },
  { key: "broke100", label: "Broke 100", icon: "💯" },
  { key: "broke90", label: "Broke 90", icon: "9️⃣" },
  { key: "broke80", label: "Broke 80", icon: "8️⃣" },
  { key: "broke70", label: "Broke 70", icon: "🔥" },
  { key: "holeInOne", label: "Hole in One", icon: "🎯" },
];

function courseKey(course) {
  return `${course.name}__${course.tee}`;
}

function normaliseName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function nameKey(name) {
  return normaliseName(name).replace(/[^a-z0-9]/g, "");
}

function nameTokens(name) {
  return normaliseName(name)
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);
}

function titleCaseCourseName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (["of", "and", "the", "&"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/golf club$/i, "Golf Club");
}

function buildTypedCourseFromSearch(searchText) {
  const cleaned = String(searchText || "").trim();
  if (!cleaned) return null;

  const name = /golf\s+club$/i.test(cleaned)
    ? titleCaseCourseName(cleaned)
    : `${titleCaseCourseName(cleaned)} Golf Club`;

  return {
    name,
    tee: "Yellow",
    par: 72,
    rating: 72.0,
    slope: 120,
    typedSearchCourse: true,
  };
}

function findPlayerByName(players, playerName) {
  const wanted = nameKey(playerName);

  return players.find((p) => {
    const current = nameKey(p.name);
    return (
      current === wanted ||
      current.includes(wanted) ||
      wanted.includes(current)
    );
  });
}

function roundBelongsToPlayer(round, playerName) {
  const roundKey = nameKey(round?.player || "");
  const playerKey = nameKey(playerName || "");

  if (!roundKey || !playerKey) return false;

  return roundKey === playerKey;
}

function getRawRoundPlayerNames(rounds) {
  return [...new Set(rounds.map((r) => r.player).filter(Boolean))].sort();
}

function round1(value) {
  return Math.round(Number(value) * 10) / 10;
}

function differential(score, rating, slope) {
  return ((Number(score) - Number(rating)) * 113) / Number(slope);
}

function currentSystem(oldHandicap, score, points, course) {
  let roundLevel = Number(oldHandicap);
  if (points) roundLevel = Number(oldHandicap) + (36 - Number(points));
  else if (score) roundLevel = differential(score, course.rating, course.slope);
  return round1((Number(oldHandicap) + Number(roundLevel)) / 2);
}

function whsScoreDifferential(score, course) {
  return round1(
    ((Number(score) - Number(course.rating)) * 113) / Number(course.slope)
  );
}

function calculateWHSHandicapFromDifferentials(differentials, startingHandicap) {
  const validDiffs = differentials
    .map((d) => Number(d))
    .filter((d) => Number.isFinite(d))
    .sort((a, b) => a - b);

  const count = validDiffs.length;

  if (count < 3) {
    return round1(startingHandicap);
  }

  let numberToUse = 1;
  let adjustment = 0;

  if (count === 3) {
    numberToUse = 1;
    adjustment = -2;
  } else if (count === 4) {
    numberToUse = 1;
    adjustment = -1;
  } else if (count === 5) {
    numberToUse = 1;
    adjustment = 0;
  } else if (count === 6) {
    numberToUse = 2;
    adjustment = -1;
  } else if (count >= 7 && count <= 8) {
    numberToUse = 2;
  } else if (count >= 9 && count <= 11) {
    numberToUse = 3;
  } else if (count >= 12 && count <= 14) {
    numberToUse = 4;
  } else if (count >= 15 && count <= 16) {
    numberToUse = 5;
  } else if (count >= 17 && count <= 18) {
    numberToUse = 6;
  } else if (count === 19) {
    numberToUse = 7;
  } else {
    numberToUse = 8;
  }

  const scoresToUse = validDiffs.slice(0, numberToUse);
  const average =
    scoresToUse.reduce((sum, d) => sum + d, 0) / scoresToUse.length;

  return round1(average + adjustment);
}

function stablefordHandicapAdjustment(oldHandicap, points, didWin) {
  const stableford = Number(points || 0);
  let change = 0;

  if (stableford >= 42) change = -1.5;
  else if (stableford >= 39) change = -1.0;
  else if (stableford >= 37) change = -0.5;
  else if (stableford >= 35) change = 0;
  else if (stableford >= 33) change = 0.1;
  else if (stableford >= 30) change = 0.2;
  else change = 0.3;

  if (didWin) change -= 0.3;

  return round1(Math.max(0, Number(oldHandicap) + change));
}

function intelligentHandicap(player, allRounds, score, points, course) {
  const oldHandicap = Number(player.handicap);

  if (!score) {
    return {
      newHandicap: oldHandicap,
      differential: "",
      intelligenceUsed: false,
    };
  }

  const newDifferential = whsScoreDifferential(score, course);

  const playerRounds = allRounds
    .filter((r) => roundBelongsToPlayer(r, player.name))
    .filter((r) => r.differential !== "" && r.differential !== null && r.differential !== undefined)
    .slice(0, 19);

  const differentials = [
    newDifferential,
    ...playerRounds.map((r) => Number(r.differential)),
  ];

  const calculatedHandicap = calculateWHSHandicapFromDifferentials(
    differentials,
    oldHandicap
  );

  return {
    newHandicap: calculatedHandicap,
    differential: newDifferential,
    intelligenceUsed: differentials.length >= 3,
  };
}

function buildTrendPoints(rounds, playerName) {
  return rounds
    .filter((r) => roundBelongsToPlayer(r, playerName))
    .slice()
    .reverse()
    .map((round) => ({
      label: round.date || "",
      handicap: Number(round.newHandicap),
    }));
}

function TrendGraph({ points }) {
  if (!points.length) return <p>No handicap trend yet.</p>;

  const width = 360;
  const height = 220;
  const paddingLeft = 44;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 48;

  const min = 0;
  const max = 50;
  const range = max - min;
  const yTicks = [0, 10, 20, 30, 40, 50];

  const plotted = points.map((point, index) => {
    const safeHandicap = Math.max(min, Math.min(max, Number(point.handicap) || 0));

    const x =
      points.length === 1
        ? paddingLeft + (width - paddingLeft - paddingRight) / 2
        : paddingLeft +
          (index * (width - paddingLeft - paddingRight)) /
            (points.length - 1);

    const y =
      height -
      paddingBottom -
      ((safeHandicap - min) / range) *
        (height - paddingTop - paddingBottom);

    return { ...point, x, y, safeHandicap };
  });

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
      {yTicks.map((tick) => {
        const y =
          height -
          paddingBottom -
          ((tick - min) / range) *
            (height - paddingTop - paddingBottom);

        return (
          <g key={tick}>
            <line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="#e2e8f0"
            />
            <text
              x={paddingLeft - 10}
              y={y + 4}
              fontSize="10"
              textAnchor="end"
              fill="#64748b"
            >
              {tick}
            </text>
          </g>
        );
      })}

      <line
        x1={paddingLeft}
        y1={paddingTop}
        x2={paddingLeft}
        y2={height - paddingBottom}
        stroke="#cbd5e1"
      />

      <line
        x1={paddingLeft}
        y1={height - paddingBottom}
        x2={width - paddingRight}
        y2={height - paddingBottom}
        stroke="#cbd5e1"
      />

      <polyline
        fill="none"
        stroke="#0f172a"
        strokeWidth="3"
        points={plotted.map((p) => `${p.x},${p.y}`).join(" ")}
      />

      {plotted.map((p, index) => (
        <g key={`${p.label}-${index}`}>
          <circle cx={p.x} cy={p.y} r="5" fill="#0f172a" />

          <text
            x={p.x}
            y={p.y - 9}
            fontSize="10"
            textAnchor="middle"
            fill="#0f172a"
          >
            {Number(p.handicap).toFixed(1)}
          </text>

          <text
            x={p.x}
            y={height - paddingBottom + 18}
            fontSize="9"
            textAnchor="middle"
            fill="#64748b"
            transform={`rotate(35 ${p.x} ${height - paddingBottom + 18})`}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BadgeList({ badges }) {
  const unlocked = achievementOptions.filter((a) => badges?.[a.key]);
  if (!unlocked.length) return <p className="muted">No badges unlocked yet.</p>;

  return (
    <div className="badge-grid">
      {unlocked.map((badge) => (
        <div className="badge-pill" key={badge.key}>
          <span>{badge.icon}</span>{badge.label}
        </div>
      ))}
    </div>
  );
}

function shortBadgeLabel(label) {
  return String(label || "")
    .replace("Competition Winner", "Winner")
    .replace("Made a ", "")
    .replace("Hole in One", "HIO");
}

function StandingsBadgeList({ badges }) {
  const unlocked = achievementOptions.filter((a) => badges?.[a.key]);

  if (!unlocked.length) {
    return <p className="standings-badge-empty">No badges yet</p>;
  }

  return (
    <div className="standings-badge-block">
      <div className="standings-badge-title">Badges</div>
      <div className="standings-badge-grid">
        {unlocked.map((badge) => (
          <span className="standings-badge-pill" key={badge.key} title={badge.label}>
            <span className="standings-badge-icon">{badge.icon}</span>
            <span>{shortBadgeLabel(badge.label)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}


function analyseHoleScores(holes, holeScores, pickedUpHoles = {}) {
  if (!holes?.length) {
    return {
      complete: false,
      gross: "",
      grossValid: false,
      stablefordComplete: false,
      pars: 0,
      birdies: 0,
      eagles: 0,
      holeInOnes: 0,
      frontNine: "",
      backNine: "",
      pickedUpCount: 0,
    };
  }

  const stablefordComplete = holes.every((hole) => {
    if (pickedUpHoles[hole.hole_number]) return true;
    return Number(holeScores[hole.hole_number] || 0) > 0;
  });

  const pickedUpCount = holes.filter((hole) => pickedUpHoles[hole.hole_number]).length;
  const grossValid = stablefordComplete && pickedUpCount === 0;

  if (!stablefordComplete) {
    return {
      complete: false,
      gross: "",
      grossValid: false,
      stablefordComplete: false,
      pars: 0,
      birdies: 0,
      eagles: 0,
      holeInOnes: 0,
      frontNine: "",
      backNine: "",
      pickedUpCount,
    };
  }

  let pars = 0;
  let birdies = 0;
  let eagles = 0;
  let holeInOnes = 0;

  holes.forEach((hole) => {
    if (pickedUpHoles[hole.hole_number]) return;

    const gross = Number(holeScores[hole.hole_number]);
    const par = Number(hole.par);
    const againstPar = gross - par;

    if (againstPar === 0) pars += 1;
    if (againstPar === -1) birdies += 1;
    if (againstPar <= -2) eagles += 1;
    if (gross === 1) holeInOnes += 1;
  });

  const frontNineScores = holes
    .slice(0, 9)
    .map((hole) =>
      pickedUpHoles[hole.hole_number]
        ? 0
        : Number(holeScores[hole.hole_number] || 0)
    );

  const backNineScores = holes
    .slice(9, 18)
    .map((hole) =>
      pickedUpHoles[hole.hole_number]
        ? 0
        : Number(holeScores[hole.hole_number] || 0)
    );

  return {
    complete: stablefordComplete,
    gross: grossValid
      ? holes.reduce((sum, hole) => sum + Number(holeScores[hole.hole_number]), 0)
      : "NR",
    grossValid,
    stablefordComplete,
    pars,
    birdies,
    eagles,
    holeInOnes,
    frontNine: grossValid ? frontNineScores.reduce((sum, n) => sum + n, 0) : "NR",
    backNine: grossValid ? backNineScores.reduce((sum, n) => sum + n, 0) : "NR",
    pickedUpCount,
  };
}


function getShotsForHole(handicap, strokeIndex) {
  const playingHandicap = Math.max(0, Math.round(Number(handicap) || 0));
  const si = Number(strokeIndex) || 18;
  const baseShots = Math.floor(playingHandicap / 18);
  const extraShots = playingHandicap % 18;

  return baseShots + (si <= extraShots ? 1 : 0);
}


function calculateHoleStablefordPoint(hole, grossScore, playerHandicap, course, pickedUp = false) {
  if (pickedUp) return 0;

  const gross = Number(grossScore || 0);
  if (!hole || gross <= 0) return "";

  const courseHandicap = Math.max(
    0,
    Math.round(
      Number(playerHandicap || 0) * (Number(course?.slope || 113) / 113) +
        (Number(course?.rating || course?.par || 72) - Number(course?.par || 72))
    )
  );

  const par = Number(hole.par);
  const shots = getShotsForHole(courseHandicap, hole.stroke_index);
  const netScore = gross - shots;

  return Math.max(0, 2 + (par - netScore));
}

function calculateStablefordPoints(holes, holeScores, playerHandicap, course, pickedUpHoles = {}) {
  if (!holes?.length) return "";

  const complete = holes.every((hole) => {
    if (pickedUpHoles[hole.hole_number]) return true;
    return Number(holeScores[hole.hole_number] || 0) > 0;
  });

  if (!complete) return "";

  const courseHandicap = Math.max(
    0,
    Math.round(
      Number(playerHandicap || 0) * (Number(course?.slope || 113) / 113) +
        (Number(course?.rating || course?.par || 72) - Number(course?.par || 72))
    )
  );

  return holes.reduce((total, hole) => {
    if (pickedUpHoles[hole.hole_number]) return total;

    const gross = Number(holeScores[hole.hole_number]);
    const par = Number(hole.par);
    const shots = getShotsForHole(courseHandicap, hole.stroke_index);
    const netScore = gross - shots;
    const points = Math.max(0, 2 + (par - netScore));

    return total + points;
  }, 0);
}


const HARDCODED_SCORECARDS = {
  "leasowe golf club": {
    course_name: "Leasowe Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 71.4,
      slope_rating: 129,
      total_yardage: 6282,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 17, yardage: 247, metres: null },
        { hole_number: 2, par: 4, stroke_index: 9, yardage: 298, metres: null },
        { hole_number: 3, par: 3, stroke_index: 13, yardage: 147, metres: null },
        { hole_number: 4, par: 4, stroke_index: 1, yardage: 456, metres: null },
        { hole_number: 5, par: 4, stroke_index: 7, yardage: 339, metres: null },
        { hole_number: 6, par: 5, stroke_index: 11, yardage: 561, metres: null },
        { hole_number: 7, par: 4, stroke_index: 5, yardage: 397, metres: null },
        { hole_number: 8, par: 4, stroke_index: 15, yardage: 277, metres: null },
        { hole_number: 9, par: 4, stroke_index: 3, yardage: 439, metres: null },
        { hole_number: 10, par: 4, stroke_index: 4, yardage: 478, metres: null },
        { hole_number: 11, par: 4, stroke_index: 16, yardage: 297, metres: null },
        { hole_number: 12, par: 3, stroke_index: 18, yardage: 156, metres: null },
        { hole_number: 13, par: 4, stroke_index: 8, yardage: 316, metres: null },
        { hole_number: 14, par: 4, stroke_index: 14, yardage: 354, metres: null },
        { hole_number: 15, par: 4, stroke_index: 6, yardage: 392, metres: null },
        { hole_number: 16, par: 4, stroke_index: 2, yardage: 395, metres: null },
        { hole_number: 17, par: 5, stroke_index: 12, yardage: 548, metres: null },
        { hole_number: 18, par: 3, stroke_index: 10, yardage: 185, metres: null },
      ],
    },
  },
  "wallasey golf club": {
    course_name: "Wallasey Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 71.9,
      slope_rating: 132,
      total_yardage: 6319,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 11, yardage: 349, metres: null },
        { hole_number: 2, par: 4, stroke_index: 5, yardage: 441, metres: null },
        { hole_number: 3, par: 4, stroke_index: 7, yardage: 360, metres: null },
        { hole_number: 4, par: 5, stroke_index: 1, yardage: 512, metres: null },
        { hole_number: 5, par: 3, stroke_index: 15, yardage: 166, metres: null },
        { hole_number: 6, par: 4, stroke_index: 13, yardage: 339, metres: null },
        { hole_number: 7, par: 5, stroke_index: 3, yardage: 501, metres: null },
        { hole_number: 8, par: 4, stroke_index: 9, yardage: 381, metres: null },
        { hole_number: 9, par: 3, stroke_index: 17, yardage: 137, metres: null },
        { hole_number: 10, par: 4, stroke_index: 12, yardage: 301, metres: null },
        { hole_number: 11, par: 4, stroke_index: 8, yardage: 348, metres: null },
        { hole_number: 12, par: 3, stroke_index: 18, yardage: 137, metres: null },
        { hole_number: 13, par: 5, stroke_index: 2, yardage: 528, metres: null },
        { hole_number: 14, par: 5, stroke_index: 16, yardage: 470, metres: null },
        { hole_number: 15, par: 4, stroke_index: 6, yardage: 340, metres: null },
        { hole_number: 16, par: 3, stroke_index: 14, yardage: 193, metres: null },
        { hole_number: 17, par: 4, stroke_index: 4, yardage: 448, metres: null },
        { hole_number: 18, par: 4, stroke_index: 10, yardage: 368, metres: null },
      ],
    },
  },
  "the warren municipal golf club": {
    course_name: "The Warren Municipal Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 70.0,
      slope_rating: 120,
      total_yardage: 5656,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 13, yardage: 276, metres: null },
        { hole_number: 2, par: 4, stroke_index: 17, yardage: 255, metres: null },
        { hole_number: 3, par: 5, stroke_index: 1, yardage: 429, metres: null },
        { hole_number: 4, par: 4, stroke_index: 7, yardage: 313, metres: null },
        { hole_number: 5, par: 4, stroke_index: 11, yardage: 280, metres: null },
        { hole_number: 6, par: 3, stroke_index: 15, yardage: 162, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 325, metres: null },
        { hole_number: 8, par: 4, stroke_index: 3, yardage: 367, metres: null },
        { hole_number: 9, par: 5, stroke_index: 5, yardage: 496, metres: null },
        { hole_number: 10, par: 4, stroke_index: 16, yardage: 286, metres: null },
        { hole_number: 11, par: 4, stroke_index: 18, yardage: 245, metres: null },
        { hole_number: 12, par: 4, stroke_index: 2, yardage: 420, metres: null },
        { hole_number: 13, par: 4, stroke_index: 4, yardage: 305, metres: null },
        { hole_number: 14, par: 4, stroke_index: 14, yardage: 273, metres: null },
        { hole_number: 15, par: 3, stroke_index: 8, yardage: 155, metres: null },
        { hole_number: 16, par: 4, stroke_index: 12, yardage: 322, metres: null },
        { hole_number: 17, par: 4, stroke_index: 6, yardage: 359, metres: null },
        { hole_number: 18, par: 5, stroke_index: 10, yardage: 481, metres: null },
      ],
    },
  },
  "warren golf course": null,
  "the warren golf course": null,
  "royal liverpool golf club": {
    course_name: "Royal Liverpool Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 72.2,
      slope_rating: 139,
      total_yardage: 6481,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 5, yardage: 411, metres: null },
        { hole_number: 2, par: 4, stroke_index: 13, yardage: 361, metres: null },
        { hole_number: 3, par: 5, stroke_index: 11, yardage: 503, metres: null },
        { hole_number: 4, par: 3, stroke_index: 7, yardage: 176, metres: null },
        { hole_number: 5, par: 4, stroke_index: 1, yardage: 388, metres: null },
        { hole_number: 6, par: 4, stroke_index: 9, yardage: 363, metres: null },
        { hole_number: 7, par: 3, stroke_index: 15, yardage: 185, metres: null },
        { hole_number: 8, par: 5, stroke_index: 17, yardage: 481, metres: null },
        { hole_number: 9, par: 4, stroke_index: 3, yardage: 318, metres: null },
        { hole_number: 10, par: 4, stroke_index: 8, yardage: 385, metres: null },
        { hole_number: 11, par: 3, stroke_index: 14, yardage: 178, metres: null },
        { hole_number: 12, par: 4, stroke_index: 4, yardage: 396, metres: null },
        { hole_number: 13, par: 3, stroke_index: 16, yardage: 148, metres: null },
        { hole_number: 14, par: 5, stroke_index: 18, yardage: 496, metres: null },
        { hole_number: 15, par: 4, stroke_index: 2, yardage: 430, metres: null },
        { hole_number: 16, par: 5, stroke_index: 12, yardage: 487, metres: null },
        { hole_number: 17, par: 4, stroke_index: 6, yardage: 398, metres: null },
        { hole_number: 18, par: 4, stroke_index: 10, yardage: 377, metres: null },
      ],
    },
  },
  "caldy golf club": {
    course_name: "Caldy Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 71.6,
      slope_rating: 131,
      total_yardage: 6411,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 371, metres: null },
        { hole_number: 2, par: 3, stroke_index: 13, yardage: 153, metres: null },
        { hole_number: 3, par: 4, stroke_index: 9, yardage: 350, metres: null },
        { hole_number: 4, par: 4, stroke_index: 15, yardage: 330, metres: null },
        { hole_number: 5, par: 5, stroke_index: 5, yardage: 517, metres: null },
        { hole_number: 6, par: 4, stroke_index: 1, yardage: 387, metres: null },
        { hole_number: 7, par: 5, stroke_index: 11, yardage: 535, metres: null },
        { hole_number: 8, par: 3, stroke_index: 17, yardage: 142, metres: null },
        { hole_number: 9, par: 4, stroke_index: 3, yardage: 403, metres: null },
        { hole_number: 10, par: 3, stroke_index: 12, yardage: 181, metres: null },
        { hole_number: 11, par: 5, stroke_index: 8, yardage: 521, metres: null },
        { hole_number: 12, par: 4, stroke_index: 2, yardage: 427, metres: null },
        { hole_number: 13, par: 4, stroke_index: 16, yardage: 335, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 373, metres: null },
        { hole_number: 15, par: 4, stroke_index: 14, yardage: 345, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 397, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 146, metres: null },
        { hole_number: 18, par: 5, stroke_index: 10, yardage: 498, metres: null },
      ],
    },
  },
  "formby golf club": {
    course_name: "Formby Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 73.4,
      slope_rating: 136,
      total_yardage: 6502,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 11, yardage: 394, metres: null },
        { hole_number: 2, par: 4, stroke_index: 9, yardage: 370, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 501, metres: null },
        { hole_number: 4, par: 4, stroke_index: 15, yardage: 304, metres: null },
        { hole_number: 5, par: 3, stroke_index: 17, yardage: 153, metres: null },
        { hole_number: 6, par: 4, stroke_index: 5, yardage: 387, metres: null },
        { hole_number: 7, par: 4, stroke_index: 13, yardage: 368, metres: null },
        { hole_number: 8, par: 5, stroke_index: 7, yardage: 468, metres: null },
        { hole_number: 9, par: 4, stroke_index: 1, yardage: 448, metres: null },
        { hole_number: 10, par: 3, stroke_index: 16, yardage: 179, metres: null },
        { hole_number: 11, par: 4, stroke_index: 12, yardage: 377, metres: null },
        { hole_number: 12, par: 4, stroke_index: 4, yardage: 385, metres: null },
        { hole_number: 13, par: 4, stroke_index: 10, yardage: 370, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 413, metres: null },
        { hole_number: 15, par: 4, stroke_index: 2, yardage: 396, metres: null },
        { hole_number: 16, par: 3, stroke_index: 18, yardage: 120, metres: null },
        { hole_number: 17, par: 5, stroke_index: 8, yardage: 485, metres: null },
        { hole_number: 18, par: 4, stroke_index: 14, yardage: 384, metres: null },
      ],
    },
  },
  "west lancashire golf club": {
    course_name: "West Lancashire Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 73.4,
      slope_rating: 126,
      total_yardage: 6246,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 10, yardage: 359, metres: null },
        { hole_number: 2, par: 5, stroke_index: 6, yardage: 471, metres: null },
        { hole_number: 3, par: 3, stroke_index: 18, yardage: 150, metres: null },
        { hole_number: 4, par: 4, stroke_index: 4, yardage: 380, metres: null },
        { hole_number: 5, par: 4, stroke_index: 8, yardage: 405, metres: null },
        { hole_number: 6, par: 3, stroke_index: 16, yardage: 134, metres: null },
        { hole_number: 7, par: 4, stroke_index: 14, yardage: 320, metres: null },
        { hole_number: 8, par: 4, stroke_index: 2, yardage: 406, metres: null },
        { hole_number: 9, par: 4, stroke_index: 12, yardage: 390, metres: null },
        { hole_number: 10, par: 4, stroke_index: 11, yardage: 334, metres: null },
        { hole_number: 11, par: 5, stroke_index: 3, yardage: 540, metres: null },
        { hole_number: 12, par: 3, stroke_index: 15, yardage: 170, metres: null },
        { hole_number: 13, par: 4, stroke_index: 7, yardage: 358, metres: null },
        { hole_number: 14, par: 4, stroke_index: 1, yardage: 418, metres: null },
        { hole_number: 15, par: 4, stroke_index: 13, yardage: 339, metres: null },
        { hole_number: 16, par: 5, stroke_index: 5, yardage: 507, metres: null },
        { hole_number: 17, par: 3, stroke_index: 17, yardage: 155, metres: null },
        { hole_number: 18, par: 4, stroke_index: 9, yardage: 410, metres: null },
      ],
    },
  },
  "southport & ainsdale golf club": {
    course_name: "Southport & Ainsdale Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 72.5,
      slope_rating: 134,
      total_yardage: 6319,
      holes: [
        { hole_number: 1, par: 3, stroke_index: 13, yardage: 185, metres: null },
        { hole_number: 2, par: 5, stroke_index: 3, yardage: 504, metres: null },
        { hole_number: 3, par: 4, stroke_index: 11, yardage: 385, metres: null },
        { hole_number: 4, par: 4, stroke_index: 15, yardage: 313, metres: null },
        { hole_number: 5, par: 4, stroke_index: 1, yardage: 400, metres: null },
        { hole_number: 6, par: 4, stroke_index: 9, yardage: 372, metres: null },
        { hole_number: 7, par: 5, stroke_index: 5, yardage: 478, metres: null },
        { hole_number: 8, par: 3, stroke_index: 17, yardage: 147, metres: null },
        { hole_number: 9, par: 4, stroke_index: 7, yardage: 447, metres: null },
        { hole_number: 10, par: 3, stroke_index: 18, yardage: 158, metres: null },
        { hole_number: 11, par: 4, stroke_index: 4, yardage: 426, metres: null },
        { hole_number: 12, par: 4, stroke_index: 10, yardage: 387, metres: null },
        { hole_number: 13, par: 3, stroke_index: 16, yardage: 145, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 380, metres: null },
        { hole_number: 15, par: 4, stroke_index: 12, yardage: 333, metres: null },
        { hole_number: 16, par: 5, stroke_index: 2, yardage: 490, metres: null },
        { hole_number: 17, par: 4, stroke_index: 8, yardage: 430, metres: null },
        { hole_number: 18, par: 4, stroke_index: 14, yardage: 339, metres: null },
      ],
    },
  },
  "delamere forest golf club": {
    course_name: "Delamere Forest Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 70.5,
      slope_rating: 131,
      total_yardage: 6101,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 460, metres: null },
        { hole_number: 2, par: 5, stroke_index: 15, yardage: 458, metres: null },
        { hole_number: 3, par: 4, stroke_index: 5, yardage: 382, metres: null },
        { hole_number: 4, par: 3, stroke_index: 11, yardage: 194, metres: null },
        { hole_number: 5, par: 4, stroke_index: 2, yardage: 419, metres: null },
        { hole_number: 6, par: 3, stroke_index: 17, yardage: 137, metres: null },
        { hole_number: 7, par: 5, stroke_index: 9, yardage: 438, metres: null },
        { hole_number: 8, par: 4, stroke_index: 14, yardage: 416, metres: null },
        { hole_number: 9, par: 4, stroke_index: 13, yardage: 303, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 344, metres: null },
        { hole_number: 11, par: 5, stroke_index: 1, yardage: 498, metres: null },
        { hole_number: 12, par: 3, stroke_index: 16, yardage: 139, metres: null },
        { hole_number: 13, par: 4, stroke_index: 14, yardage: 287, metres: null },
        { hole_number: 14, par: 4, stroke_index: 8, yardage: 340, metres: null },
        { hole_number: 15, par: 4, stroke_index: 3, yardage: 287, metres: null },
        { hole_number: 16, par: 3, stroke_index: 18, yardage: 187, metres: null },
        { hole_number: 17, par: 4, stroke_index: 6, yardage: 337, metres: null },
        { hole_number: 18, par: 5, stroke_index: 12, yardage: 469, metres: null },
      ],
    },
  },
  "pannal golf club": {
    course_name: "Pannal Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 71.0,
      slope_rating: 130,
      total_yardage: 6195,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 9, yardage: 428, metres: null },
        { hole_number: 2, par: 4, stroke_index: 3, yardage: 383, metres: null },
        { hole_number: 3, par: 3, stroke_index: 13, yardage: 135, metres: null },
        { hole_number: 4, par: 5, stroke_index: 17, yardage: 456, metres: null },
        { hole_number: 5, par: 4, stroke_index: 7, yardage: 370, metres: null },
        { hole_number: 6, par: 4, stroke_index: 1, yardage: 393, metres: null },
        { hole_number: 7, par: 4, stroke_index: 11, yardage: 363, metres: null },
        { hole_number: 8, par: 4, stroke_index: 15, yardage: 333, metres: null },
        { hole_number: 9, par: 4, stroke_index: 5, yardage: 371, metres: null },
        { hole_number: 10, par: 3, stroke_index: 18, yardage: 117, metres: null },
        { hole_number: 11, par: 5, stroke_index: 12, yardage: 434, metres: null },
        { hole_number: 12, par: 4, stroke_index: 2, yardage: 427, metres: null },
        { hole_number: 13, par: 5, stroke_index: 14, yardage: 467, metres: null },
        { hole_number: 14, par: 4, stroke_index: 8, yardage: 332, metres: null },
        { hole_number: 15, par: 3, stroke_index: 4, yardage: 194, metres: null },
        { hole_number: 16, par: 5, stroke_index: 16, yardage: 477, metres: null },
        { hole_number: 17, par: 3, stroke_index: 6, yardage: 173, metres: null },
        { hole_number: 18, par: 4, stroke_index: 10, yardage: 342, metres: null },
      ],
    },
  },
  "aldersey green": {
    course_name: "Aldersey Green",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 70.1,
      slope_rating: 123,
      total_yardage: 5983,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 3, yardage: 413, metres: null },
        { hole_number: 2, par: 3, stroke_index: 17, yardage: 161, metres: null },
        { hole_number: 3, par: 3, stroke_index: 5, yardage: 217, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 351, metres: null },
        { hole_number: 5, par: 5, stroke_index: 1, yardage: 510, metres: null },
        { hole_number: 6, par: 4, stroke_index: 15, yardage: 290, metres: null },
        { hole_number: 7, par: 4, stroke_index: 7, yardage: 341, metres: null },
        { hole_number: 8, par: 4, stroke_index: 9, yardage: 372, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 484, metres: null },
        { hole_number: 10, par: 4, stroke_index: 18, yardage: 273, metres: null },
        { hole_number: 11, par: 3, stroke_index: 10, yardage: 189, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 551, metres: null },
        { hole_number: 13, par: 3, stroke_index: 14, yardage: 216, metres: null },
        { hole_number: 14, par: 4, stroke_index: 4, yardage: 397, metres: null },
        { hole_number: 15, par: 4, stroke_index: 6, yardage: 318, metres: null },
        { hole_number: 16, par: 3, stroke_index: 16, yardage: 167, metres: null },
        { hole_number: 17, par: 4, stroke_index: 8, yardage: 379, metres: null },
        { hole_number: 18, par: 4, stroke_index: 12, yardage: 354, metres: null },
      ],
    },
  },
  "ashton-under-lyne golf club": {
    course_name: "Ashton-under-Lyne Golf Club",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 69.6,
      slope_rating: 122,
      total_yardage: 6208,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 356, metres: null },
        { hole_number: 2, par: 5, stroke_index: 13, yardage: 481, metres: null },
        { hole_number: 3, par: 4, stroke_index: 3, yardage: 394, metres: null },
        { hole_number: 4, par: 3, stroke_index: 9, yardage: 176, metres: null },
        { hole_number: 5, par: 5, stroke_index: 17, yardage: 469, metres: null },
        { hole_number: 6, par: 4, stroke_index: 5, yardage: 324, metres: null },
        { hole_number: 7, par: 4, stroke_index: 15, yardage: 282, metres: null },
        { hole_number: 8, par: 4, stroke_index: 1, yardage: 430, metres: null },
        { hole_number: 9, par: 3, stroke_index: 11, yardage: 170, metres: null },
        { hole_number: 10, par: 4, stroke_index: 14, yardage: 333, metres: null },
        { hole_number: 11, par: 4, stroke_index: 2, yardage: 403, metres: null },
        { hole_number: 12, par: 3, stroke_index: 18, yardage: 154, metres: null },
        { hole_number: 13, par: 4, stroke_index: 8, yardage: 383, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 391, metres: null },
        { hole_number: 15, par: 4, stroke_index: 12, yardage: 351, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 398, metres: null },
        { hole_number: 17, par: 3, stroke_index: 16, yardage: 158, metres: null },
        { hole_number: 18, par: 4, stroke_index: 10, yardage: 355, metres: null },
      ],
    },
  },
  "astbury golf club": {
    course_name: "Astbury Golf Club",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 68.7,
      slope_rating: 126,
      total_yardage: 5823,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 17, yardage: 273, metres: null },
        { hole_number: 2, par: 4, stroke_index: 9, yardage: 337, metres: null },
        { hole_number: 3, par: 5, stroke_index: 7, yardage: 467, metres: null },
        { hole_number: 4, par: 3, stroke_index: 13, yardage: 134, metres: null },
        { hole_number: 5, par: 4, stroke_index: 1, yardage: 396, metres: null },
        { hole_number: 6, par: 4, stroke_index: 3, yardage: 375, metres: null },
        { hole_number: 7, par: 3, stroke_index: 15, yardage: 161, metres: null },
        { hole_number: 8, par: 5, stroke_index: 11, yardage: 508, metres: null },
        { hole_number: 9, par: 4, stroke_index: 5, yardage: 375, metres: null },
        { hole_number: 10, par: 4, stroke_index: 4, yardage: 365, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 156, metres: null },
        { hole_number: 12, par: 4, stroke_index: 6, yardage: 312, metres: null },
        { hole_number: 13, par: 4, stroke_index: 18, yardage: 297, metres: null },
        { hole_number: 14, par: 4, stroke_index: 14, yardage: 338, metres: null },
        { hole_number: 15, par: 3, stroke_index: 12, yardage: 174, metres: null },
        { hole_number: 16, par: 4, stroke_index: 10, yardage: 360, metres: null },
        { hole_number: 17, par: 4, stroke_index: 2, yardage: 434, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 361, metres: null },
      ],
    },
  },
  "bromborough golf club": {
    course_name: "Bromborough Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 69.1,
      slope_rating: 122,
      total_yardage: 6308,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 13, yardage: 297, metres: null },
        { hole_number: 2, par: 4, stroke_index: 5, yardage: 417, metres: null },
        { hole_number: 3, par: 5, stroke_index: 7, yardage: 481, metres: null },
        { hole_number: 4, par: 3, stroke_index: 17, yardage: 136, metres: null },
        { hole_number: 5, par: 4, stroke_index: 1, yardage: 416, metres: null },
        { hole_number: 6, par: 3, stroke_index: 15, yardage: 163, metres: null },
        { hole_number: 7, par: 5, stroke_index: 9, yardage: 501, metres: null },
        { hole_number: 8, par: 4, stroke_index: 11, yardage: 367, metres: null },
        { hole_number: 9, par: 4, stroke_index: 3, yardage: 365, metres: null },
        { hole_number: 10, par: 3, stroke_index: 16, yardage: 133, metres: null },
        { hole_number: 11, par: 5, stroke_index: 4, yardage: 466, metres: null },
        { hole_number: 12, par: 4, stroke_index: 12, yardage: 341, metres: null },
        { hole_number: 13, par: 4, stroke_index: 14, yardage: 315, metres: null },
        { hole_number: 14, par: 4, stroke_index: 8, yardage: 370, metres: null },
        { hole_number: 15, par: 4, stroke_index: 2, yardage: 405, metres: null },
        { hole_number: 16, par: 3, stroke_index: 18, yardage: 128, metres: null },
        { hole_number: 17, par: 5, stroke_index: 10, yardage: 493, metres: null },
        { hole_number: 18, par: 4, stroke_index: 6, yardage: 414, metres: null },
      ],
    },
  },
  "chester golf club": {
    course_name: "Chester Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 68.9,
      slope_rating: 121,
      total_yardage: 6074,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 10, yardage: 364, metres: null },
        { hole_number: 2, par: 4, stroke_index: 6, yardage: 335, metres: null },
        { hole_number: 3, par: 3, stroke_index: 18, yardage: 138, metres: null },
        { hole_number: 4, par: 5, stroke_index: 8, yardage: 527, metres: null },
        { hole_number: 5, par: 4, stroke_index: 4, yardage: 378, metres: null },
        { hole_number: 6, par: 4, stroke_index: 2, yardage: 417, metres: null },
        { hole_number: 7, par: 4, stroke_index: 12, yardage: 332, metres: null },
        { hole_number: 8, par: 3, stroke_index: 14, yardage: 169, metres: null },
        { hole_number: 9, par: 4, stroke_index: 16, yardage: 337, metres: null },
        { hole_number: 10, par: 4, stroke_index: 13, yardage: 360, metres: null },
        { hole_number: 11, par: 4, stroke_index: 5, yardage: 376, metres: null },
        { hole_number: 12, par: 3, stroke_index: 17, yardage: 142, metres: null },
        { hole_number: 13, par: 4, stroke_index: 1, yardage: 420, metres: null },
        { hole_number: 14, par: 4, stroke_index: 7, yardage: 375, metres: null },
        { hole_number: 15, par: 4, stroke_index: 9, yardage: 364, metres: null },
        { hole_number: 16, par: 4, stroke_index: 3, yardage: 384, metres: null },
        { hole_number: 17, par: 3, stroke_index: 15, yardage: 157, metres: null },
        { hole_number: 18, par: 5, stroke_index: 11, yardage: 499, metres: null },
      ],
    },
  },
  "conwy golf club": {
    course_name: "Conwy Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 72.5,
      slope_rating: 136,
      total_yardage: 6645,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 13, yardage: 359, metres: null },
        { hole_number: 2, par: 3, stroke_index: 15, yardage: 143, metres: null },
        { hole_number: 3, par: 4, stroke_index: 9, yardage: 320, metres: null },
        { hole_number: 4, par: 4, stroke_index: 5, yardage: 383, metres: null },
        { hole_number: 5, par: 4, stroke_index: 1, yardage: 435, metres: null },
        { hole_number: 6, par: 3, stroke_index: 17, yardage: 167, metres: null },
        { hole_number: 7, par: 4, stroke_index: 7, yardage: 428, metres: null },
        { hole_number: 8, par: 4, stroke_index: 3, yardage: 429, metres: null },
        { hole_number: 9, par: 5, stroke_index: 11, yardage: 521, metres: null },
        { hole_number: 10, par: 5, stroke_index: 10, yardage: 526, metres: null },
        { hole_number: 11, par: 4, stroke_index: 4, yardage: 376, metres: null },
        { hole_number: 12, par: 5, stroke_index: 6, yardage: 494, metres: null },
        { hole_number: 13, par: 3, stroke_index: 18, yardage: 153, metres: null },
        { hole_number: 14, par: 4, stroke_index: 2, yardage: 425, metres: null },
        { hole_number: 15, par: 4, stroke_index: 14, yardage: 358, metres: null },
        { hole_number: 16, par: 4, stroke_index: 8, yardage: 395, metres: null },
        { hole_number: 17, par: 3, stroke_index: 16, yardage: 172, metres: null },
        { hole_number: 18, par: 5, stroke_index: 12, yardage: 461, metres: null },
      ],
    },
  },
  "eaton golf club": {
    course_name: "Eaton Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 71.9,
      slope_rating: 130,
      total_yardage: 6414,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 12, yardage: 357, metres: null },
        { hole_number: 2, par: 4, stroke_index: 8, yardage: 370, metres: null },
        { hole_number: 3, par: 4, stroke_index: 2, yardage: 414, metres: null },
        { hole_number: 4, par: 3, stroke_index: 16, yardage: 166, metres: null },
        { hole_number: 5, par: 5, stroke_index: 6, yardage: 488, metres: null },
        { hole_number: 6, par: 3, stroke_index: 14, yardage: 178, metres: null },
        { hole_number: 7, par: 4, stroke_index: 10, yardage: 322, metres: null },
        { hole_number: 8, par: 5, stroke_index: 18, yardage: 476, metres: null },
        { hole_number: 9, par: 4, stroke_index: 4, yardage: 429, metres: null },
        { hole_number: 10, par: 4, stroke_index: 7, yardage: 386, metres: null },
        { hole_number: 11, par: 3, stroke_index: 15, yardage: 170, metres: null },
        { hole_number: 12, par: 4, stroke_index: 3, yardage: 340, metres: null },
        { hole_number: 13, par: 4, stroke_index: 13, yardage: 342, metres: null },
        { hole_number: 14, par: 5, stroke_index: 11, yardage: 518, metres: null },
        { hole_number: 15, par: 4, stroke_index: 1, yardage: 379, metres: null },
        { hole_number: 16, par: 5, stroke_index: 9, yardage: 503, metres: null },
        { hole_number: 17, par: 3, stroke_index: 17, yardage: 145, metres: null },
        { hole_number: 18, par: 4, stroke_index: 5, yardage: 431, metres: null },
      ],
    },
  },
  "alwoodley golf club": {
    course_name: "Alwoodley Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 73.0,
      slope_rating: 138,
      total_yardage: 6514,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 380, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 373, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 545, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 373, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 139, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 331, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 403, metres: null },
        { hole_number: 8, par: 5, stroke_index: 5, yardage: 525, metres: null },
        { hole_number: 9, par: 4, stroke_index: 13, yardage: 406, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 408, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 145, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 516, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 421, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 355, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 165, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 367, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 138, metres: null },
        { hole_number: 18, par: 5, stroke_index: 8, yardage: 524, metres: null },
      ],
    },
  },
  "beeston fields golf club": {
    course_name: "Beeston Fields Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 70.5,
      slope_rating: 128,
      total_yardage: 6059,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 381, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 303, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 472, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 341, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 194, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 414, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 332, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 304, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 483, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 401, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 192, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 507, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 400, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 326, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 158, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 321, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 170, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 360, metres: null },
      ],
    },
  },
  "blackpool north shore golf club": {
    course_name: "Blackpool North Shore Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 71.2,
      slope_rating: 130,
      total_yardage: 6324,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 361, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 347, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 515, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 395, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 180, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 339, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 354, metres: null },
        { hole_number: 8, par: 5, stroke_index: 5, yardage: 537, metres: null },
        { hole_number: 9, par: 4, stroke_index: 13, yardage: 339, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 351, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 163, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 538, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 317, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 320, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 150, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 410, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 185, metres: null },
        { hole_number: 18, par: 5, stroke_index: 8, yardage: 523, metres: null },
      ],
    },
  },
  "bolton old links golf club": {
    course_name: "Bolton Old Links Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 69.9,
      slope_rating: 125,
      total_yardage: 5994,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 305, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 334, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 480, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 350, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 163, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 300, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 330, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 418, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 486, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 308, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 166, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 513, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 398, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 352, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 180, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 320, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 176, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 415, metres: null },
      ],
    },
  },
  "bradford golf club": {
    course_name: "Bradford Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 70.8,
      slope_rating: 129,
      total_yardage: 6087,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 382, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 344, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 501, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 325, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 186, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 341, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 371, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 381, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 462, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 333, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 174, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 508, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 339, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 376, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 188, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 368, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 184, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 324, metres: null },
      ],
    },
  },
  "carlisle golf club": {
    course_name: "Carlisle Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 70.2,
      slope_rating: 126,
      total_yardage: 6022,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 305, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 333, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 486, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 412, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 141, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 379, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 303, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 336, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 515, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 313, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 142, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 503, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 416, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 408, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 151, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 362, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 140, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 377, metres: null },
      ],
    },
  },
  "chorlton-cum-hardy golf club": {
    course_name: "Chorlton-cum-Hardy Golf Club",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 69.3,
      slope_rating: 123,
      total_yardage: 5735,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 313, metres: null },
        { hole_number: 2, par: 3, stroke_index: 15, yardage: 163, metres: null },
        { hole_number: 3, par: 4, stroke_index: 3, yardage: 319, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 298, metres: null },
        { hole_number: 5, par: 5, stroke_index: 1, yardage: 526, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 388, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 344, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 344, metres: null },
        { hole_number: 9, par: 3, stroke_index: 13, yardage: 179, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 325, metres: null },
        { hole_number: 11, par: 4, stroke_index: 16, yardage: 398, metres: null },
        { hole_number: 12, par: 3, stroke_index: 2, yardage: 165, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 307, metres: null },
        { hole_number: 14, par: 5, stroke_index: 6, yardage: 524, metres: null },
        { hole_number: 15, par: 4, stroke_index: 14, yardage: 379, metres: null },
        { hole_number: 16, par: 3, stroke_index: 4, yardage: 154, metres: null },
        { hole_number: 17, par: 4, stroke_index: 18, yardage: 317, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 292, metres: null },
      ],
    },
  },
  "coxmoor golf club": {
    course_name: "Coxmoor Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 71.8,
      slope_rating: 134,
      total_yardage: 6197,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 341, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 393, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 536, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 360, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 185, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 318, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 384, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 300, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 535, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 323, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 149, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 498, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 402, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 417, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 183, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 406, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 164, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 303, metres: null },
      ],
    },
  },
  "dean wood golf club": {
    course_name: "Dean Wood Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 70.6,
      slope_rating: 128,
      total_yardage: 6065,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 335, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 358, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 504, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 371, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 155, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 305, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 290, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 328, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 495, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 316, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 168, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 508, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 393, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 408, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 186, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 406, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 136, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 403, metres: null },
      ],
    },
  },
  "dewsbury district golf club": {
    course_name: "Dewsbury District Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 70.2,
      slope_rating: 127,
      total_yardage: 6030,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 358, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 328, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 459, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 389, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 159, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 361, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 387, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 303, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 467, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 332, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 189, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 468, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 293, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 387, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 185, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 377, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 185, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 403, metres: null },
      ],
    },
  },
  "didsbury golf club": {
    course_name: "Didsbury Golf Club",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 69.7,
      slope_rating: 124,
      total_yardage: 5776,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 372, metres: null },
        { hole_number: 2, par: 3, stroke_index: 15, yardage: 153, metres: null },
        { hole_number: 3, par: 4, stroke_index: 3, yardage: 394, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 369, metres: null },
        { hole_number: 5, par: 5, stroke_index: 1, yardage: 472, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 330, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 358, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 347, metres: null },
        { hole_number: 9, par: 3, stroke_index: 13, yardage: 177, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 377, metres: null },
        { hole_number: 11, par: 4, stroke_index: 16, yardage: 292, metres: null },
        { hole_number: 12, par: 3, stroke_index: 2, yardage: 173, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 384, metres: null },
        { hole_number: 14, par: 5, stroke_index: 6, yardage: 440, metres: null },
        { hole_number: 15, par: 4, stroke_index: 14, yardage: 299, metres: null },
        { hole_number: 16, par: 3, stroke_index: 4, yardage: 138, metres: null },
        { hole_number: 17, par: 4, stroke_index: 18, yardage: 381, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 320, metres: null },
      ],
    },
  },
  "dore & totley golf club": {
    course_name: "Dore & Totley Golf Club",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 69.8,
      slope_rating: 125,
      total_yardage: 5786,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 359, metres: null },
        { hole_number: 2, par: 3, stroke_index: 15, yardage: 162, metres: null },
        { hole_number: 3, par: 4, stroke_index: 3, yardage: 397, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 333, metres: null },
        { hole_number: 5, par: 5, stroke_index: 1, yardage: 513, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 309, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 354, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 325, metres: null },
        { hole_number: 9, par: 3, stroke_index: 13, yardage: 135, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 386, metres: null },
        { hole_number: 11, par: 4, stroke_index: 16, yardage: 383, metres: null },
        { hole_number: 12, par: 3, stroke_index: 2, yardage: 182, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 380, metres: null },
        { hole_number: 14, par: 5, stroke_index: 6, yardage: 478, metres: null },
        { hole_number: 15, par: 4, stroke_index: 14, yardage: 332, metres: null },
        { hole_number: 16, par: 3, stroke_index: 4, yardage: 143, metres: null },
        { hole_number: 17, par: 4, stroke_index: 18, yardage: 293, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 322, metres: null },
      ],
    },
  },
  "ellesmere port golf club": {
    course_name: "Ellesmere Port Golf Club",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 69.4,
      slope_rating: 130,
      total_yardage: 5799,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 373, metres: null },
        { hole_number: 2, par: 3, stroke_index: 15, yardage: 149, metres: null },
        { hole_number: 3, par: 4, stroke_index: 3, yardage: 299, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 415, metres: null },
        { hole_number: 5, par: 5, stroke_index: 1, yardage: 479, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 389, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 312, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 374, metres: null },
        { hole_number: 9, par: 3, stroke_index: 13, yardage: 173, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 302, metres: null },
        { hole_number: 11, par: 4, stroke_index: 16, yardage: 302, metres: null },
        { hole_number: 12, par: 3, stroke_index: 2, yardage: 157, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 330, metres: null },
        { hole_number: 14, par: 5, stroke_index: 6, yardage: 533, metres: null },
        { hole_number: 15, par: 4, stroke_index: 14, yardage: 355, metres: null },
        { hole_number: 16, par: 3, stroke_index: 4, yardage: 147, metres: null },
        { hole_number: 17, par: 4, stroke_index: 18, yardage: 305, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 405, metres: null },
      ],
    },
  },
  "fairhaven golf club": {
    course_name: "Fairhaven Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 70.5,
      slope_rating: 128,
      total_yardage: 6059,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 292, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 386, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 508, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 332, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 190, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 370, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 328, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 351, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 458, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 347, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 194, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 505, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 392, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 388, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 162, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 354, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 135, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 367, metres: null },
      ],
    },
  },
  "fleetwood golf club": {
    course_name: "Fleetwood Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 70.1,
      slope_rating: 126,
      total_yardage: 6014,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 303, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 376, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 473, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 288, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 166, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 325, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 399, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 341, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 521, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 347, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 191, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 519, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 327, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 366, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 139, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 339, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 187, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 407, metres: null },
      ],
    },
  },
  "formby ladies golf club": {
    course_name: "Formby Ladies Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 71.1,
      slope_rating: 131,
      total_yardage: 6324,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 397, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 342, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 511, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 327, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 185, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 364, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 323, metres: null },
        { hole_number: 8, par: 5, stroke_index: 5, yardage: 532, metres: null },
        { hole_number: 9, par: 4, stroke_index: 13, yardage: 332, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 354, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 145, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 546, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 377, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 356, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 172, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 404, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 146, metres: null },
        { hole_number: 18, par: 5, stroke_index: 8, yardage: 511, metres: null },
      ],
    },
  },
  "fulford golf club": {
    course_name: "Fulford Golf Club",
    tee_set: {
      colour: "yellow",
      par: 71,
      course_rating: 71.9,
      slope_rating: 134,
      total_yardage: 6205,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 374, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 368, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 451, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 394, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 180, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 377, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 371, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 391, metres: null },
        { hole_number: 9, par: 5, stroke_index: 13, yardage: 484, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 378, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 150, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 514, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 358, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 358, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 160, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 396, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 184, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 317, metres: null },
      ],
    },
  },
  "ganton golf club": {
    course_name: "Ganton Golf Club",
    tee_set: {
      colour: "yellow",
      par: 72,
      course_rating: 72.8,
      slope_rating: 137,
      total_yardage: 6491,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 370, metres: null },
        { hole_number: 2, par: 4, stroke_index: 15, yardage: 397, metres: null },
        { hole_number: 3, par: 5, stroke_index: 3, yardage: 522, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 385, metres: null },
        { hole_number: 5, par: 3, stroke_index: 1, yardage: 181, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 358, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 334, metres: null },
        { hole_number: 8, par: 5, stroke_index: 5, yardage: 495, metres: null },
        { hole_number: 9, par: 4, stroke_index: 13, yardage: 402, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 404, metres: null },
        { hole_number: 11, par: 3, stroke_index: 16, yardage: 173, metres: null },
        { hole_number: 12, par: 5, stroke_index: 2, yardage: 525, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 357, metres: null },
        { hole_number: 14, par: 4, stroke_index: 6, yardage: 421, metres: null },
        { hole_number: 15, par: 3, stroke_index: 14, yardage: 182, metres: null },
        { hole_number: 16, par: 4, stroke_index: 4, yardage: 349, metres: null },
        { hole_number: 17, par: 3, stroke_index: 18, yardage: 137, metres: null },
        { hole_number: 18, par: 5, stroke_index: 8, yardage: 499, metres: null },
      ],
    },
  },
  "halifax bradley hall golf club": {
    course_name: "Halifax Bradley Hall Golf Club",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 69.5,
      slope_rating: 124,
      total_yardage: 5757,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 368, metres: null },
        { hole_number: 2, par: 3, stroke_index: 15, yardage: 156, metres: null },
        { hole_number: 3, par: 4, stroke_index: 3, yardage: 409, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 362, metres: null },
        { hole_number: 5, par: 5, stroke_index: 1, yardage: 495, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 298, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 313, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 311, metres: null },
        { hole_number: 9, par: 3, stroke_index: 13, yardage: 136, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 359, metres: null },
        { hole_number: 11, par: 4, stroke_index: 16, yardage: 346, metres: null },
        { hole_number: 12, par: 3, stroke_index: 2, yardage: 161, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 371, metres: null },
        { hole_number: 14, par: 5, stroke_index: 6, yardage: 506, metres: null },
        { hole_number: 15, par: 4, stroke_index: 14, yardage: 317, metres: null },
        { hole_number: 16, par: 3, stroke_index: 4, yardage: 178, metres: null },
        { hole_number: 17, par: 4, stroke_index: 18, yardage: 362, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 309, metres: null },
      ],
    },
  },
  "hallamshire golf club": {
    course_name: "Hallamshire Golf Club",
    tee_set: {
      colour: "yellow",
      par: 70,
      course_rating: 70.0,
      slope_rating: 126,
      total_yardage: 5808,
      holes: [
        { hole_number: 1, par: 4, stroke_index: 7, yardage: 363, metres: null },
        { hole_number: 2, par: 3, stroke_index: 15, yardage: 139, metres: null },
        { hole_number: 3, par: 4, stroke_index: 3, yardage: 322, metres: null },
        { hole_number: 4, par: 4, stroke_index: 11, yardage: 322, metres: null },
        { hole_number: 5, par: 5, stroke_index: 1, yardage: 496, metres: null },
        { hole_number: 6, par: 4, stroke_index: 17, yardage: 353, metres: null },
        { hole_number: 7, par: 4, stroke_index: 9, yardage: 411, metres: null },
        { hole_number: 8, par: 4, stroke_index: 5, yardage: 355, metres: null },
        { hole_number: 9, par: 3, stroke_index: 13, yardage: 172, metres: null },
        { hole_number: 10, par: 4, stroke_index: 10, yardage: 366, metres: null },
        { hole_number: 11, par: 4, stroke_index: 16, yardage: 311, metres: null },
        { hole_number: 12, par: 3, stroke_index: 2, yardage: 135, metres: null },
        { hole_number: 13, par: 4, stroke_index: 12, yardage: 351, metres: null },
        { hole_number: 14, par: 5, stroke_index: 6, yardage: 482, metres: null },
        { hole_number: 15, par: 4, stroke_index: 14, yardage: 360, metres: null },
        { hole_number: 16, par: 3, stroke_index: 4, yardage: 173, metres: null },
        { hole_number: 17, par: 4, stroke_index: 18, yardage: 343, metres: null },
        { hole_number: 18, par: 4, stroke_index: 8, yardage: 354, metres: null },
      ],
    },
  },
};


HARDCODED_SCORECARDS["aldersey green golf club"] = HARDCODED_SCORECARDS["aldersey green"];
HARDCODED_SCORECARDS["aldersey"] = HARDCODED_SCORECARDS["aldersey green"];
HARDCODED_SCORECARDS["ashton under lyne golf club"] = HARDCODED_SCORECARDS["ashton-under-lyne golf club"];
HARDCODED_SCORECARDS["ashton under lyne"] = HARDCODED_SCORECARDS["ashton-under-lyne golf club"];
HARDCODED_SCORECARDS["ashton-under-lyne"] = HARDCODED_SCORECARDS["ashton-under-lyne golf club"];
HARDCODED_SCORECARDS["the warren golf course"] = HARDCODED_SCORECARDS["the warren municipal golf club"];
HARDCODED_SCORECARDS["warren golf course"] = HARDCODED_SCORECARDS["the warren municipal golf club"];
HARDCODED_SCORECARDS["warren municipal golf course"] = HARDCODED_SCORECARDS["the warren municipal golf club"];
HARDCODED_SCORECARDS["warren municipal golf club"] = HARDCODED_SCORECARDS["the warren municipal golf club"];
HARDCODED_SCORECARDS["the warren municipal golf course"] = HARDCODED_SCORECARDS["the warren municipal golf club"];
HARDCODED_SCORECARDS["the warren municipal"] = HARDCODED_SCORECARDS["the warren municipal golf club"];
HARDCODED_SCORECARDS["warren municipal"] = HARDCODED_SCORECARDS["the warren municipal golf club"];
HARDCODED_SCORECARDS["the warren"] = HARDCODED_SCORECARDS["the warren municipal golf club"];
HARDCODED_SCORECARDS["warren"] = HARDCODED_SCORECARDS["the warren municipal golf club"];

function buildEstimatedScorecard(course) {
  const par = Number(course?.par || 72);
  const rating = Number(course?.rating || par || 72);
  const slope = Number(course?.slope || 120);

  const parPatterns = {
    69: [4, 3, 4, 4, 5, 3, 4, 4, 4, 4, 3, 4, 4, 5, 3, 4, 4, 3],
    70: [4, 3, 3, 4, 5, 4, 4, 4, 5, 4, 3, 5, 3, 4, 4, 3, 4, 4],
    71: [4, 4, 3, 4, 5, 4, 4, 4, 4, 4, 4, 3, 4, 4, 4, 3, 5, 4],
    72: [4, 4, 5, 3, 4, 4, 3, 5, 4, 4, 4, 3, 4, 5, 4, 4, 3, 5],
  };

  const pars = parPatterns[par] || parPatterns[72];
  const strokeIndexes = [5, 13, 3, 15, 1, 11, 17, 7, 9, 4, 12, 18, 8, 2, 14, 6, 16, 10];
  const baseYards = pars.map((holePar, index) => {
    if (holePar === 3) return [145, 160, 175, 190, 155, 170][index % 6];
    if (holePar === 5) return [475, 495, 515, 535, 485, 505][index % 6];
    return [330, 350, 370, 390, 410, 430, 345, 365, 385][index % 9];
  });

  const targetYardage =
    Number(course?.total_yardage || course?.yardage || 0) ||
    (par >= 72 ? 6200 : par === 71 ? 6000 : par === 70 ? 5800 : 5600);

  const currentYardage = baseYards.reduce((sum, yards) => sum + yards, 0);
  const scale = targetYardage / currentYardage;

  const holes = baseYards.map((yards, index) => ({
    hole_number: index + 1,
    par: pars[index],
    stroke_index: strokeIndexes[index],
    yardage: Math.max(90, Math.round(yards * scale)),
    metres: null,
  }));

  const adjustment = targetYardage - holes.reduce((sum, hole) => sum + hole.yardage, 0);
  holes[holes.length - 1].yardage += adjustment;

  return {
    course_id: `estimated-${nameKey(course?.name || "course")}`,
    course_name: course?.name || "Selected Course",
    hardcodedScorecard: false,
    estimatedScorecard: true,
    tee_set: {
      colour: String(course?.tee || "Yellow").toLowerCase(),
      par,
      course_rating: rating,
      slope_rating: slope,
      total_yardage: targetYardage,
      holes,
    },
  };
}

function getHardcodedScorecard(course) {
  const key = normaliseName(course?.name || "");
  let hardcoded = HARDCODED_SCORECARDS[key];

  // Extra safety for Warren name variations from localStorage/cloud/manual entries.
  // Examples: "The Warren Municipal", "Warren Municipal Golf Club", "Warren".
  if (!hardcoded && key.includes("warren")) {
    hardcoded = HARDCODED_SCORECARDS["the warren municipal golf club"];
  }

  if (!hardcoded && key.includes("aldersey")) {
    hardcoded = HARDCODED_SCORECARDS["aldersey green"];
  }

  if (!hardcoded && (key.includes("ashton") && key.includes("lyne"))) {
    hardcoded = HARDCODED_SCORECARDS["ashton-under-lyne golf club"];
  }

  // Important: return null here so unknown courses can try the API first.
  // The estimated fallback is only used if the API fails.
  if (!hardcoded) return null;

  return {
    course_id: `hardcoded-${nameKey(hardcoded.course_name)}`,
    course_name: hardcoded.course_name,
    hardcodedScorecard: true,
    estimatedScorecard: false,
    rapidApiScorecard: false,
    tee_set: {
      ...hardcoded.tee_set,
      holes: hardcoded.tee_set.holes.map((hole) => ({ ...hole })),
    },
  };
}

function App() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [lastSync, setLastSync] = useState("--");
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("pg2-auth") === "true");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("home");

  const [players, setPlayers] = useState(() => JSON.parse(localStorage.getItem("golfPlayers")) || defaultPlayers);
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("golfCourses")) || defaultCourses);
  const [rounds, setRounds] = useState(() => JSON.parse(localStorage.getItem("golfRounds")) || []);
  const [photos, setPhotos] = useState(() => JSON.parse(localStorage.getItem("golfPhotos")) || {});
  const [gallery, setGallery] = useState(() => JSON.parse(localStorage.getItem("roundGallery")) || []);
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem("playerBadges")) || {});
  const [activity, setActivity] = useState(() => JSON.parse(localStorage.getItem("recentActivity")) || []);

  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(defaultPlayers[0].name);
  const [selectedCourse, setSelectedCourse] = useState(courseKey(defaultCourses[0]));
  const [courseSearch, setCourseSearch] = useState("");
  const [score, setScore] = useState("");
  const [points, setPoints] = useState("");
  const [meritPoints, setMeritPoints] = useState("");
  const [didWin, setDidWin] = useState(false);
  const [isNineHoles, setIsNineHoles] = useState(false);

  const [courseName, setCourseName] = useState("");
  const [courseTee, setCourseTee] = useState("");
  const [coursePar, setCoursePar] = useState("");
  const [courseRating, setCourseRating] = useState("");
  const [courseSlope, setCourseSlope] = useState("");

  const [historyPlayer, setHistoryPlayer] = useState(defaultPlayers[0].name);
  const [profilePlayerIndex, setProfilePlayerIndex] = useState(0);
  const [adminPlayer, setAdminPlayer] = useState(defaultPlayers[0].name);
  const [manualHandicap, setManualHandicap] = useState("");
  const [editPlayerName, setEditPlayerName] = useState(defaultPlayers[0].name);
  const [editedPlayerName, setEditedPlayerName] = useState("");
  const [editedPlayerHC, setEditedPlayerHC] = useState("");
  const [oldRoundNameToRepair, setOldRoundNameToRepair] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [detailedScorecard, setDetailedScorecard] = useState(null);
  const [holeScores, setHoleScores] = useState({});
  const [pickedUpHoles, setPickedUpHoles] = useState({});
  const [scorecardLoading, setScorecardLoading] = useState(false);
  const [scorecardError, setScorecardError] = useState("");
  const [roundEntryMode, setRoundEntryMode] = useState("");
  const [autoLoadedScorecardKey, setAutoLoadedScorecardKey] = useState("");
  const [scorecardApiDebug, setScorecardApiDebug] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanSuccess, setScanSuccess] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => localStorage.setItem("golfPlayers", JSON.stringify(players)), [players]);
  useEffect(() => localStorage.setItem("golfCourses", JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem("golfRounds", JSON.stringify(rounds)), [rounds]);
  useEffect(() => localStorage.setItem("golfPhotos", JSON.stringify(photos)), [photos]);
  useEffect(() => localStorage.setItem("roundGallery", JSON.stringify(gallery)), [gallery]);
  useEffect(() => localStorage.setItem("playerBadges", JSON.stringify(badges)), [badges]);
  useEffect(() => localStorage.setItem("recentActivity", JSON.stringify(activity)), [activity]);

  useEffect(() => {
    if (!loggedIn) return;

    pullCloudSilently();

    const channel = supabase
      .channel("p2g-live-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "p2g_data",
        },
        () => {
          pullCloudSilently();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;

    const timer = setTimeout(() => {
      autoBackupToCloud();
    }, 1500);

    return () => clearTimeout(timer);
  }, [players, courses, rounds, photos, gallery, badges, activity]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function addActivity(text) {
    setActivity([{ text, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...activity].slice(0, 20));
  }

  function clearRecentActivity() {
    const confirmClear = window.confirm("Clear all recent activity? This will not delete players, rounds, handicaps, photos, badges, or gallery items.");

    if (!confirmClear) return;

    setActivity([]);
    showToast("Recent activity cleared");
  }
async function backupToCloud() {
  const payload = {
    players,
    courses,
    rounds,
    photos,
    gallery,
    badges,
    activity,
  };

  const { error } = await supabase
    .from("p2g_data")
    .upsert({
      id: "main",
      data: payload,
    });

  if (error) {
    console.log(error);
    alert("Backup failed");
  } else {
    showToast("☁️ Cloud backup complete");
  }
}


async function autoBackupToCloud() {
  const payload = {
    players,
    courses,
    rounds,
    photos,
    gallery,
    badges,
    activity,
  };

  await supabase
    .from("p2g_data")
    .upsert({
      id: "main",
      data: payload,
    });
}

async function restoreCloudData() {
  const { data } = await supabase
    .from("p2g_data")
    .select("*")
    .eq("id", "main")
    .single();

  if (!data?.data) return;

  const d = data.data;

  setPlayers(d.players || []);
  setCourses(d.courses || []);
  setRounds(d.rounds || []);
  setPhotos(d.photos || {});
  setGallery(d.gallery || []);
  setBadges(d.badges || {});
  setActivity(d.activity || []);

  showToast("☁️ Cloud restored");
}

async function pullCloudSilently() {
  const { data } = await supabase
    .from("p2g_data")
    .select("*")
    .eq("id", "main")
    .single();

  if (!data?.data) return;

  const d = data.data;

  setPlayers(d.players || []);
  setCourses(d.courses || []);
  setRounds(d.rounds || []);
  setPhotos(d.photos || {});
  setGallery(d.gallery || []);
  setBadges(d.badges || {});
  setActivity(d.activity || []);
  setLastSync(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  );
}
  function unlockBadge(playerName, badgeKey) {
    if (badges[playerName]?.[badgeKey]) return false;
    const badge = achievementOptions.find((b) => b.key === badgeKey);

    setBadges({
      ...badges,
      [playerName]: { ...(badges[playerName] || {}), [badgeKey]: true },
    });

    addActivity(`${playerName} unlocked badge: ${badge.icon} ${badge.label}`);
    return true;
  }

  function login() {
    if (username.toLowerCase() === APP_USER && password === APP_PASS) {
      localStorage.setItem("pg2-auth", "true");
      setLoggedIn(true);
      setUsername("");
      setPassword("");
      showToast("Logged in");
    } else alert("Incorrect login");
  }

  function logout() {
    localStorage.removeItem("pg2-auth");
    setLoggedIn(false);
  }

  function addPlayer() {
    if (!name || !handicap) return;
    setPlayers([...players, { name, handicap: Number(handicap) }]);
    addActivity(`${name} was added to the society`);
    setName("");
    setHandicap("");
    setPage("standings");
    showToast("Player added");
  }

  function removePlayer(playerName) {
    if (!adminUnlocked) {
      showToast("Admin only: unlock Admin to delete players");
      return;
    }

    const confirmDelete = window.confirm(
      `Delete ${playerName}? Their existing rounds will stay in history, but the player will be removed from the active HC list.`
    );

    if (!confirmDelete) return;

    setPlayers(players.filter((p) => p.name !== playerName));
    addActivity(`Admin removed ${playerName} from the player list`);
    showToast("Player removed");
  }

  function addCourse() {
    if (!courseName || !courseRating || !courseSlope) return;

    const newCourse = {
      name: courseName,
      tee: courseTee || "Yellow",
      par: Number(coursePar || 72),
      rating: Number(courseRating),
      slope: Number(courseSlope),
    };

    setCourses([...courses, newCourse]);
    setSelectedCourse(courseKey(newCourse));
    addActivity(`${courseName} was added as a course`);
    setCourseName("");
    setCourseTee("");
    setCoursePar("");
    setCourseRating("");
    setCourseSlope("");
    setPage("add-round");
    showToast("Course added");
  }

  async function scanScorecardPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanLoading(true);
    setScanError("");
    setScanSuccess("");

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || "");
          const encoded = result.includes(",") ? result.split(",")[1] : result;
          resolve(encoded);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/scan-scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mediaType: file.type || "image/jpeg",
          tee: "Yellow",
        }),
      });

      const rawText = await response.text();

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("Scan API returned non-JSON:", rawText);
        throw new Error(
          `Scan API returned non-JSON response. Status ${response.status}. Check Vercel Runtime Logs.`
        );
      }

      if (!response.ok || data.error) {
        throw new Error(data.message || data.error || "Scan failed");
      }

      const newCourse = {
        name: data.course_name || "Scanned Golf Course",
        tee: data.tee || "Yellow",
        par: Number(data.par || 72),
        rating: Number(data.course_rating || 70),
        slope: Number(data.slope_rating || 120),
      };

      const scannedHoles = Array.isArray(data.holes) ? data.holes : [];

      const alreadyExists = courses.some(
        (c) =>
          c.name.toLowerCase() === newCourse.name.toLowerCase() &&
          String(c.tee || "").toLowerCase() === String(newCourse.tee || "").toLowerCase()
      );

      if (!alreadyExists) {
        setCourses((prev) =>
          [...prev, newCourse].sort((a, b) => a.name.localeCompare(b.name))
        );
      }

      const scannedScorecard = {
        course_id: "",
        course_name: newCourse.name,
        tee_set: {
          colour: String(newCourse.tee || "Yellow").toLowerCase(),
          par: newCourse.par,
          course_rating: newCourse.rating,
          slope_rating: newCourse.slope,
          total_yardage: Number(data.total_yardage || 0),
          holes: scannedHoles,
        },
      };

      setSelectedCourse(courseKey(newCourse));
      setCourseSearch(newCourse.name);
      setDetailedScorecard(scannedScorecard);
      setHoleScores({});
    setPickedUpHoles({});
      setScorecardError("");
      setAutoLoadedScorecardKey(courseKey(newCourse));
      setScorecardApiDebug(`Scanned: ${newCourse.name} / ${newCourse.tee}`);

      const safeCourseId = newCourse.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

      const safeTeeId = String(newCourse.tee || "yellow")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

      const cacheId = `${safeCourseId || "course"}__${safeTeeId || "tee"}`;

      try {
        const { error: cacheError } = await supabase.from("scorecard_cache").upsert(
          {
            id: cacheId,
            course_name: newCourse.name,
            tee: newCourse.tee,
            data: scannedScorecard,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        if (cacheError) {
          console.warn("Scorecard cache save failed:", cacheError);
        }
      } catch (cacheErr) {
        console.warn("Scorecard cache save failed:", cacheErr);
      }

      addActivity(`${newCourse.name} added via scorecard scan`);
      setScanSuccess(
        `✅ ${newCourse.name} added! ${scannedHoles.length} holes with stroke index saved.`
      );
      showToast(`${newCourse.name} scanned and ready!`);
    } catch (err) {
      console.error("Scorecard scan failed:", err);
      setScanError(`❌ ${err.message || "Scan failed — try retaking the photo"}`);
    } finally {
      setScanLoading(false);
      if (event.target) event.target.value = "";
    }
  }
function importDefaultCourses() {
  const existingKeys = courses.map((c) => courseKey(c));

  const newCourses = defaultCourses.filter(
    (course) => !existingKeys.includes(courseKey(course))
  );

  if (newCourses.length === 0) {
    showToast("No new courses to import");
    return;
  }

  const combinedCourses = [...courses, ...newCourses].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  setCourses(combinedCourses);

  addActivity(`${newCourses.length} new courses imported`);

  showToast(`${newCourses.length} courses imported`);
}
  function getFilteredCourses(searchText = courseSearch) {
    const q = String(searchText || "").trim().toLowerCase();
    const mustHaveCourses = [
      { name: "Aldersey Green", tee: "Yellow", par: 70, rating: 70.1, slope: 123 },
      { name: "Eastham Lodge Golf Club", tee: "Yellow", par: 72, rating: 70.0, slope: 120 },
      { name: "Hawarden Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 123 },
    ];

    const pool = [...courses];
    mustHaveCourses.forEach((course) => {
      const exists = pool.some(
        (c) =>
          normaliseName(c.name) === normaliseName(course.name) &&
          String(c.tee || "").toLowerCase() === String(course.tee || "").toLowerCase()
      );
      if (!exists) pool.push(course);
    });

    return pool
      .filter((c) => c.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aStarts = q && aName.startsWith(q);
        const bStarts = q && bName.startsWith(q);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        if (q === "ald" || q.startsWith("ald")) {
          if (aName.includes("aldersey") && !bName.includes("aldersey")) return -1;
          if (!aName.includes("aldersey") && bName.includes("aldersey")) return 1;
        }
        return a.name.localeCompare(b.name);
      });
  }

  function selectCourseByKey(nextCourseKey) {
    const nextCourse = courses.find((c) => courseKey(c) === nextCourseKey);

    setSelectedCourse(nextCourseKey);
    if (nextCourse) setCourseSearch(nextCourse.name);
    setDetailedScorecard(null);
    setHoleScores({});
    setPickedUpHoles({});
    setScorecardError("");
    setAutoLoadedScorecardKey("");
    setScorecardApiDebug(nextCourse ? `Ready to load: ${nextCourse.name} / ${nextCourse.tee}` : "");
  }

  function handleCourseSearchChange(value) {
    setCourseSearch(value);

    const matches = getFilteredCourses(value);

    setDetailedScorecard(null);
    setHoleScores({});
    setPickedUpHoles({});
    setScorecardError("");
    setAutoLoadedScorecardKey("");

    if (matches.length > 0) {
      const firstMatch = matches[0];
      setSelectedCourse(courseKey(firstMatch));
      setScorecardApiDebug(`Ready to load: ${firstMatch.name} / ${firstMatch.tee}`);
    } else {
      setSelectedCourse("");
      const typedCourse = buildTypedCourseFromSearch(value);
      setScorecardApiDebug(
        typedCourse
          ? `Ready to try API/fallback for: ${typedCourse.name} / Yellow`
          : ""
      );
    }
  }

  function chooseCourse(course) {
    setSelectedCourse(courseKey(course));
    setCourseSearch(course.name);
    setDetailedScorecard(null);
    setHoleScores({});
    setPickedUpHoles({});
    setScorecardError("");
    setAutoLoadedScorecardKey("");
    setScorecardApiDebug(`Ready to load: ${course.name} / ${course.tee}`);
  }

  function addRound() {
    const course = selectedCourseDetails;
    const player = findPlayerByName(players, selectedPlayer);

    if (!course || !player) return;

    const selectedPlayerDetails = player;
    const detailedScoreReady =
      roundEntryMode === "hole-by-hole" &&
      detailedHolesForRound.length > 0 &&
      detailedSummary.complete;

    if (roundEntryMode === "hole-by-hole" && !detailedScoreReady) {
      showToast(`Enter all ${isNineHoles ? 9 : 18} hole scores first`);
      return;
    }

    if (roundEntryMode === "completed" && !score && !points) {
      showToast("Enter a gross score or Stableford points");
      return;
    }

    const oldHandicap = Number(selectedPlayerDetails.handicap);
    const finalScore = detailedScoreReady ? detailedSummary.gross : score;
    const finalPoints = detailedScoreReady ? autoStablefordPoints : points;
    const adjustedScore =
      isNineHoles && finalScore ? Number(finalScore) * 2 : finalScore;
    const adjustedPoints =
      isNineHoles && finalPoints ? Number(finalPoints) * 2 : finalPoints;

    const hasPickedUpHoles =
      detailedScoreReady && Object.values(pickedUpHoles).some(Boolean);

    const hcResult = hasPickedUpHoles
      ? {
          newHandicap: stablefordHandicapAdjustment(
            oldHandicap,
            adjustedPoints,
            didWin
          ),
          differential: "",
          intelligenceUsed: false,
          stablefordAdjustmentUsed: true,
        }
      : intelligentHandicap(
          selectedPlayerDetails,
          rounds,
          adjustedScore,
          adjustedPoints,
          course
        );

    const safeMerit = Math.max(0, Math.min(10, Number(meritPoints || 0)));

    const round = {
      player: selectedPlayer,
      course: course.name,
      tee: course.tee,
      oldHandicap,
      newHandicap: hcResult.newHandicap,
      differential: hcResult.differential,
      intelligenceUsed: hcResult.intelligenceUsed,
      score: finalScore && finalScore !== "NR" ? Number(finalScore) : "",
      points: finalPoints ? Number(finalPoints) : "",
      holes: isNineHoles ? 9 : 18,
      holeScores: detailedScoreReady
        ? detailedHolesForRound.map((hole) => ({
            hole: hole.hole_number,
            par: hole.par,
            strokeIndex: hole.stroke_index,
            yardage: hole.yardage,
            score: Number(holeScores[hole.hole_number]),
          }))
        : [],
      detailedScoring: detailedScoreReady,
      pickedUpHoles: detailedScoreReady ? pickedUpHoles : {},
      pickedUpCount: detailedScoreReady ? detailedSummary.pickedUpCount : 0,
      stablefordAdjustmentUsed: hcResult.stablefordAdjustmentUsed || false,
      frontNine: detailedScoreReady ? detailedSummary.frontNine : "",
      backNine: detailedScoreReady && !isNineHoles ? detailedSummary.backNine : "",
      pars: detailedScoreReady ? detailedSummary.pars : 0,
      birdies: detailedScoreReady ? detailedSummary.birdies : 0,
      eagles: detailedScoreReady ? detailedSummary.eagles : 0,
      meritPoints: safeMerit,
      didWin,
      rating: course.rating,
      slope: course.slope,
      par: course.par,
      date: new Date().toLocaleDateString(),
    };

    setRounds([round, ...rounds]);
    setPlayers(
      players.map((p) =>
        normaliseName(p.name) === normaliseName(selectedPlayer)
          ? { ...p, handicap: hcResult.newHandicap }
          : p
      )
    );

    let activityText = `${selectedPlayer} played ${course.name}`;
    if (finalScore) activityText += ` and shot ${finalScore}`;
    if (finalPoints) activityText += ` with ${finalPoints} Stableford points`;
    if (detailedScoreReady) activityText += ` using hole-by-hole scoring`;
    if (didWin) activityText += ` and won the comp 🏆`;
    addActivity(activityText);

    if (didWin) unlockBadge(selectedPlayer, "winner");
    if (detailedScoreReady && detailedSummary.pars > 0) unlockBadge(selectedPlayer, "par");
    if (detailedScoreReady && detailedSummary.birdies > 0) unlockBadge(selectedPlayer, "birdie");
    if (detailedScoreReady && detailedSummary.eagles > 0) unlockBadge(selectedPlayer, "eagle");
    if (detailedScoreReady && detailedSummary.holeInOnes > 0) unlockBadge(selectedPlayer, "holeInOne");

    setHistoryPlayer(selectedPlayer);
    setScore("");
    setPoints("");
    setMeritPoints("");
    setDidWin(false);
    setIsNineHoles(false);
    setDetailedScorecard(null);
    setHoleScores({});
    setPickedUpHoles({});
    setScorecardError("");
    setAutoLoadedScorecardKey("");
    setRoundEntryMode("");
    setPage("history");
    showToast(
      hcResult.intelligenceUsed
        ? "Round saved - HC Intelligence used"
        : "Round saved"
    );
  }

 function recalculatePlayerAfterRoundChange(playerName, updatedRounds, originalRounds) {
  const deletedPlayerRounds = originalRounds.filter((r) =>
    roundBelongsToPlayer(r, playerName)
  );

  if (deletedPlayerRounds.length === 0) {
    return { recalculatedRounds: updatedRounds, recalculatedPlayers: players };
  }

  const originalOldestRound = [...deletedPlayerRounds].reverse()[0];
  let runningHandicap = Number(originalOldestRound.oldHandicap);

  const playerRoundsOldestFirst = updatedRounds
    .filter((r) => roundBelongsToPlayer(r, playerName))
    .slice()
    .reverse();

  const recalculatedOldestFirst = [];
  let priorNewest = [];

  playerRoundsOldestFirst.forEach((round) => {
    const adjustedScore =
      Number(round.holes || 18) === 9 && round.score
        ? Number(round.score) * 2
        : round.score;

    const adjustedPoints =
      Number(round.holes || 18) === 9 && round.points
        ? Number(round.points) * 2
        : round.points;

    const courseForCalculation = {
      rating: round.rating,
      slope: round.slope,
      par: round.par,
    };

    const hcResult = intelligentHandicap(
      { name: playerName, handicap: runningHandicap },
      priorNewest,
      adjustedScore,
      adjustedPoints,
      courseForCalculation
    );

    const recalculatedRound = {
      ...round,
      oldHandicap: round1(runningHandicap),
      newHandicap: hcResult.newHandicap,
      differential: hcResult.differential,
      intelligenceUsed: hcResult.intelligenceUsed,
    };

    recalculatedOldestFirst.push(recalculatedRound);
    priorNewest = [recalculatedRound, ...priorNewest];
    runningHandicap = hcResult.newHandicap;
  });

  const recalculatedNewestFirst = [...recalculatedOldestFirst].reverse();

  const queue = [...recalculatedNewestFirst];

  const recalculatedRounds = updatedRounds.map((round) => {
    if (!roundBelongsToPlayer(round, playerName)) return round;
    return queue.shift();
  });

  const finalHandicap =
    recalculatedNewestFirst.length > 0
      ? recalculatedNewestFirst[0].newHandicap
      : originalOldestRound.oldHandicap;

  const recalculatedPlayers = players.map((player) =>
    player.name === playerName
      ? { ...player, handicap: round1(finalHandicap) }
      : player
  );

  return { recalculatedRounds, recalculatedPlayers };
}

  function deleteRound(indexToDelete) {
    if (!adminUnlocked) {
      showToast("Admin only: unlock Admin to delete rounds");
      return;
    }

    const roundToDelete = rounds[indexToDelete];
    if (!roundToDelete) return;

    const confirmDelete = window.confirm(
      `Delete this round for ${roundToDelete.player} at ${roundToDelete.course}? The player's handicap will be recalculated automatically.`
    );

    if (!confirmDelete) return;

    const updatedRounds = rounds.filter((_, index) => index !== indexToDelete);

    const { recalculatedRounds, recalculatedPlayers } =
      recalculatePlayerAfterRoundChange(
        roundToDelete.player,
        updatedRounds,
        rounds
      );

    setRounds(recalculatedRounds);
    setPlayers(recalculatedPlayers);

    addActivity(
      `Admin deleted a round for ${roundToDelete.player} at ${roundToDelete.course}; handicap recalculated`
    );

    showToast("Round deleted and HC recalculated");
  }

  function toggleProfileBadge(badgeKey) {
    const current = badges[profilePlayer]?.[badgeKey];
    setBadges({ ...badges, [profilePlayer]: { ...(badges[profilePlayer] || {}), [badgeKey]: !current } });
    const badge = achievementOptions.find((b) => b.key === badgeKey);

    if (!current) {
      addActivity(`${profilePlayer} unlocked badge: ${badge.icon} ${badge.label}`);
      showToast("Badge unlocked");
    } else showToast("Badge removed");
  }

  function updateManualHandicap() {
    if (!adminUnlocked || !manualHandicap) return;
    setPlayers(players.map((p) => (p.name === adminPlayer ? { ...p, handicap: Number(manualHandicap) } : p)));
    addActivity(`${adminPlayer}'s handicap was manually updated to ${manualHandicap}`);
    setManualHandicap("");
    showToast("Handicap updated");
  }



  function repairPlayerRoundLinks() {
    if (!editPlayerName) return;

    const targetPlayer = findPlayerByName(players, editPlayerName);

    if (!targetPlayer) {
      showToast("Player not found");
      return;
    }

    const fixedRounds = rounds.map((r) => {
      if (roundBelongsToPlayer(r, editPlayerName)) {
        return { ...r, player: targetPlayer.name };
      }

      return r;
    });

    setRounds(fixedRounds);
    setHistoryPlayer(targetPlayer.name);

    addActivity(`${targetPlayer.name}'s round links repaired`);

    showToast("Player round links repaired");
  }

  function repairTypedRoundLinks() {
    if (!editPlayerName || !oldRoundNameToRepair) return;

    const targetPlayer = findPlayerByName(players, editPlayerName);

    if (!targetPlayer) {
      showToast("Player not found");
      return;
    }

    const oldName = oldRoundNameToRepair.trim();

    const fixedRounds = rounds.map((r) => {
      if (
        normaliseName(r.player) === normaliseName(oldName) ||
        normaliseName(r.player).includes(normaliseName(oldName)) ||
        normaliseName(oldName).includes(normaliseName(r.player))
      ) {
        return { ...r, player: targetPlayer.name };
      }

      return r;
    });

    const changedCount = fixedRounds.filter(
      (r, i) => r.player !== rounds[i].player
    ).length;

    setRounds(fixedRounds);
    setHistoryPlayer(targetPlayer.name);

    addActivity(
      `${changedCount} round link${changedCount === 1 ? "" : "s"} repaired for ${targetPlayer.name}`
    );

    setOldRoundNameToRepair("");

    showToast(`${changedCount} round link${changedCount === 1 ? "" : "s"} repaired`);
  }


  function savePlayerProfileEdit() {
    const oldName = editPlayerName;
    const cleanedName = editedPlayerName.trim();

    if (!cleanedName) {
      showToast("Enter the corrected player name");
      return;
    }

    const duplicate = players.some(
      (p) =>
        normaliseName(p.name) === normaliseName(cleanedName) &&
        normaliseName(p.name) !== normaliseName(oldName)
    );

    if (duplicate) {
      alert("That player name already exists");
      return;
    }

    const updatedPlayers = players.map((p) =>
      normaliseName(p.name) === normaliseName(oldName)
        ? {
            ...p,
            name: cleanedName,
            handicap: editedPlayerHC
              ? Number(editedPlayerHC)
              : p.handicap,
          }
        : p
    );

    const updatedRounds = rounds.map((r) =>
      roundBelongsToPlayer(r, oldName)
        ? { ...r, player: cleanedName }
        : r
    );

    const updatedPhotos = { ...photos };

    if (photos[oldName]) {
      updatedPhotos[cleanedName] = photos[oldName];
      delete updatedPhotos[oldName];
    }

    const updatedBadges = { ...badges };

    if (badges[oldName]) {
      updatedBadges[cleanedName] = badges[oldName];
      delete updatedBadges[oldName];
    }

    setPlayers(updatedPlayers);
    setRounds(updatedRounds);
    setPhotos(updatedPhotos);
    setBadges(updatedBadges);

    if (normaliseName(selectedPlayer) === normaliseName(oldName)) setSelectedPlayer(cleanedName);
    if (normaliseName(historyPlayer) === normaliseName(oldName)) setHistoryPlayer(cleanedName);
    if (
      players[profilePlayerIndex] &&
      normaliseName(players[profilePlayerIndex].name) === normaliseName(oldName)
    ) {
      const newProfileIndex = updatedPlayers.findIndex(
        (p) => normaliseName(p.name) === normaliseName(cleanedName)
      );
      setProfilePlayerIndex(newProfileIndex >= 0 ? newProfileIndex : 0);
    }
    if (normaliseName(adminPlayer) === normaliseName(oldName)) setAdminPlayer(cleanedName);

    addActivity(
      `${oldName} profile updated to ${cleanedName}`
    );

    setEditPlayerName(cleanedName);
    setEditedPlayerName("");
    setEditedPlayerHC("");

    showToast("Player profile updated");
  }

  function unlockAdmin() {
    if (adminCode === ADMIN_PASS) {
      setAdminUnlocked(true);
      setAdminCode("");
      showToast("Admin unlocked");
    } else alert("Wrong admin passcode");
  }

  function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file || !profilePlayer) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos({ ...photos, [profilePlayer]: reader.result });
      addActivity(`${profilePlayer} uploaded a new profile photo`);
      showToast("Photo uploaded");
    };
    reader.readAsDataURL(file);
  }

  function uploadGalleryPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setGallery([{ image: reader.result, caption: galleryCaption || "Round photo", date: new Date().toLocaleDateString() }, ...gallery]);
      setGalleryCaption("");
      addActivity("A new round gallery photo was added");
      showToast("Gallery photo added");
    };
    reader.readAsDataURL(file);
  }

  function getCourseToLoad() {
    const searchText = String(courseSearch || "").trim().toLowerCase();

    if (isLeasoweCourseName(searchText)) {
      const existingLeasowe = courses.find((c) => isLeasoweCourseName(c.name));
      return existingLeasowe || {
        name: "Leasowe Golf Club",
        tee: "Yellow",
        par: 71,
        rating: 71.4,
        slope: 129,
      };
    }

    if (!searchText) return selectedCourseDetails;

    const matches = getFilteredCourses(courseSearch);
    const exactMatch = matches.find(
      (c) => c.name.toLowerCase() === searchText
    );

    const selectedMatchesSearch = selectedCourseDetails?.name
      ?.toLowerCase()
      .includes(searchText);

    return (
      exactMatch ||
      (selectedMatchesSearch ? selectedCourseDetails : matches[0]) ||
      buildTypedCourseFromSearch(courseSearch) ||
      selectedCourseDetails
    );
  }

  async function loadDetailedScorecardTest() {
    const courseToLoad = getCourseToLoad();

    if (!courseToLoad?.name) {
      showToast("Choose a course first");
      return;
    }

    const hardcodedScorecard = getHardcodedScorecard(courseToLoad);
    const hardcodedLoadKey = courseKey(courseToLoad);

    if (hardcodedScorecard) {
      setSelectedCourse(courseKey(courseToLoad));
      setCourseSearch(courseToLoad.name);
      setDetailedScorecard(hardcodedScorecard);
      setHoleScores({});
    setPickedUpHoles({});
      setScorecardError("");
      setAutoLoadedScorecardKey(hardcodedLoadKey);
      const loadLabel = hardcodedScorecard.estimatedScorecard
        ? "estimated fallback scorecard"
        : "built-in hardcoded scorecard";
      setScorecardApiDebug(`Loaded ${courseToLoad.name} from ${loadLabel}`);
      showToast(`${courseToLoad.name} scorecard loaded`);
      return;
    }

    setScorecardLoading(true);
    setScorecardError("");

    const apiCourseName = courseToLoad.name;
    const apiTee = courseToLoad.tee || "Yellow";
    const loadKey = courseKey(courseToLoad);
    const requestUrl = `/api/test-scorecard?course=${encodeURIComponent(
      apiCourseName
    )}&tee=${encodeURIComponent(apiTee)}&cacheBust=${Date.now()}`;

    // Mark this course/tee as attempted immediately.
    // Without this, unsupported courses can fail, re-render, and auto-load forever.
    setAutoLoadedScorecardKey(loadKey);
    setScorecardApiDebug(`Loading: ${apiCourseName} / ${apiTee}`);

    try {
      const response = await fetch(requestUrl);
      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.message || `Scorecard API error ${response.status}`);
      }

      const holes =
        data?.tee_set?.holes ||
        data?.teeSet?.holes ||
        data?.tee_sets?.[0]?.holes ||
        data?.course?.tee_set?.holes ||
        data?.course?.tee_sets?.[0]?.holes ||
        data?.holes ||
        [];

      if (!Array.isArray(holes) || holes.length !== 18) {
        console.log("Unexpected scorecard response", data);
        throw new Error("No 18-hole scorecard returned for this course/tee");
      }

      setSelectedCourse(courseKey(courseToLoad));
      setCourseSearch(courseToLoad.name);
      setDetailedScorecard({
        course_id: data.course_id || `rapidapi-${nameKey(courseToLoad.name)}`,
        course_name: data.course_name || courseToLoad.name,
        hardcodedScorecard: false,
        estimatedScorecard: false,
        rapidApiScorecard: true,
        tee_set: {
          ...(data.tee_set || data.teeSet || data.tee_sets?.[0] || {}),
          holes,
        },
      });

      setHoleScores({});
    setPickedUpHoles({});
      setAutoLoadedScorecardKey(loadKey);
      setScorecardApiDebug(`Loaded ${courseToLoad.name} from RapidAPI`);
      showToast(`${courseToLoad.name} scorecard loaded`);
    } catch (err) {
      console.log("Scorecard load failed", err);

      if (isLeasoweCourseName(apiCourseName) || isLeasoweCourseName(courseSearch)) {
        const fallbackScorecard = {
          ...LEASOWE_FALLBACK_SCORECARD,
          course_name: "Leasowe Golf Club",
          tee_set: {
            ...LEASOWE_FALLBACK_SCORECARD.tee_set,
            colour: String(apiTee || "Yellow").toLowerCase(),
          },
        };

        setSelectedCourse(courseKey({ name: "Leasowe Golf Club", tee: "Yellow" }));
        setCourseSearch("Leasowe Golf Club");
        setDetailedScorecard(fallbackScorecard);
        setHoleScores({});
    setPickedUpHoles({});
        setScorecardError("");
        setAutoLoadedScorecardKey(courseKey({ name: "Leasowe Golf Club", tee: "Yellow" }));
        setScorecardApiDebug("Loaded Leasowe from built-in fallback after API/app mismatch");
        showToast("Leasowe scorecard loaded");
        return;
      }

      const estimatedScorecard = buildEstimatedScorecard(courseToLoad);

      setSelectedCourse(courseKey(courseToLoad));
      setCourseSearch(courseToLoad.name);
      setDetailedScorecard(estimatedScorecard);
      setHoleScores({});
    setPickedUpHoles({});
      setScorecardError("");
      setAutoLoadedScorecardKey(loadKey);
      setScorecardApiDebug(
        `RapidAPI failed for ${apiCourseName} / ${apiTee}. Estimated scorecard loaded instead.`
      );
      showToast(`${courseToLoad.name} estimated scorecard loaded`);
      return;
    } finally {
      setScorecardLoading(false);
    }
  }

  function clearDetailedScorecard() {
    setDetailedScorecard(null);
    setHoleScores({});
    setPickedUpHoles({});
    setScorecardError("");
    setAutoLoadedScorecardKey("");
    setScorecardApiDebug("");
    showToast("Detailed scorecard cleared");
  }

  function updateHoleScore(holeNumber, value) {
    setHoleScores({
      ...holeScores,
      [holeNumber]: value,
    });
  }

  function togglePickedUpHole(holeNumber, checked) {
    setPickedUpHoles({
      ...pickedUpHoles,
      [holeNumber]: checked,
    });

    if (checked) {
      setHoleScores({
        ...holeScores,
        [holeNumber]: "",
      });
    }
  }

  function resetAll() {
    if (!adminUnlocked) {
      showToast("Admin only: unlock Admin to reset data");
      return;
    }

    const confirmReset = window.confirm(
      "Admin reset all local app data? This clears players, rounds, photos, badges, activity and courses on this device."
    );

    if (!confirmReset) return;

    localStorage.clear();
    setPlayers(defaultPlayers);
    setCourses(defaultCourses);
    setRounds([]);
    setPhotos({});
    setGallery([]);
    setBadges({});
    setActivity([]);
    setLoggedIn(true);
    localStorage.setItem("pg2-auth", "true");
    showToast("Data reset");
  }

  const sorted = [...players].sort((a, b) => a.handicap - b.handicap);
  const filteredCourses = getFilteredCourses(courseSearch);
  const typedSearchCourse = buildTypedCourseFromSearch(courseSearch);
  const selectedCourseDetails =
    courses.find((c) => courseKey(c) === selectedCourse) ||
    filteredCourses[0] ||
    (String(courseSearch || "").trim() ? typedSearchCourse : null) ||
    courses[0];

  const selectedPlayerDetails = findPlayerByName(players, selectedPlayer);
  const detailedHoles = detailedScorecard?.tee_set?.holes || [];
  const detailedHolesForRound = isNineHoles
    ? detailedHoles.slice(0, 9)
    : detailedHoles;
  const detailedSummary = analyseHoleScores(detailedHolesForRound, holeScores, pickedUpHoles);
  const autoStablefordPoints = calculateStablefordPoints(
    detailedHolesForRound,
    holeScores,
    selectedPlayerDetails?.handicap,
    selectedCourseDetails,
    pickedUpHoles
  );

  useEffect(() => {
    if (roundEntryMode !== "hole-by-hole") return;
    if (!selectedCourseDetails?.name) return;
    if (scorecardLoading) return;
    if (!String(courseSearch || "").trim()) return;

    const selectedKey = courseKey(getCourseToLoad() || selectedCourseDetails);

    // Do not keep retrying the same course/tee after a failure.
    // User can press Retry manually, or change course to trigger a new attempt.
    if (autoLoadedScorecardKey === selectedKey) return;

    const timer = setTimeout(() => {
      loadDetailedScorecardTest();
    }, 450);

    return () => clearTimeout(timer);
  }, [
    roundEntryMode,
    selectedCourse,
    selectedCourseDetails?.name,
    selectedCourseDetails?.tee,
    autoLoadedScorecardKey,
    courseSearch,
    scorecardLoading,
  ]);

  const selectedHistoryPlayer = findPlayerByName(players, historyPlayer);
  const historyLookupName = selectedHistoryPlayer?.name || historyPlayer;

  const historyRounds = rounds.filter((r) =>
    roundBelongsToPlayer(r, historyLookupName)
  );

  const trendPoints = buildTrendPoints(rounds, historyLookupName);

  const safeProfileIndex = players[profilePlayerIndex] ? profilePlayerIndex : 0;
  const profileDetails = players[safeProfileIndex] || null;
  const profilePlayer = profileDetails?.name || "";

  const meritTable = players.map((p) => {
    const playerRounds = rounds.filter((r) => roundBelongsToPlayer(r, p.name));
    return { name: p.name, total: playerRounds.reduce((sum, r) => sum + Number(r.meritPoints || 0), 0), rounds: playerRounds.length };
  }).sort((a, b) => b.total - a.total).slice(0, 10);

  const playerStats = players.map((player) => {
    const playerRounds = rounds.filter((r) => roundBelongsToPlayer(r, player.name));

    const scoreRounds = playerRounds.filter((r) => r.score);
    const stablefordRounds = playerRounds.filter((r) => r.points);

    const bestScoreRound = scoreRounds.length
      ? scoreRounds.reduce((best, current) =>
          Number(current.score) < Number(best.score) ? current : best
        )
      : null;

    const bestStablefordRound = stablefordRounds.length
      ? stablefordRounds.reduce((best, current) =>
          Number(current.points) > Number(best.points) ? current : best
        )
      : null;

    return {
      name: player.name,
      rounds: playerRounds.length,
      bestScore: bestScoreRound ? bestScoreRound.score : "-",
      bestScoreCourse: bestScoreRound ? bestScoreRound.course : "-",
      bestScoreDate: bestScoreRound ? bestScoreRound.date : "-",
      bestPoints: bestStablefordRound ? bestStablefordRound.points : "-",
      bestPointsCourse: bestStablefordRound ? bestStablefordRound.course : "-",
      bestPointsDate: bestStablefordRound ? bestStablefordRound.date : "-",
      handicap: player.handicap,
    };
  });

  const hallStats = players.map((player) => {
    const playerRounds = rounds.filter((r) => roundBelongsToPlayer(r, player.name));
    const scores = playerRounds
      .filter((r) => Number(r.holes || 18) === 18)
      .map((r) => Number(r.score))
      .filter(Boolean);
    const stableford = playerRounds.map((r) => Number(r.points)).filter(Boolean);
    const wins = playerRounds.filter((r) => r.didWin).length;
    const merit = playerRounds.reduce((sum, r) => sum + Number(r.meritPoints || 0), 0);
    const badgeCount = Object.values(badges[player.name] || {}).filter(Boolean).length;
    const hcValues = playerRounds.map((r) => Number(r.newHandicap)).filter(Boolean);
    const lowestHC = hcValues.length ? Math.min(...hcValues, player.handicap) : player.handicap;
    const biggestCut = playerRounds.length ? Math.max(...playerRounds.map((r) => Number(r.oldHandicap) - Number(r.newHandicap))) : 0;
    return { name: player.name, wins, rounds: playerRounds.length, bestScore: scores.length ? Math.min(...scores) : "-", bestStableford: stableford.length ? Math.max(...stableford) : "-", merit, badgeCount, lowestHC, biggestCut };
  });

  const hall = {
    mostWins: [...hallStats].sort((a, b) => b.wins - a.wins)[0],
    lowestHC: [...hallStats].sort((a, b) => a.lowestHC - b.lowestHC)[0],
    biggestCut: [...hallStats].sort((a, b) => b.biggestCut - a.biggestCut)[0],
    mostRounds: [...hallStats].sort((a, b) => b.rounds - a.rounds)[0],
    highestStableford: [...hallStats].filter((s) => s.bestStableford !== "-").sort((a, b) => Number(b.bestStableford) - Number(a.bestStableford))[0],
    bestScore: [...hallStats].filter((s) => s.bestScore !== "-").sort((a, b) => Number(a.bestScore) - Number(b.bestScore))[0],
    meritLeader: [...hallStats].sort((a, b) => b.merit - a.merit)[0],
    mostBadges: [...hallStats].sort((a, b) => b.badgeCount - a.badgeCount)[0],
  };

  if (loading) {
    return (
      <main>
        <section className="splash">
          <div className="splash-icon">⛳</div>
          <h1>P2G</h1>
          <p>Pitch to Green Golf Society</p>
          <div className="loading-bar"><div /></div>
        </section>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main>
        <section>
          <h1>PG2 Golf Login</h1>
          <p>Pitch to Green Golf Society</p>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </section>
        {toast && <div className="toast">{toast}</div>}
      </main>
    );
  }

  return (
    <main>
      <style>{`
        .hero {
          position: relative;
        }

        .p2g-header-logo {
          position: absolute;
          top: 24px;
          right: 20px;
          width: 96px;
          max-height: 96px;
          object-fit: contain;
          z-index: 5;
        }


        .scorecard-test-box {
          margin: 14px 0;
          padding: 14px;
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .hole-score-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }

        .hole-score-row {
          display: grid;
          grid-template-columns: 1fr 90px 70px;
          gap: 10px;
          align-items: center;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 10px;
        }

        .hole-score-row label {
          display: block;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .hole-score-row small {
          display: block;
          color: #64748b;
          line-height: 1.25;
        }

        .hole-info-cell {
          min-width: 0;
        }

        .pickup-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
          min-height: 32px;
          padding: 7px 12px;
          border-radius: 999px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: #0f172a;
          font-size: 12px;
          font-weight: 900;
          line-height: 1;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
        }

        .pickup-toggle.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .pickup-toggle:active {
          transform: scale(0.98);
        }

        .hole-score-row input {
          margin: 0;
          text-align: center;
        }

        .hole-stableford-cell {
          text-align: center;
          font-weight: 800;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 9px 6px;
          min-height: 42px;
        }

        .hole-stableford-cell span {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 2px;
        }

        .hole-score-summary {
          margin-top: 12px;
          padding: 12px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .scorecard-confirmed-badge {
          display: inline-block;
          margin: 6px 0 4px;
          padding: 5px 10px;
          border-radius: 999px;
          background: #dcfce7;
          color: #166534;
          border: 1px solid #22c55e;
          font-size: 12px;
          font-weight: 800;
        }

        .scorecard-estimated-badge {
          display: inline-block;
          margin: 6px 0 4px;
          padding: 5px 10px;
          border-radius: 999px;
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #f59e0b;
          font-size: 12px;
          font-weight: 800;
        }

        .scorecard-api-badge {
          display: inline-block;
          margin: 6px 0 4px;
          padding: 5px 10px;
          border-radius: 999px;
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #3b82f6;
          font-size: 12px;
          font-weight: 800;
        }

        .calculated-score-label {
          display: block;
          margin-top: 12px;
          margin-bottom: 5px;
          font-weight: 800;
          color: #0f172a;
        }

        .hidden-file-input {
          display: none;
        }

        .profile-upload-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin: 10px 0 14px;
          padding: 12px 14px;
          border-radius: 999px;
          background: #0f172a;
          color: #ffffff;
          font-weight: 800;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
        }

        .profile-upload-button:active {
          transform: scale(0.98);
        }


        .standings-badge-block {
          margin-top: 8px;
          padding-top: 7px;
          border-top: 1px solid #e2e8f0;
          max-width: 100%;
        }

        .standings-badge-title {
          margin-bottom: 5px;
          font-size: 10px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
        }

        .standings-badge-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .standings-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 7px;
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.1;
          white-space: nowrap;
        }

        .standings-badge-icon {
          font-size: 12px;
          line-height: 1;
        }

        .standings-badge-empty {
          margin: 6px 0 0;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
        }


        .round-choice-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
          margin-top: 14px;
        }

        .round-choice-stack button,
        .course-match-list button {
          width: 100%;
          text-align: left;
          white-space: normal;
        }

        .course-match-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 12px 0;
        }

        @media (max-width: 480px) {
          .p2g-header-logo {
            width: 82px;
            top: 20px;
            right: 18px;
          }

          .hole-score-row {
            grid-template-columns: 1fr 78px 62px;
            gap: 8px;
            padding: 9px;
          }

          .hole-score-row small {
            font-size: 11px;
          }

          .hole-stableford-cell {
            padding: 8px 4px;
          }
        }
      `}</style>

      <section className="hero" style={{ paddingRight: "120px" }}>
  <img
    className="p2g-header-logo"
    src="/p2g-logo.webp"
    alt="Pitch to Green logo"
  />

  <h1>P2G Golf Society</h1>
  <h2>Your Digital Clubhouse</h2>

  <div className="top-buttons">
    <button className="home-btn" onClick={() => setPage("home")}>Home</button>
    <button className="logout-btn" onClick={logout}>Logout</button>
  </div>
</section>

      {page === "home" && (
        <section>
          <h2>Home</h2>
          <style>{`
            .tile::before {
              content: none !important;
              display: none !important;
            }
          `}</style>

          <div className="tile-grid">
            <button
              className="tile"
              onClick={() => {
                setRoundEntryMode("");
                setPage("add-round");
              }}
            >
              <span>⛳</span> Add Round
            </button>

            <button className="tile" onClick={() => setPage("activity")}>
              <span>⚡</span> Recent Activity
            </button>

            <button className="tile" onClick={() => setPage("stats")}>
              <span>📊</span> Player Stats
            </button>

            <button className="tile" onClick={() => setPage("standings")}>
              <span>📋</span> HC List
            </button>

            <button className="tile" onClick={() => setPage("profile")}>
              <span>🪪</span> Player Profile
            </button>

            <button className="tile" onClick={() => setPage("history")}>
              <span>📈</span> Player History
            </button>

            <button className="tile" onClick={() => setPage("merit")}>
              <span>🏆</span> Order of Merit
            </button>

            <button className="tile" onClick={() => setPage("hall")}>
              <span>🏛️</span> Hall of Fame
            </button>

            <button className="tile" onClick={() => setPage("add-player")}>
              <span>👤</span> Add Player
            </button>

            <button className="tile" onClick={() => setPage("add-course")}>
              <span>🏌️</span> Add Course
            </button>

            <button className="tile" onClick={() => setPage("gallery")}>
              <span>📸</span> Round Gallery
            </button>

            <button className="tile" onClick={() => setPage("admin")}>
              <span>🔐</span> Admin
            </button>
          </div>
        </section>
      )}

      {page === "hall" && (
        <section>
          <h2>Hall of Fame</h2>
          <div className="player-card"><div><strong>🏆 Most Competition Wins</strong><br />{hall.mostWins?.name || "-"} — {hall.mostWins?.wins || 0}</div></div>
          <div className="player-card"><div><strong>📉 Lowest HC Ever</strong><br />{hall.lowestHC?.name || "-"} — {hall.lowestHC?.lowestHC?.toFixed?.(1) || "-"}</div></div>
          <div className="player-card"><div><strong>🔥 Biggest HC Reduction</strong><br />{hall.biggestCut?.name || "-"} — {hall.biggestCut?.biggestCut?.toFixed?.(1) || "0.0"}</div></div>
          <div className="player-card"><div><strong>⛳ Most Rounds Played</strong><br />{hall.mostRounds?.name || "-"} — {hall.mostRounds?.rounds || 0}</div></div>
          <div className="player-card"><div><strong>💯 Highest Stableford</strong><br />{hall.highestStableford?.name || "-"} — {hall.highestStableford?.bestStableford || "-"}</div></div>
          <div className="player-card"><div><strong>🎯 Best Gross Score</strong><br />{hall.bestScore?.name || "-"} — {hall.bestScore?.bestScore || "-"}</div></div>
          <div className="player-card"><div><strong>👑 Order of Merit Leader</strong><br />{hall.meritLeader?.name || "-"} — {hall.meritLeader?.merit || 0} pts</div></div>
          <div className="player-card"><div><strong>🎖 Most Badges Unlocked</strong><br />{hall.mostBadges?.name || "-"} — {hall.mostBadges?.badgeCount || 0}</div></div>
        </section>
      )}

      {page === "activity" && (
        <section>
          <h2>Recent Activity</h2>
          {activity.length === 0 && <p>No activity yet.</p>}
          {activity.map((item, index) => (
            <div className="activity-card" key={index}>
              <strong>{item.text}</strong><br />
              <span className="muted">{item.date} at {item.time}</span>
            </div>
          ))}
        </section>
      )}

      {page === "standings" && (
        <section>
          <h2>HC List</h2>
          {sorted.map((p, i) => (
            <div className="player-card profile-card" key={p.name}>
              <div className="profile-left">
                {photos[p.name] ? <img className="avatar-img" src={photos[p.name]} /> : <div className="avatar">{p.name.charAt(0)}</div>}
                <div>
                  <strong>{i + 1}. {p.name}</strong><br />
                  Handicap {p.handicap.toFixed(1)}
                  <StandingsBadgeList badges={badges[p.name]} />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {page === "merit" && (
        <section>
          <h2>Order of Merit</h2>
          <p>Top 10. Add up to 10 points when saving each round.</p>
          {meritTable.map((p, i) => (
            <div className="player-card" key={p.name}>
              <div><strong>{i + 1}. {p.name}</strong><br />Points: {p.total} | Rounds: {p.rounds}</div>
            </div>
          ))}
        </section>
      )}

      {page === "gallery" && (
        <section>
          <h2>Round Gallery</h2>
          <input placeholder="Caption" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} />
          <input type="file" accept="image/*" onChange={uploadGalleryPhoto} />
          {gallery.map((g, i) => (
            <div className="player-card gallery-card" key={i}>
              <img className="gallery-img" src={g.image} />
              <strong>{g.caption}</strong><br />
              <span className="muted">{g.date}</span>
            </div>
          ))}
        </section>
      )}

      {page === "profile" && (
        <section>
          <h2>Player Profile</h2>
          <select
            value={safeProfileIndex}
            onChange={(e) => setProfilePlayerIndex(Number(e.target.value))}
          >
            {players.map((p, index) => (
              <option key={`${p.name}-${index}`} value={index}>{p.name}</option>
            ))}
          </select>
          {profileDetails && (
            <p className="muted">Viewing profile: {profileDetails.name}</p>
          )}
          {!profileDetails && (
            <p className="muted">Player not found. Choose another player from the dropdown.</p>
          )}

          {profileDetails && (
            <div className="profile-page-card" key={profileDetails.name}>
              {photos[profileDetails.name] ? <img className="profile-photo" src={photos[profileDetails.name]} /> : <div className="profile-photo-placeholder">{profileDetails.name.charAt(0)}</div>}
              <h2>{profileDetails.name}</h2>
              <p>Current HC: {profileDetails.handicap.toFixed(1)}</p>
              <input
                id="profile-photo-upload"
                className="hidden-file-input"
                type="file"
                accept="image/*"
                onChange={uploadPhoto}
              />
              <label className="profile-upload-button" htmlFor="profile-photo-upload">
                📸 Change profile picture
              </label>
              <h3>Badges</h3>
              <BadgeList badges={badges[profileDetails.name]} />
              <h3>Unlock Badges</h3>
              {achievementOptions.filter((b) => b.key !== "winner").map((badge) => (
                <label className="check-row" key={badge.key}>
                  <input type="checkbox" checked={!!badges[profilePlayer]?.[badge.key]} onChange={() => toggleProfileBadge(badge.key)} />
                  {badge.icon} {badge.label}
                </label>
              ))}
            </div>
          )}
        </section>
      )}

      {page === "admin" && (
        <section>
          <h2>Admin</h2>
          {!adminUnlocked ? (
            <>
              <p>Enter admin passcode.</p>
              <input placeholder="Admin passcode" type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
              <button onClick={unlockAdmin}>Unlock Admin</button>
            </>
          ) : (
            <>
              <p>Manually amend a player's current handicap.</p>
              <select value={adminPlayer} onChange={(e) => setAdminPlayer(e.target.value)}>
                {players.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
              <input placeholder="New handicap" type="number" step="0.1" value={manualHandicap} onChange={(e) => setManualHandicap(e.target.value)} />
              <button onClick={updateManualHandicap}>Update Handicap</button>
              <button onClick={backupToCloud}>☁️ Backup to Cloud</button>
              <button onClick={restoreCloudData}>☁️ Restore from Cloud</button>
              <button onClick={clearRecentActivity}>🧹 Clear Recent Activity</button>
              <button onClick={importDefaultCourses}>⛳ Import Default Courses</button>
              <button onClick={resetAll}>⚠️ Admin Reset All Local Data</button>

              <h3>Delete Players</h3>
              <p className="muted">
                Admin only. Removing a player deletes them from the active HC list, but keeps their saved round history.
              </p>
              {players.map((p) => (
                <div className="player-card" key={`delete-player-${p.name}`}>
                  <div>
                    <strong>{p.name}</strong><br />
                    Handicap {Number(p.handicap).toFixed(1)}
                  </div>
                  <button onClick={() => removePlayer(p.name)}>
                    Delete Player
                  </button>
                </div>
              ))}

              <h3>Edit Player Profile</h3>

              <select
                value={editPlayerName}
                onChange={(e) => setEditPlayerName(e.target.value)}
              >
                {players.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>

              <input
                placeholder="Correct player name"
                value={editedPlayerName}
                onChange={(e) => setEditedPlayerName(e.target.value)}
              />

              <input
                placeholder="Optional new HC"
                type="number"
                step="0.1"
                value={editedPlayerHC}
                onChange={(e) => setEditedPlayerHC(e.target.value)}
              />

              <button onClick={savePlayerProfileEdit}>
                Save Player Changes
              </button>

              <button onClick={repairPlayerRoundLinks}>
                🔧 Auto Repair This Player's Round Links
              </button>

              <input
                placeholder="Old round name to relink, e.g. James or Sam"
                value={oldRoundNameToRepair}
                onChange={(e) => setOldRoundNameToRepair(e.target.value)}
              />

              <button onClick={repairTypedRoundLinks}>
                🔧 Repair Typed Round Name To Selected Player
              </button>

              <div className="player-card">
                <div>
                  <strong>Round names currently stored:</strong><br />
                  {getRawRoundPlayerNames(rounds).join(", ") || "No rounds yet"}
                </div>
              </div>

              <h3>Delete Rounds</h3>

              {rounds.length === 0 && <p>No rounds to delete.</p>}

              {rounds.slice(0, 30).map((r, i) => (
                <div className="player-card" key={i}>
                  <div>
                    <strong>{r.player}</strong><br />
                    {r.course} - {r.tee}<br />
                    {r.date} | {r.holes || 18} holes<br />
                    Score {r.score || "-"} | Points {r.points || "-"}<br />
                    HC {Number(r.oldHandicap).toFixed(1)} → {Number(r.newHandicap).toFixed(1)}
                  </div>

                  <button onClick={() => {
                    setHistoryPlayer(r.player);
                    setPage("history");
                  }}>
                    View History
                  </button>

                  <button onClick={() => deleteRound(i)}>
                    Delete
                  </button>
                </div>
              ))}

              <h3>System Status</h3>

              <div className="player-card">
                <div>
                  <strong>☁️ Cloud</strong><br />
                  Live Sync Active
                </div>
              </div>

              <div className="player-card">
                <div>
                  <strong>🟢 Realtime</strong><br />
                  Connected
                </div>
              </div>

              <div className="player-card">
                <div>
                  <strong>⏱ Last Live Sync</strong><br />
                  {lastSync}
                </div>
              </div>

              <div className="player-card">
                <div>
                  <strong>👥 Players</strong><br />
                  {players.length}
                </div>
              </div>

              <div className="player-card">
                <div>
                  <strong>⛳ Rounds</strong><br />
                  {rounds.length}
                </div>
              </div>

              <div className="player-card">
                <div>
                  <strong>📸 Gallery Photos</strong><br />
                  {gallery.length}
                </div>
              </div>

              <div className="player-card">
                <div>
                  <strong>🎖 Badges Unlocked</strong><br />
                  {Object.values(badges).reduce(
                    (total, playerBadges) =>
                      total + Object.values(playerBadges).filter(Boolean).length,
                    0
                  )}
                </div>
              </div>

              <div className="player-card">
                <div>
                  <strong>📱 App Version</strong><br />
                  v7.4 Admin-Locked Deletes
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {page === "add-player" && (
        <section>
          <h2>Add Player</h2>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="HC" type="number" value={handicap} onChange={(e) => setHandicap(e.target.value)} />
          <button onClick={addPlayer}>Add Player</button>
        </section>
      )}

      {page === "add-round" && (
        <section>
          <h2>Add Round</h2>

          {!roundEntryMode && (
            <>
              <p className="muted">Choose how you want to enter this round.</p>

              <div className="round-choice-stack">
                <button
                  type="button"
                  className="tile"
                  onClick={() => {
                    setRoundEntryMode("hole-by-hole");
                    setScore("");
                    setPoints("");
                    setDetailedScorecard(null);
                    setHoleScores({});
    setPickedUpHoles({});
                    setScorecardError("");
                    setAutoLoadedScorecardKey("");
                  }}
                >
                  <span>📝</span> Hole-By-Hole Round
                </button>

                <button
                  type="button"
                  className="tile"
                  onClick={() => {
                    setRoundEntryMode("completed");
                    setScore("");
                    setPoints("");
                    setDetailedScorecard(null);
                    setHoleScores({});
    setPickedUpHoles({});
                    setScorecardError("");
                    setAutoLoadedScorecardKey("");
                  }}
                >
                  <span>✅</span> Already Completed Round
                </button>
              </div>
            </>
          )}

          {roundEntryMode && (
            <button
              type="button"
              onClick={() => {
                setRoundEntryMode("");
                setDetailedScorecard(null);
                setHoleScores({});
    setPickedUpHoles({});
                setScorecardError("");
                setAutoLoadedScorecardKey("");
              }}
            >
              ← Back to round type
            </button>
          )}

          {roundEntryMode === "hole-by-hole" && (
            <>
              <h3>Hole-By-Hole Round</h3>

              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
              >
                {players.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Search courses..."
                value={courseSearch}
                onChange={(e) => handleCourseSearchChange(e.target.value)}
              />

              {courseSearch.trim() && filteredCourses.length > 0 && (
                <div className="scorecard-test-box">
                  <strong>Matching courses</strong>
                  <div className="course-match-list">
                    {filteredCourses.slice(0, 8).map((c) => (
                      <button
                        type="button"
                        key={courseKey(c)}
                        onClick={() => chooseCourse(c)}
                      >
                        {c.name} - {c.tee} tees
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="player-card">
                <div>
                  <strong>{selectedCourseDetails.name}</strong><br />
                  {selectedCourseDetails.tee} | Par {selectedCourseDetails.par} | Rating {selectedCourseDetails.rating} | Slope {selectedCourseDetails.slope}
                  {scorecardApiDebug && (
                    <>
                      <br />
                      <span className="muted">{scorecardApiDebug}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="scorecard-test-box">
                <strong>Hole-by-hole scoring</strong>
                <p className="muted">
                  Loads the selected course scorecard. Gross score and Stableford points calculate automatically as you enter hole scores.
                </p>

                {scorecardLoading && (
                  <p className="muted">Loading scorecard automatically...</p>
                )}

                {!scorecardLoading && !detailedScorecard && !scorecardError && (
                  <p className="muted">Choose a course and the scorecard will load automatically.</p>
                )}

                {detailedScorecard && (
                  <button type="button" onClick={clearDetailedScorecard}>
                    Clear Hole Scores
                  </button>
                )}

                {scorecardError && (
                  <>
                    <p className="muted">{scorecardError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoLoadedScorecardKey("");
                        loadDetailedScorecardTest();
                      }}
                      disabled={scorecardLoading}
                    >
                      Retry Scorecard
                    </button>
                  </>
                )}

                {detailedHoles.length > 0 && (
                  <>
                    <label className="check-row">
                      <input
                        type="checkbox"
                        checked={isNineHoles}
                        onChange={(e) => setIsNineHoles(e.target.checked)}
                      />
                      Only 9 holes played?
                    </label>

                    <div className="hole-score-summary">
                      <strong>{detailedScorecard.course_name}</strong><br />
                      {detailedScorecard.hardcodedScorecard && (
                        <>
                          <span className="scorecard-confirmed-badge">✅ Scorecard confirmed</span><br />
                        </>
                      )}
                      {detailedScorecard.estimatedScorecard && (
                        <>
                          <span className="scorecard-estimated-badge">⚠️ Estimated scorecard</span><br />
                        </>
                      )}
                      {detailedScorecard.rapidApiScorecard && (
                        <>
                          <span className="scorecard-api-badge">🔵 Scorecard loaded from API</span><br />
                        </>
                      )}
                      Tee: {detailedScorecard.tee_set?.colour || detailedScorecard.tee_set?.name || "-"} |
                      Rating {detailedScorecard.tee_set?.course_rating} |
                      Slope {detailedScorecard.tee_set?.slope_rating}<br />
                      {detailedSummary.complete ? (
                        <>
                          Gross: {detailedSummary.gross} |
                          Stableford: {autoStablefordPoints || 0}<br />
                          Front 9: {detailedSummary.frontNine} |
                          Back 9: {isNineHoles ? "-" : detailedSummary.backNine}<br />
                          Pars: {detailedSummary.pars} |
                          Birdies: {detailedSummary.birdies} |
                          Eagles: {detailedSummary.eagles}
                        </>
                      ) : (
                        <>Enter all {isNineHoles ? 9 : 18} hole scores to calculate gross and Stableford totals.</>
                      )}
                    </div>

                    <div className="hole-score-grid">
                      {detailedHolesForRound.map((hole) => {
                        const holeStableford = calculateHoleStablefordPoint(
                          hole,
                          holeScores[hole.hole_number],
                          selectedPlayerDetails?.handicap,
                          selectedCourseDetails,
                          pickedUpHoles[hole.hole_number]
                        );

                        return (
                          <div className="hole-score-row" key={hole.hole_number}>
                            <div className="hole-info-cell">
                              <label>Hole {hole.hole_number}</label>
                              <small>
                                Par {hole.par} | SI {hole.stroke_index} | {hole.yardage} yds
                              </small>

                              <button
                                type="button"
                                className={`pickup-toggle ${pickedUpHoles[hole.hole_number] ? "active" : ""}`}
                                onClick={() =>
                                  togglePickedUpHole(
                                    hole.hole_number,
                                    !pickedUpHoles[hole.hole_number]
                                  )
                                }
                              >
                                {pickedUpHoles[hole.hole_number]
                                  ? "Picked Up ✓"
                                  : "Picked Up"}
                              </button>
                            </div>

                            <div>
                              <input
                                type="number"
                                min="1"
                                placeholder="Gross"
                                value={pickedUpHoles[hole.hole_number] ? "" : holeScores[hole.hole_number] || ""}
                                disabled={!!pickedUpHoles[hole.hole_number]}
                                onChange={(e) => updateHoleScore(hole.hole_number, e.target.value)}
                              />
                            </div>

                            <div className="hole-stableford-cell">
                              <span>Pts</span>
                              {holeStableford === "" ? "-" : holeStableford}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <label className="calculated-score-label">Gross score</label>
              <input
                placeholder="Gross score"
                type="text"
                value={detailedSummary.complete ? detailedSummary.gross : ""}
                readOnly
              />

              <label className="calculated-score-label">Stableford points</label>
              <input
                placeholder="Stableford points"
                type="number"
                value={detailedSummary.complete ? autoStablefordPoints || 0 : ""}
                readOnly
              />

              <input
                placeholder="Order of Merit points 0-10"
                type="number"
                min="0"
                max="10"
                value={meritPoints}
                onChange={(e) => setMeritPoints(e.target.value)}
              />

              <label className="check-row">
                <input type="checkbox" checked={didWin} onChange={(e) => setDidWin(e.target.checked)} />
                Did this player win?
              </label>

              <button onClick={addRound}>Add Round & Update Handicap</button>
            </>
          )}

          {roundEntryMode === "completed" && (
            <>
              <h3>Already Completed Round</h3>
              <p className="muted">
                Use this for rounds where you already know the gross score and Stableford points.
              </p>

              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
              >
                {players.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Search courses..."
                value={courseSearch}
                onChange={(e) => handleCourseSearchChange(e.target.value)}
              />

              {courseSearch.trim() && filteredCourses.length > 0 && (
                <div className="scorecard-test-box">
                  <strong>Matching courses</strong>
                  <div className="course-match-list">
                    {filteredCourses.slice(0, 8).map((c) => (
                      <button
                        type="button"
                        key={courseKey(c)}
                        onClick={() => chooseCourse(c)}
                      >
                        {c.name} - {c.tee} tees
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="player-card">
                <div>
                  <strong>{selectedCourseDetails.name}</strong><br />
                  {selectedCourseDetails.tee} | Par {selectedCourseDetails.par} | Rating {selectedCourseDetails.rating} | Slope {selectedCourseDetails.slope}
                </div>
              </div>

              <input
                placeholder="Gross score"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />

              <input
                placeholder="Stableford points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />

              <input
                placeholder="Order of Merit points 0-10"
                type="number"
                min="0"
                max="10"
                value={meritPoints}
                onChange={(e) => setMeritPoints(e.target.value)}
              />

              <label className="check-row">
                <input
                  type="checkbox"
                  checked={isNineHoles}
                  onChange={(e) => setIsNineHoles(e.target.checked)}
                />
                Only 9 holes played?
              </label>

              <label className="check-row">
                <input type="checkbox" checked={didWin} onChange={(e) => setDidWin(e.target.checked)} />
                Did this player win?
              </label>

              <button onClick={addRound}>Add Round & Update Handicap</button>
            </>
          )}
        </section>
      )}

      {page === "history" && (
        <section>
          <h2>Player History</h2>
          <select value={historyPlayer} onChange={(e) => setHistoryPlayer(e.target.value)}>
            {players.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          <h3>Handicap Trend</h3>
          <TrendGraph points={trendPoints} />
          <h3>Rounds</h3>
          {historyRounds.length === 0 && (
            <div className="player-card">
              <div>
                <strong>No rounds for {historyPlayer}.</strong>
              </div>
            </div>
          )}
          {historyRounds.map((r, i) => (
            <div className="player-card" key={i}>
              <div>
                <strong>{r.course}</strong>
                <br />
                <span className="muted">
                  {r.date} • {r.tee} Tees
                </span>

                <br /><br />

                <strong>Score:</strong> {r.score || "-"} &nbsp;|&nbsp;
                <strong> Stableford:</strong> {r.points || "-"} &nbsp;|&nbsp;
                <strong> Merit:</strong> {r.meritPoints || 0}

                {r.didWin && (
                  <>
                    <br />
                    🏆 Competition Winner
                  </>
                )}

                {r.detailedScoring && (
                  <>
                    <br /><br />

                    <div
                      style={{
                        padding: "10px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                      }}
                    >
                      <strong>Round Summary</strong>

                      <br />
                      Front 9: {r.frontNine || "-"}

                      {Number(r.holes || 18) !== 9 && (
                        <>
                          <br />
                          Back 9: {r.backNine || "-"}
                        </>
                      )}

                      <br />
                      Pars: {r.pars || 0}

                      <br />
                      Birdies: {r.birdies || 0}

                      <br />
                      Eagles: {r.eagles || 0}
                    </div>
                  </>
                )}

                <br /><br />

                <strong>
                  HC {Number(r.oldHandicap).toFixed(1)} → {Number(r.newHandicap).toFixed(1)}
                </strong>
              </div>
            </div>
          ))}
        </section>
      )}

      {page === "add-course" && (
        <section>
          <h2>Add Course</h2>

          <div style={{
            background: "#f0fdf4",
            border: "1.5px solid #22c55e",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
          }}>
            <strong>📷 Scan a Scorecard</strong>
            <p className="muted" style={{ margin: "6px 0 12px" }}>
              Take a photo of the scorecard and Claude will read all 18 holes,
              add the course to your list, and prepare it for hole-by-hole scoring.
            </p>

            {scanLoading && (
              <p className="muted">⏳ Reading scorecard... this can take a few seconds</p>
            )}

            {scanError && (
              <p style={{ color: "#dc2626", fontSize: "14px", margin: "8px 0" }}>{scanError}</p>
            )}

            {scanSuccess && (
              <p style={{ color: "#16a34a", fontSize: "14px", margin: "8px 0" }}>{scanSuccess}</p>
            )}

{!scanLoading && (
  <label
    style={{
      display: "inline-block",
      background: "#22c55e",
      color: "white",
      padding: "10px 20px",
      borderRadius: "12px",
      fontWeight: "700",
      cursor: "pointer",
      fontSize: "15px",
    }}
  >
    📷 Upload Scorecard Screenshot

    <input
      type="file"
      accept="image/*"
      onChange={scanScorecardPhoto}
      style={{ display: "none" }}
    />
  </label>
)}
 
          </div>

          <p className="muted" style={{ textAlign: "center", margin: "16px 0 8px" }}>— or add manually —</p>

          <input placeholder="Course name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
          <input placeholder="Tee colour" value={courseTee} onChange={(e) => setCourseTee(e.target.value)} />
          <input placeholder="Par" type="number" value={coursePar} onChange={(e) => setCoursePar(e.target.value)} />
          <input placeholder="Course rating" type="number" step="0.1" value={courseRating} onChange={(e) => setCourseRating(e.target.value)} />
          <input placeholder="Slope" type="number" value={courseSlope} onChange={(e) => setCourseSlope(e.target.value)} />
          <button onClick={addCourse}>Add Course</button>
        </section>
      )}

      {page === "stats" && (
        <section>
          <h2>Player Stats</h2>
          {playerStats.map((s) => (
            <div className="player-card" key={s.name}>
              <div>
                <strong>{s.name}</strong><br />
                Rounds: {s.rounds}<br /><br />

                <strong>Best Score:</strong> {s.bestScore}<br />
                <span className="muted">
                  {s.bestScoreCourse} — {s.bestScoreDate}
                </span><br /><br />

                <strong>Best Stableford:</strong> {s.bestPoints}<br />
                <span className="muted">
                  {s.bestPointsCourse} — {s.bestPointsDate}
                </span><br /><br />

                Current HC: {s.handicap.toFixed(1)}
              </div>
            </div>
          ))}
        </section>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

export default App;
