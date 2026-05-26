import { useEffect, useState } from "react";

const APP_USER = "pg2";
const APP_PASS = "golf2026";

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
  { name: "Ellesmere Port Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 130 },
  { name: "Bidston Golf Club", tee: "Yellow", par: 70, rating: 69.1, slope: 127 },
  { name: "Bidston Golf Club", tee: "White", par: 70, rating: 70.5, slope: 132 },
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

function courseKey(course) {
  return `${course.name}__${course.tee}`;
}

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

function buildTrendPoints(rounds, playerName) {
  return rounds
    .filter((r) => r.player === playerName)
    .slice()
    .reverse()
    .map((round, index) => ({
      label: index + 1,
      handicap: Number(round.newHandicap),
    }));
}

function TrendGraph({ points }) {
  if (!points.length) return <p>No handicap trend yet.</p>;

  const width = 320;
  const height = 160;
  const padding = 28;
  const values = points.map((p) => p.handicap);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const plotted = points.map((point, index) => {
    const x =
      points.length === 1
        ? width / 2
        : padding + (index * (width - padding * 2)) / (points.length - 1);

    const y =
      height -
      padding -
      ((point.handicap - min) / range) * (height - padding * 2);

    return { ...point, x, y };
  });

  const polyline = plotted.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" />
      <polyline fill="none" stroke="#0f172a" strokeWidth="3" points={polyline} />
      {plotted.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="5" fill="#0f172a" />
          <text x={p.x} y={p.y - 9} fontSize="10" textAnchor="middle">
            {p.handicap.toFixed(1)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PlayerProfileCard({ player, rounds, rank, onRemove }) {
  const playerRounds = rounds.filter((r) => r.player === player.name);

  return (
    <div className="player-card profile-card">
      <div className="profile-left">
        <div className="avatar">
          {player.name.charAt(0)}
        </div>

        <div>
          <strong>{rank}. {player.name}</strong>
          <br />
          Handicap {player.handicap.toFixed(1)}
          <br />
          <span className="muted">
            Rounds: {playerRounds.length}
          </span>
        </div>
      </div>

      <button onClick={() => onRemove(player.name)}>Remove</button>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("pg2-auth") === "true");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [page, setPage] = useState("home");

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
  const [selectedCourse, setSelectedCourse] = useState(courseKey(defaultCourses[0]));
  const [score, setScore] = useState("");
  const [points, setPoints] = useState("");

  const [courseName, setCourseName] = useState("");
  const [courseTee, setCourseTee] = useState("");
  const [coursePar, setCoursePar] = useState("");
  const [courseRating, setCourseRating] = useState("");
  const [courseSlope, setCourseSlope] = useState("");

  const [historyPlayer, setHistoryPlayer] = useState(defaultPlayers[0].name);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("golfPlayers", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("golfCourses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("golfRounds", JSON.stringify(rounds));
  }, [rounds]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function login() {
    if (username.toLowerCase() === APP_USER && password === APP_PASS) {
      localStorage.setItem("pg2-auth", "true");
      setLoggedIn(true);
      setUsername("");
      setPassword("");
      showToast("Logged in");
    } else {
      alert("Incorrect login");
    }
  }

  function logout() {
    localStorage.removeItem("pg2-auth");
    setLoggedIn(false);
  }

  function addPlayer() {
    if (!name || !handicap) return;
    setPlayers([...players, { name, handicap: Number(handicap) }]);
    setSelectedPlayer(name);
    setHistoryPlayer(name);
    setName("");
    setHandicap("");
    setPage("standings");
    showToast("Player added");
  }

  function removePlayer(playerName) {
    setPlayers(players.filter((p) => p.name !== playerName));
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

    setCourseName("");
    setCourseTee("");
    setCoursePar("");
    setCourseRating("");
    setCourseSlope("");
    setPage("add-round");
    showToast("Course added");
  }

  function addRound() {
    if (!selectedPlayer || !selectedCourse) return;

    const course = courses.find((c) => courseKey(c) === selectedCourse);
    const player = players.find((p) => p.name === selectedPlayer);
    if (!course || !player) return;

    const oldHandicap = Number(player.handicap);
    const newHandicap = calculateNewHandicap(oldHandicap, score, points, course);

    const round = {
      player: selectedPlayer,
      course: course.name,
      tee: course.tee,
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
    setPlayers(players.map((p) => (p.name === selectedPlayer ? { ...p, handicap: newHandicap } : p)));
    setHistoryPlayer(selectedPlayer);
    setScore("");
    setPoints("");
    setPage("history");
    showToast("Round saved");
  }

  function resetAll() {
    localStorage.clear();
    setPlayers(defaultPlayers);
    setCourses(defaultCourses);
    setRounds([]);
    setSelectedPlayer(defaultPlayers[0].name);
    setSelectedCourse(courseKey(defaultCourses[0]));
    setHistoryPlayer(defaultPlayers[0].name);
    setLoggedIn(true);
    localStorage.setItem("pg2-auth", "true");
    showToast("Data reset");
  }

  const sorted = [...players].sort((a, b) => a.handicap - b.handicap);
  const selectedCourseDetails = courses.find((c) => courseKey(c) === selectedCourse) || courses[0];
  const historyRounds = rounds.filter((r) => r.player === historyPlayer);
  const trendPoints = buildTrendPoints(rounds, historyPlayer);

  const playerStats = players.map((player) => {
    const playerRounds = rounds.filter((r) => r.player === player.name);
    const scores = playerRounds.map((r) => Number(r.score)).filter(Boolean);
    const stableford = playerRounds.map((r) => Number(r.points)).filter(Boolean);

    return {
      name: player.name,
      rounds: playerRounds.length,
      bestScore: scores.length ? Math.min(...scores) : "-",
      bestPoints: stableford.length ? Math.max(...stableford) : "-",
      handicap: player.handicap,
    };
  });

  if (loading) {
    return (
      <main>
        <section className="splash">
          <div className="splash-icon">⛳</div>
          <h1>P2G</h1>
          <p>Pitch to Green Golf Society</p>
          <div className="loading-bar">
            <div />
          </div>
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

          <p style={{ fontSize: "12px", opacity: 0.65 }}>
            Username: pg2 | Password: golf2026
          </p>
        </section>

        {toast && <div className="toast">{toast}</div>}
      </main>
    );
  }

  return (
    <main>
      <section className="hero">
        <h1>
          P2G
          <br />
          Golf Society
        </h1>

        <p>PG2 Golf handicap tracker</p>

        <div className="top-buttons">
          <button className="home-btn" onClick={() => setPage("home")}>
            Home
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </section>

      {page === "home" && (
        <section>
          <h2>Home</h2>

          <div className="tile-grid">
            <button className="tile" onClick={() => setPage("standings")}>HC List</button>
            <button className="tile" onClick={() => setPage("add-player")}>Add Player</button>
            <button className="tile" onClick={() => setPage("add-round")}>Add Round</button>
            <button className="tile" onClick={() => setPage("history")}>Player History</button>
            <button className="tile" onClick={() => setPage("add-course")}>Add Course</button>
            <button className="tile" onClick={() => setPage("stats")}>Player Stats</button>
          </div>
        </section>
      )}

      {page === "standings" && (
        <section>
          <h2>HC List</h2>
          <button onClick={resetAll}>Reset All</button>

          {sorted.map((p, index) => (
            <PlayerProfileCard
              key={p.name}
              player={p}
              rounds={rounds}
              rank={index + 1}
              onRemove={removePlayer}
            />
          ))}
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

          <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
            {players.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>

          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            {courses.map((c, index) => (
              <option key={index} value={courseKey(c)}>{c.name} - {c.tee} tees</option>
            ))}
          </select>

          {selectedCourseDetails && (
            <div className="player-card">
              <div>
                <strong>{selectedCourseDetails.name}</strong>
                <br />
                {selectedCourseDetails.tee} tees | Par {selectedCourseDetails.par} | Rating {selectedCourseDetails.rating} | Slope {selectedCourseDetails.slope}
              </div>
            </div>
          )}

          <input placeholder="Gross score" type="number" value={score} onChange={(e) => setScore(e.target.value)} />
          <input placeholder="Stableford points" type="number" value={points} onChange={(e) => setPoints(e.target.value)} />

          <button onClick={addRound}>Add Round & Update Handicap</button>
        </section>
      )}

      {page === "history" && (
        <section>
          <h2>Player History</h2>

          <select value={historyPlayer} onChange={(e) => setHistoryPlayer(e.target.value)}>
            {players.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>

          <h3>Handicap Trend</h3>
          <TrendGraph points={trendPoints} />

          <h3>Rounds</h3>
          {historyRounds.length === 0 && <p>No rounds for this player yet.</p>}

          {historyRounds.map((r, index) => (
            <div className="player-card" key={index}>
              <div>
                <strong>{r.date}</strong>
                <br />
                {r.course} - {r.tee} tees
                <br />
                Score {r.score || "-"} | Points {r.points || "-"}
                <br />
                HC {r.oldHandicap.toFixed(1)} → {r.newHandicap.toFixed(1)}
              </div>
            </div>
          ))}
        </section>
      )}

      {page === "add-course" && (
        <section>
          <h2>Add Course</h2>
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

          {playerStats.map((stat) => (
            <div className="player-card profile-card" key={stat.name}>
              <div className="profile-left">
                <div className="avatar">
                  {stat.name.charAt(0)}
                </div>

                <div>
                  <strong>{stat.name}</strong>
                  <br />
                  Rounds: {stat.rounds}
                  <br />
                  Best Score: {stat.bestScore}
                  <br />
                  Best Stableford: {stat.bestPoints}
                  <br />
                  Current HC: {stat.handicap.toFixed(1)}
                </div>
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
