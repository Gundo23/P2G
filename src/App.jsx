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
  { name: "Abbeydale Golf Club", tee: "Yellow", par: 71, rating: 71.2, slope: 130 },
  { name: "Alwoodley Golf Club", tee: "Yellow", par: 72, rating: 73.0, slope: 138 },
  { name: "Ashton-under-Lyne Golf Club", tee: "Yellow", par: 70, rating: 69.8, slope: 126 },
  { name: "Astbury Golf Club", tee: "Yellow", par: 72, rating: 71.4, slope: 131 },
  { name: "Beeston Fields Golf Club", tee: "Yellow", par: 71, rating: 70.5, slope: 128 },
  { name: "Bingley St Ives Golf Club", tee: "Yellow", par: 69, rating: 69.1, slope: 122 },
  { name: "Birkdale Golf Club", tee: "Yellow", par: 71, rating: 70.9, slope: 132 },
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
  { name: "Crossland Heath Golf Club", tee: "Yellow", par: 70, rating: 70.1, slope: 127 },
  { name: "Dean Wood Golf Club", tee: "Yellow", par: 71, rating: 70.6, slope: 128 },
  { name: "Delamere Forest Golf Club", tee: "Yellow", par: 72, rating: 72.1, slope: 135 },
  { name: "Dewsbury District Golf Club", tee: "Yellow", par: 71, rating: 70.2, slope: 127 },
  { name: "Didsbury Golf Club", tee: "Yellow", par: 70, rating: 69.7, slope: 124 },
  { name: "Dore & Totley Golf Club", tee: "Yellow", par: 70, rating: 69.8, slope: 125 },
  { name: "Eaton Golf Club", tee: "Yellow", par: 71, rating: 70.5, slope: 128 },
  { name: "Ellesmere Port Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 130 },
  { name: "Fairhaven Golf Club", tee: "Yellow", par: 71, rating: 70.5, slope: 128 },
  { name: "Fixby Hall Golf Club", tee: "Yellow", par: 71, rating: 72.1, slope: 135 },
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
  { name: "Hillside Golf Club", tee: "Yellow", par: 72, rating: 72.7, slope: 137 },
  { name: "Hollinwell Golf Club", tee: "Yellow", par: 72, rating: 73.4, slope: 140 },
  { name: "Holywell Golf Club", tee: "Yellow", par: 69, rating: 68.8, slope: 120 },
  { name: "Huddersfield Golf Club", tee: "Yellow", par: 71, rating: 71.0, slope: 130 },
  { name: "Ilkley Golf Club", tee: "Yellow", par: 69, rating: 69.2, slope: 124 },
  { name: "Keighley Golf Club", tee: "Yellow", par: 70, rating: 69.3, slope: 122 },
  { name: "Lancaster Golf Club", tee: "Yellow", par: 71, rating: 70.4, slope: 127 },
  { name: "Leeds Golf Club", tee: "Yellow", par: 70, rating: 70.3, slope: 128 },
  { name: "Lightcliffe Golf Club", tee: "Yellow", par: 69, rating: 68.8, slope: 121 },
  { name: "Lindrick Golf Club", tee: "Yellow", par: 71, rating: 72.2, slope: 135 },
  { name: "Lymm Golf Club", tee: "Yellow", par: 71, rating: 69.8, slope: 124 },
  { name: "Maesdu Golf Club", tee: "Yellow", par: 70, rating: 69.7, slope: 124 },
  { name: "Manchester Golf Club", tee: "Yellow", par: 72, rating: 72.0, slope: 134 },
  { name: "Meltham Golf Club", tee: "Yellow", par: 71, rating: 70.5, slope: 128 },
  { name: "Moor Allerton Golf Club", tee: "Yellow", par: 71, rating: 70.9, slope: 129 },
  { name: "Moortown Golf Club", tee: "Yellow", par: 71, rating: 72.4, slope: 136 },
  { name: "Morecambe Golf Club", tee: "Yellow", par: 71, rating: 69.6, slope: 123 },
  { name: "Mold Golf Club", tee: "Yellow", par: 69, rating: 69.0, slope: 122 },
  { name: "Mottram Hall Golf Club", tee: "Yellow", par: 72, rating: 72.5, slope: 136 },
  { name: "North Wales Golf Club", tee: "Yellow", par: 71, rating: 71.2, slope: 131 },
  { name: "Northenden Golf Club", tee: "Yellow", par: 70, rating: 69.1, slope: 122 },
  { name: "Notts Golf Club", tee: "Yellow", par: 70, rating: 70.9, slope: 131 },
  { name: "Oakmere Park Golf Club", tee: "Yellow", par: 71, rating: 70.3, slope: 127 },
  { name: "Old Padeswood Golf Club", tee: "Yellow", par: 71, rating: 70.3, slope: 126 },
  { name: "Otley Golf Club", tee: "Yellow", par: 71, rating: 69.8, slope: 125 },
  { name: "Pannal Golf Club", tee: "Yellow", par: 70, rating: 70.8, slope: 130 },
  { name: "Penrith Golf Club", tee: "Yellow", par: 70, rating: 69.7, slope: 124 },
  { name: "Pennant Park Golf Club", tee: "Yellow", par: 71, rating: 70.9, slope: 129 },
  { name: "Prestatyn Golf Club", tee: "Yellow", par: 71, rating: 70.8, slope: 129 },
  { name: "Prestbury Golf Club", tee: "Yellow", par: 71, rating: 71.3, slope: 132 },
  { name: "Prenton Golf Club", tee: "Yellow", par: 71, rating: 69.9, slope: 124 },
  { name: "Ramsdale Park Golf Centre", tee: "Yellow", par: 72, rating: 71.1, slope: 130 },
  { name: "Retford Golf Club", tee: "Yellow", par: 70, rating: 69.9, slope: 124 },
  { name: "Rhuddlan Golf Club", tee: "Yellow", par: 69, rating: 68.9, slope: 121 },
  { name: "Ringway Golf Club", tee: "Yellow", par: 71, rating: 70.9, slope: 130 },
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
  { name: "St Annes Old Links", tee: "Yellow", par: 72, rating: 72.0, slope: 135 },
  { name: "Stockport Golf Club", tee: "Yellow", par: 71, rating: 70.6, slope: 129 },
  { name: "The Mere Golf Resort", tee: "Yellow", par: 71, rating: 71.6, slope: 134 },
  { name: "Upton-by-Chester Golf Club", tee: "Yellow", par: 71, rating: 70.1, slope: 125 },
  { name: "Vicars Cross Golf Club", tee: "Yellow", par: 71, rating: 69.7, slope: 123 },
  { name: "Wakefield Golf Club", tee: "Yellow", par: 70, rating: 69.7, slope: 124 },
  { name: "Wallasey Golf Club", tee: "Yellow", par: 72, rating: 71.5, slope: 133 },
  { name: "Warrington Golf Club", tee: "Yellow", par: 71, rating: 70.2, slope: 127 },
  { name: "West Lancashire Golf Club", tee: "Yellow", par: 72, rating: 72.4, slope: 136 },
  { name: "Wike Ridge Golf Club", tee: "Yellow", par: 72, rating: 71.6, slope: 133 },
  { name: "Wilmslow Golf Club", tee: "Yellow", par: 72, rating: 71.8, slope: 133 },
  { name: "Withington Golf Club", tee: "Yellow", par: 71, rating: 70.7, slope: 128 },
  { name: "Workington Golf Club", tee: "Yellow", par: 72, rating: 71.0, slope: 129 },
  { name: "Worsley Golf Club", tee: "Yellow", par: 70, rating: 69.4, slope: 123 }
];

const achievementOptions = [
  { key: "winner", label: "Competition Winner", icon: "🏆" },
  { key: "par", label: "Made a Par", icon: "✅" },
  { key: "birdie", label: "Made a Birdie", icon: "🐦" },
  { key: "broke100", label: "Broke 100", icon: "💯" },
  { key: "broke90", label: "Broke 90", icon: "9️⃣" },
  { key: "broke80", label: "Broke 80", icon: "8️⃣" },
  { key: "broke70", label: "Broke 70", icon: "🔥" },
  { key: "holeInOne", label: "Hole in One", icon: "🎯" },
];

function courseKey(course) {
  return `${course.name}__${course.tee}`;
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

function intelligentHandicap(player, allRounds, score, points, course) {
  const oldHandicap = Number(player.handicap);
  const diff = score ? round1(differential(score, course.rating, course.slope)) : "";
  const playerRounds = allRounds.filter((r) => r.player === player.name);
  const totalAfterThisRound = playerRounds.length + 1;

  if (totalAfterThisRound < 20 || !score) {
    return { newHandicap: currentSystem(oldHandicap, score, points, course), differential: diff, intelligenceUsed: false };
  }

  const last20 = [{ differential: diff }, ...playerRounds.filter((r) => r.differential !== "").slice(0, 19)];

  if (last20.length < 20) {
    return { newHandicap: currentSystem(oldHandicap, score, points, course), differential: diff, intelligenceUsed: false };
  }

  const best8 = last20.map((r) => Number(r.differential)).sort((a, b) => a - b).slice(0, 8);
  const average = best8.reduce((sum, n) => sum + n, 0) / 8;

  return { newHandicap: round1(average), differential: diff, intelligenceUsed: true };
}

function buildTrendPoints(rounds, playerName) {
  return rounds.filter((r) => r.player === playerName).slice().reverse().map((round, index) => ({
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
    const x = points.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (points.length - 1);
    const y = height - padding - ((point.handicap - min) / range) * (height - padding * 2);
    return { ...point, x, y };
  });

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" />
      <polyline fill="none" stroke="#0f172a" strokeWidth="3" points={plotted.map((p) => `${p.x},${p.y}`).join(" ")} />
      {plotted.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="5" fill="#0f172a" />
          <text x={p.x} y={p.y - 9} fontSize="10" textAnchor="middle">{p.handicap.toFixed(1)}</text>
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
  const [profilePlayer, setProfilePlayer] = useState(defaultPlayers[0].name);
  const [adminPlayer, setAdminPlayer] = useState(defaultPlayers[0].name);
  const [manualHandicap, setManualHandicap] = useState("");
  const [editPlayerName, setEditPlayerName] = useState(defaultPlayers[0].name);
  const [editedPlayerName, setEditedPlayerName] = useState("");
  const [editedPlayerHC, setEditedPlayerHC] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [galleryCaption, setGalleryCaption] = useState("");

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
    setPlayers(players.filter((p) => p.name !== playerName));
    addActivity(`${playerName} was removed`);
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
  function addRound() {
    const course = courses.find((c) => courseKey(c) === selectedCourse);
    const player = players.find((p) => p.name === selectedPlayer);
    if (!course || !player) return;

    const oldHandicap = Number(player.handicap);
    const adjustedScore = isNineHoles && score ? Number(score) * 2 : score;
    const adjustedPoints = isNineHoles && points ? Number(points) * 2 : points;

    const hcResult = intelligentHandicap(player, rounds, adjustedScore, adjustedPoints, course);
    const safeMerit = Math.max(0, Math.min(10, Number(meritPoints || 0)));

    const round = {
      player: selectedPlayer,
      course: course.name,
      tee: course.tee,
      oldHandicap,
      newHandicap: hcResult.newHandicap,
      differential: hcResult.differential,
      intelligenceUsed: hcResult.intelligenceUsed,
      score: score ? Number(score) : "",
      points: points ? Number(points) : "",
      holes: isNineHoles ? 9 : 18,
      meritPoints: safeMerit,
      didWin,
      rating: course.rating,
      slope: course.slope,
      par: course.par,
      date: new Date().toLocaleDateString(),
    };

    setRounds([round, ...rounds]);
    setPlayers(players.map((p) => (p.name === selectedPlayer ? { ...p, handicap: hcResult.newHandicap } : p)));

    let activityText = `${selectedPlayer} played ${course.name}`;
    if (score) activityText += ` and shot ${score}`;
    if (points) activityText += ` with ${points} Stableford points`;
    if (didWin) activityText += ` and won the comp 🏆`;
    addActivity(activityText);

    if (didWin) unlockBadge(selectedPlayer, "winner");

    setHistoryPlayer(selectedPlayer);
    setScore("");
    setPoints("");
    setMeritPoints("");
    setDidWin(false);
    setIsNineHoles(false);
    setPage("history");
    showToast(hcResult.intelligenceUsed ? "Round saved - HC Intelligence used" : "Round saved");
  }


  function recalculatePlayerAfterRoundChange(playerName, updatedRounds, originalRounds) {
    const originalPlayerRounds = originalRounds.filter((r) => r.player === playerName);
    const remainingPlayerRoundsNewest = updatedRounds.filter((r) => r.player === playerName);
    const remainingPlayerRoundsChronological = [...remainingPlayerRoundsNewest].reverse();

    if (originalPlayerRounds.length === 0) {
      return { recalculatedRounds: updatedRounds, recalculatedPlayers: players };
    }

    const originalChronological = [...originalPlayerRounds].reverse();
    let runningHandicap = Number(originalChronological[0].oldHandicap);

    const recalculatedChronological = [];
    let priorRecalculatedNewest = [];

    remainingPlayerRoundsChronological.forEach((round) => {
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
        priorRecalculatedNewest,
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

      recalculatedChronological.push(recalculatedRound);
      priorRecalculatedNewest = [recalculatedRound, ...priorRecalculatedNewest];
      runningHandicap = hcResult.newHandicap;
    });

    const recalculatedNewest = [...recalculatedChronological].reverse();
    const queue = [...recalculatedNewest];

    const recalculatedRounds = updatedRounds.map((round) => {
      if (round.player !== playerName) return round;
      return queue.shift();
    });

    const recalculatedPlayers = players.map((player) =>
      player.name === playerName
        ? { ...player, handicap: round1(runningHandicap) }
        : player
    );

    return { recalculatedRounds, recalculatedPlayers };
  }

  function deleteRound(indexToDelete) {
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


  function savePlayerProfileEdit() {
    if (!editedPlayerName) return;

    const oldName = editPlayerName;

    const updatedPlayers = players.map((p) =>
      p.name === oldName
        ? {
            ...p,
            name: editedPlayerName,
            handicap: editedPlayerHC
              ? Number(editedPlayerHC)
              : p.handicap,
          }
        : p
    );

    const updatedRounds = rounds.map((r) =>
      r.player === oldName
        ? { ...r, player: editedPlayerName }
        : r
    );

    const updatedPhotos = { ...photos };

    if (photos[oldName]) {
      updatedPhotos[editedPlayerName] = photos[oldName];
      delete updatedPhotos[oldName];
    }

    const updatedBadges = { ...badges };

    if (badges[oldName]) {
      updatedBadges[editedPlayerName] = badges[oldName];
      delete updatedBadges[oldName];
    }

    setPlayers(updatedPlayers);
    setRounds(updatedRounds);
    setPhotos(updatedPhotos);
    setBadges(updatedBadges);

    addActivity(
      `${oldName} profile updated to ${editedPlayerName}`
    );

    setEditPlayerName(editedPlayerName);
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

  function resetAll() {
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
  const selectedCourseDetails = courses.find((c) => courseKey(c) === selectedCourse) || courses[0];
  const historyRounds = rounds.filter((r) => r.player === historyPlayer);
  const trendPoints = buildTrendPoints(rounds, historyPlayer);
  const profileDetails = players.find((p) => p.name === profilePlayer) || players[0];

  const meritTable = players.map((p) => {
    const playerRounds = rounds.filter((r) => r.player === p.name);
    return { name: p.name, total: playerRounds.reduce((sum, r) => sum + Number(r.meritPoints || 0), 0), rounds: playerRounds.length };
  }).sort((a, b) => b.total - a.total).slice(0, 10);

  const playerStats = players.map((player) => {
    const playerRounds = rounds.filter((r) => r.player === player.name);

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
    const playerRounds = rounds.filter((r) => r.player === player.name);
    const scores = playerRounds.map((r) => Number(r.score)).filter(Boolean);
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
      <section className="hero">
        <h1>P2G<br />Golf Society</h1>
        <p>PG2 Golf handicap tracker</p>
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
            <button className="tile" onClick={() => setPage("add-round")}>
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
          <button onClick={resetAll}>Reset All</button>
          {sorted.map((p, i) => (
            <div className="player-card profile-card" key={p.name}>
              <div className="profile-left">
                {photos[p.name] ? <img className="avatar-img" src={photos[p.name]} /> : <div className="avatar">{p.name.charAt(0)}</div>}
                <div><strong>{i + 1}. {p.name}</strong><br />Handicap {p.handicap.toFixed(1)}<BadgeList badges={badges[p.name]} /></div>
              </div>
              <button onClick={() => removePlayer(p.name)}>Remove</button>
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
          <select value={profilePlayer} onChange={(e) => setProfilePlayer(e.target.value)}>
            {players.map((p) => <option key={p.name}>{p.name}</option>)}
          </select>
          {profileDetails && (
            <div className="profile-page-card">
              {photos[profileDetails.name] ? <img className="profile-photo" src={photos[profileDetails.name]} /> : <div className="profile-photo-placeholder">{profileDetails.name.charAt(0)}</div>}
              <h2>{profileDetails.name}</h2>
              <p>Current HC: {profileDetails.handicap.toFixed(1)}</p>
              <input type="file" accept="image/*" onChange={uploadPhoto} />
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
                {players.map((p) => <option key={p.name}>{p.name}</option>)}
              </select>
              <input placeholder="New handicap" type="number" step="0.1" value={manualHandicap} onChange={(e) => setManualHandicap(e.target.value)} />
              <button onClick={updateManualHandicap}>Update Handicap</button>
              <button onClick={backupToCloud}>☁️ Backup to Cloud</button>
              <button onClick={restoreCloudData}>☁️ Restore from Cloud</button>
              <button onClick={importDefaultCourses}>⛳ Import Default Courses</button>

              <h3>Edit Player Profile</h3>

              <select
                value={editPlayerName}
                onChange={(e) => setEditPlayerName(e.target.value)}
              >
                {players.map((p) => (
                  <option key={p.name}>{p.name}</option>
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
                  v5.4 Dynamic HC Recalc
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
          <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
            {players.map((p) => <option key={p.name}>{p.name}</option>)}
          </select>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            {[...courses].sort((a, b) => a.name.localeCompare(b.name)).map((c, i) => (
              <option key={i} value={courseKey(c)}>{c.name} - {c.tee} tees</option>
            ))}
          </select>
          <div className="player-card">
            <div><strong>{selectedCourseDetails.name}</strong><br />{selectedCourseDetails.tee} | Par {selectedCourseDetails.par} | Rating {selectedCourseDetails.rating} | Slope {selectedCourseDetails.slope}</div>
          </div>
          <input placeholder="Gross score" type="number" value={score} onChange={(e) => setScore(e.target.value)} />
          <input placeholder="Stableford points" type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
          <input placeholder="Order of Merit points 0-10" type="number" min="0" max="10" value={meritPoints} onChange={(e) => setMeritPoints(e.target.value)} />
          <label className="check-row">
            <input type="checkbox" checked={isNineHoles} onChange={(e) => setIsNineHoles(e.target.checked)} />
            Only 9 holes played?
          </label>

          <label className="check-row">
            <input type="checkbox" checked={didWin} onChange={(e) => setDidWin(e.target.checked)} />
            Did this player win?
          </label>
          <button onClick={addRound}>Add Round & Update Handicap</button>
        </section>
      )}

      {page === "history" && (
        <section>
          <h2>Player History</h2>
          <select value={historyPlayer} onChange={(e) => setHistoryPlayer(e.target.value)}>
            {players.map((p) => <option key={p.name}>{p.name}</option>)}
          </select>
          <h3>Handicap Trend</h3>
          <TrendGraph points={trendPoints} />
          <h3>Rounds</h3>
          {historyRounds.length === 0 && <p>No rounds for this player yet.</p>}
          {historyRounds.map((r, i) => (
            <div className="player-card" key={i}>
              <div><strong>{r.date}</strong><br />{r.course} - {r.tee}<br />{r.holes || 18} Holes<br />Score {r.score || "-"} | Points {r.points || "-"} | Merit {r.meritPoints || 0}<br />{r.didWin ? "Winner 🏆" : ""}<br />HC {r.oldHandicap.toFixed(1)} → {r.newHandicap.toFixed(1)}<br />{r.intelligenceUsed ? "HC Intelligence used" : "Current system"}</div>
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
