import { useEffect, useState } from "react";

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
  { name: "Wirral Golf Club", tee: "Yellow", par: 68, rating: 65.5, slope: 124 },
  { name: "Bidston Golf Club", tee: "Yellow", par: 70, rating: 69.1, slope: 127 },
  { name: "Bidston Golf Club", tee: "White", par: 70, rating: 70.5, slope: 132 },
  { name: "Ellesmere Port Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 130 },
  { name: "Arrowe Park Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 124 },
  { name: "Pryors Hayes Golf Club", tee: "Yellow", par: 69, rating: 67.9, slope: 121 },
  { name: "Pennant Park Golf Club", tee: "Yellow", par: 70, rating: 68.0, slope: 117 },
  { name: "Hill Valley - Sapphire", tee: "Yellow", par: 72, rating: 70.8, slope: 129 },
  { name: "Caldy Golf Club", tee: "Yellow", par: 72, rating: 71.6, slope: 131 },
  { name: "Wallasey Golf Club", tee: "Yellow", par: 72, rating: 71.9, slope: 132 },
  { name: "Leasowe Golf Club", tee: "Yellow", par: 71, rating: 70.1, slope: 131 },
  { name: "Ellesmere Port Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 130 },
  { name: "Bidston Golf Club", tee: "Yellow", par: 70, rating: 69.1, slope: 127 },
  { name: "Bromborough Golf Club", tee: "Yellow", par: 72, rating: 71.5, slope: 137 },
  { name: "Caldy Golf Club", tee: "Yellow", par: 72, rating: 71.6, slope: 131 },
  { name: "Wallasey Golf Club", tee: "Yellow", par: 72, rating: 71.9, slope: 132 },
  { name: "Leasowe Golf Club", tee: "Yellow", par: 71, rating: 70.1, slope: 131 },
  { name: "Formby Golf Club", tee: "Yellow", par: 72, rating: 73.4, slope: 136 },
  { name: "Lee Park Golf Club", tee: "Yellow", par: 70, rating: 67.6, slope: 121 },
  { name: "Grange Park Golf Club", tee: "Yellow", par: 72, rating: 70.6, slope: 121 },
  { name: "North Wales Golf Club", tee: "Yellow", par: 71, rating: 68.7, slope: 121 },
  { name: "Carden Park Country Club", tee: "Yellow", par: 72, rating: 71.6, slope: 133 },
  { name: "Upton-by-Chester Golf Club", tee: "Yellow", par: 69, rating: 68.5, slope: 122 },
  { name: "Crewe Golf Club", tee: "Yellow", par: 71, rating: 70.8, slope: 127 },
  { name: "Sandbach Golf Club", tee: "Yellow", par: 68, rating: 66.9, slope: 117 },
  { name: "Macclesfield Golf Club", tee: "Yellow", par: 71, rating: 69.8, slope: 135 },
  { name: "Astbury Golf Club", tee: "Yellow", par: 71, rating: 70.3, slope: 130 },
  { name: "Onneley Golf Club", tee: "Yellow", par: 71, rating: 67.0, slope: 116 },
  { name: "Poulton Park Golf Club", tee: "Yellow", par: 69, rating: 67.6, slope: 127 },
  { name: "Ashton-on-Mersey Golf Club", tee: "Yellow", par: 71, rating: 70.1, slope: 129 },
  { name: "Worsley Golf Club", tee: "Yellow", par: 71, rating: 69.8, slope: 128 },
  { name: "Manchester Golf Club", tee: "Yellow", par: 72, rating: 71.4, slope: 128 },
  { name: "Marple Golf Club", tee: "Yellow", par: 67, rating: 66.8, slope: 119 },
  { name: "Towneley Golf Club", tee: "Yellow", par: 70, rating: 67.8, slope: 119 },
  { name: "Grange-over-Sands Golf Club", tee: "Yellow", par: 70, rating: 68.7, slope: 126 },
  { name: "St Bees Golf Club", tee: "Yellow", par: 66, rating: 65.7, slope: 109 },
];

function round1(value) {
  return Math.round(Number(value) * 10) / 10;
}

function calculateDifferential(score, rating, slope) {
  return ((Number(score) - Number(rating)) * 113) / Number(slope);
}

function calculateNewHandicap(oldHandicap, score, points, course) {
  let roundLevel = Number(oldHandicap);

  if (points) {
    roundLevel = Number(oldHandicap) + (36 - Number(points));
  } else if (score) {
    roundLevel = calculateDifferential(score, course.rating, course.slope);
  }

  return round1((Number(oldHandicap) + Number(roundLevel)) / 2);
}

function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("golfPlayers");
    return saved ? JSON.parse(saved) : defaultPlayers;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("golfCourses");
    return saved ? JSON.parse(saved) : defaultCourses;
  });

  const [rounds, setRounds] = useState(() => {
    const saved = localStorage.getItem("golfRounds");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState("");

  const [selectedPlayer, setSelectedPlayer] = useState(defaultPlayers[0].name);
  const [selectedCourse, setSelectedCourse] = useState(defaultCourses[0].name);
  const [score, setScore] = useState("");
  const [points, setPoints] = useState("");

  const [courseName, setCourseName] = useState("");
  const [courseTee, setCourseTee] = useState("");
  const [coursePar, setCoursePar] = useState("");
  const [courseRating, setCourseRating] = useState("");
  const [courseSlope, setCourseSlope] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("golfPlayers", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("golfCourses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("golfRounds", JSON.stringify(rounds));
  }, [rounds]);

  function addPlayer() {
    if (!name || !handicap) return;

    setPlayers([...players, { name, handicap: Number(handicap) }]);
    setName("");
    setHandicap("");
  }

  function removePlayer(playerName) {
    setPlayers(players.filter((p) => p.name !== playerName));
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

    setCourseName("");
    setCourseTee("");
    setCoursePar("");
    setCourseRating("");
    setCourseSlope("");
  }

  function addRound() {
    if (!selectedPlayer || !selectedCourse) return;

    const course = courses.find((c) => c.name === selectedCourse);
    const player = players.find((p) => p.name === selectedPlayer);

    if (!course || !player) return;

    const oldHandicap = Number(player.handicap);
    const newHandicap = calculateNewHandicap(oldHandicap, score, points, course);

    const round = {
      player: selectedPlayer,
      course: selectedCourse,
      oldHandicap,
      newHandicap,
      score: score ? Number(score) : "",
      points: points ? Number(points) : "",
      rating: course.rating,
      slope: course.slope,
      par: course.par,
      date: new Date().toLocaleDateString(),
    };

    setRounds([round, ...rounds]);

    setPlayers(
      players.map((p) =>
        p.name === selectedPlayer ? { ...p, handicap: newHandicap } : p
      )
    );

    setScore("");
    setPoints("");
  }

  function resetAll() {
    localStorage.clear();
    setPlayers(defaultPlayers);
    setCourses(defaultCourses);
    setRounds([]);
  }

  const sorted = [...players].sort((a, b) => a.handicap - b.handicap);

  const filteredCourses = courses.filter((c) =>
    `${c.name} ${c.tee}`.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <main>
      <section>
        <h1>Golf Handicap League</h1>
        <p>Player handicap tracker</p>
      </section>

      <section>
        <h2>Add Player</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="HC"
          type="number"
          value={handicap}
          onChange={(e) => setHandicap(e.target.value)}
        />

        <button onClick={addPlayer}>Add Player</button>
      </section>

      <section>
        <h2>Add Round</h2>

        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
        >
          {players.map((p) => (
            <option key={p.name}>{p.name}</option>
          ))}
        </select>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {courses.map((c, index) => (
            <option key={index} value={c.name}>
              {c.name} - {c.tee}
            </option>
          ))}
        </select>

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

        <button onClick={addRound}>Add Round & Update Handicap</button>
      </section>

      <section>
        <h2>Standings</h2>

        <button onClick={resetAll}>Reset All</button>

        {sorted.map((p, index) => (
          <div className="player-card" key={p.name}>
            <div>
              <strong>
                {index + 1}. {p.name}
              </strong>
              <br />
              Handicap {p.handicap.toFixed(1)}
            </div>

            <button onClick={() => removePlayer(p.name)}>Remove</button>
          </div>
        ))}
      </section>

      <section>
        <h2>Courses</h2>

        <input
          placeholder="Search course"
          value={courseSearch}
          onChange={(e) => setCourseSearch(e.target.value)}
        />

        <h3>Add Course</h3>

        <input
          placeholder="Course name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <input
          placeholder="Tee colour"
          value={courseTee}
          onChange={(e) => setCourseTee(e.target.value)}
        />

        <input
          placeholder="Par"
          type="number"
          value={coursePar}
          onChange={(e) => setCoursePar(e.target.value)}
        />

        <input
          placeholder="Course rating"
          type="number"
          step="0.1"
          value={courseRating}
          onChange={(e) => setCourseRating(e.target.value)}
        />

        <input
          placeholder="Slope"
          type="number"
          value={courseSlope}
          onChange={(e) => setCourseSlope(e.target.value)}
        />

        <button onClick={addCourse}>Add Course</button>

        {filteredCourses.map((c, index) => (
          <div className="player-card" key={index}>
            <div>
              <strong>{c.name}</strong>
              <br />
              {c.tee} tees | Par {c.par} | Rating {c.rating} | Slope {c.slope}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2>Recent Rounds</h2>

        {rounds.length === 0 && <p>No rounds added yet.</p>}

        {rounds.map((r, index) => (
          <div className="player-card" key={index}>
            <div>
              <strong>{r.player}</strong>
              <br />
              {r.course} | Score {r.score || "-"} | Points {r.points || "-"}
              <br />
              HC {r.oldHandicap.toFixed(1)} → {r.newHandicap.toFixed(1)}
              <br />
              Rating {r.rating} | Slope {r.slope}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;
