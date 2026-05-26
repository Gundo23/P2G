import React, { useMemo, useState } from 'react';

import { Trophy, Plus, Trash2, RotateCcw, Flag, Users, Search, Database, Smartphone } from 'lucide-react';
import './style.css';

const STORAGE_KEY = 'golf-handicap-league-v1';

const starterPlayers = [
  { id: 'p1', name: 'Dave Ince', handicap: 13.4 },
  { id: 'p2', name: 'Lewis Jones', handicap: 14.9 },
  { id: 'p3', name: 'Sam Turner', handicap: 16.7 },
  { id: 'p4', name: 'Paul Davies', handicap: 17.7 },
  { id: 'p5', name: 'Ray McDonald', handicap: 18.6 },
  { id: 'p6', name: 'Franno', handicap: 19.5 },
  { id: 'p7', name: 'Rob Boon', handicap: 21.1 },
  { id: 'p8', name: 'Gary K', handicap: 21.1 },
  { id: 'p9', name: 'James', handicap: 26.5 },
  { id: 'p10', name: 'Dave Lloyd', handicap: 29.0 },
  { id: 'p11', name: 'Colin', handicap: 35.9 },
  { id: 'p12', name: 'Jack', handicap: 44.1 },
];

const starterCourses = [
  { id: 'c1', name: 'Wirral Golf Club', area: 'Wirral', tee: 'Yellow', par: 68, rating: 65.5, slope: 124 },
  { id: 'c2', name: 'Bidston Golf Club', area: 'Wirral', tee: 'Yellow', par: 70, rating: 69.1, slope: 127 },
  { id: 'c3', name: 'Bidston Golf Club', area: 'Wirral', tee: 'White', par: 70, rating: 70.5, slope: 132 },
  { id: 'c4', name: 'Ellesmere Port Golf Club', area: 'Cheshire', tee: 'Yellow', par: 70, rating: 69.4, slope: 130 },
  { id: 'c5', name: 'Arrowe Park Golf Club', area: 'Wirral', tee: 'Yellow', par: 70, rating: 69.4, slope: 124 },
  { id: 'c6', name: 'Pryors Hayes Golf Club', area: 'Cheshire', tee: 'Yellow', par: 69, rating: 67.9, slope: 121 },
  { id: 'c7', name: 'Pennant Park Golf Club', area: 'Flintshire', tee: 'Yellow', par: 70, rating: 68.0, slope: 117 },
  { id: 'c8', name: 'Hill Valley - Sapphire Course', area: 'Shropshire', tee: 'Yellow', par: 72, rating: 70.8, slope: 129 },
  { id: 'c9', name: 'Caldy Golf Club', area: 'Wirral', tee: 'Yellow', par: 72, rating: 71.6, slope: 131 },
  { id: 'c10', name: 'Wallasey Golf Club', area: 'Wirral', tee: 'Yellow', par: 72, rating: 71.9, slope: 132 },
  { id: 'c11', name: 'Leasowe Golf Club', area: 'Wirral', tee: 'Yellow', par: 71, rating: 70.1, slope: 131 },
];

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.warn('Could not load saved data', error);
  }
  return { players: starterPlayers, courses: starterCourses, rounds: [] };
}

function round1(value) {
  return Math.round(Number(value) * 10) / 10;
}

function scoreDifferential(score, course) {
  return ((Number(score) - Number(course.rating)) * 113) / Number(course.slope);
}

function blendStableford(oldHandicap, points) {
  const roundLevel = Number(oldHandicap) + (36 - Number(points));
  return (Number(oldHandicap) + roundLevel) / 2;
}

function blendGross(oldHandicap, differential) {
  return (Number(oldHandicap) + Number(differential)) / 2;
}

function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState('score');
  const [selectedPlayerId, setSelectedPlayerId] = useState(state.players[0]?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState(state.courses[0]?.id || '');
  const [entryType, setEntryType] = useState('stableford');
  const [scoreValue, setScoreValue] = useState('');
  const [holes, setHoles] = useState('18');
  const [courseSearch, setCourseSearch] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerHandicap, setPlayerHandicap] = useState('');
  const [manualCourse, setManualCourse] = useState({ name: '', area: '', tee: 'Yellow', par: '', rating: '', slope: '' });

  function updateState(nextOrFn) {
    setState((current) => {
      const next = typeof nextOrFn === 'function' ? nextOrFn(current) : nextOrFn;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const filteredCourses = useMemo(() => {
    const term = courseSearch.toLowerCase().trim();
    if (!term) return state.courses.slice(0, 8);
    return state.courses.filter((c) => `${c.name} ${c.area} ${c.tee}`.toLowerCase().includes(term)).slice(0, 20);
  }, [courseSearch, state.courses]);

  const currentHandicaps = useMemo(() => {
    const map = new Map(state.players.map((p) => [p.id, Number(p.handicap)]));

    for (const round of [...state.rounds].reverse()) {
      const oldHandicap = map.get(round.playerId);
      if (oldHandicap == null) continue;

      let nextHandicap = oldHandicap;
      if (round.type === 'stableford') {
        nextHandicap = blendStableford(oldHandicap, round.points);
      } else {
        const course = state.courses.find((c) => c.id === round.courseId);
        if (!course) continue;
        const adjustedScore = round.holes === 9 ? Number(round.score) * 2 : Number(round.score);
        nextHandicap = blendGross(oldHandicap, scoreDifferential(adjustedScore, course));
      }
      map.set(round.playerId, round1(nextHandicap));
    }

    return state.players
      .map((p) => ({ ...p, currentHandicap: round1(map.get(p.id) ?? p.handicap) }))
      .sort((a, b) => a.currentHandicap - b.currentHandicap || a.name.localeCompare(b.name));
  }, [state]);

  const selectedCourse = state.courses.find((c) => c.id === selectedCourseId);
  const playerById = new Map(state.players.map((p) => [p.id, p]));
  const courseById = new Map(state.courses.map((c) => [c.id, c]));

  function addRound() {
    if (!selectedPlayerId || scoreValue === '') return;
    const round = {
      id: crypto.randomUUID(),
      playerId: selectedPlayerId,
      courseId: selectedCourseId,
      type: entryType,
      holes: Number(holes),
      score: entryType === 'gross' ? Number(scoreValue) : null,
      points: entryType === 'stableford' ? Number(scoreValue) : null,
      createdAt: new Date().toISOString(),
    };
    updateState((s) => ({ ...s, rounds: [round, ...s.rounds] }));
    setScoreValue('');
  }

  function addPlayer() {
    if (!playerName.trim() || playerHandicap === '') return;
    const next = { id: crypto.randomUUID(), name: playerName.trim(), handicap: Number(playerHandicap) };
    updateState((s) => ({ ...s, players: [...s.players, next] }));
    setSelectedPlayerId(next.id);
    setPlayerName('');
    setPlayerHandicap('');
  }

  function addManualCourse() {
    if (!manualCourse.name.trim() || !manualCourse.rating || !manualCourse.slope) return;
    const next = {
      id: crypto.randomUUID(),
      name: manualCourse.name.trim(),
      area: manualCourse.area.trim() || 'Custom',
      tee: manualCourse.tee.trim() || 'Yellow',
      par: Number(manualCourse.par || 72),
      rating: Number(manualCourse.rating),
      slope: Number(manualCourse.slope),
    };
    updateState((s) => ({ ...s, courses: [...s.courses, next] }));
    setSelectedCourseId(next.id);
    setManualCourse({ name: '', area: '', tee: 'Yellow', par: '', rating: '', slope: '' });
  }

  return (
    <main className="page">
      <section className="hero card">
        <div>
          <div className="pill"><Smartphone size={16} /> Pin-to-home-screen web app</div>
          <h1>Golf Handicap League</h1>
          <p>Enter Stableford points or gross scores and the handicap table updates instantly.</p>
        </div>
        <button className="secondary" onClick={() => updateState((s) => ({ ...s, rounds: [] }))}><RotateCcw size={16} /> Clear new rounds</button>
      </section>

      <nav className="tabs card">
        <button className={tab === 'score' ? 'active' : ''} onClick={() => setTab('score')}>Enter score</button>
        <button className={tab === 'courses' ? 'active' : ''} onClick={() => setTab('courses')}>Courses</button>
        <button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>Players</button>
      </nav>

      <section className="grid">
        <div className="card standings">
          <h2><Trophy size={20} /> Current standings</h2>
          <table>
            <thead><tr><th>#</th><th>Player</th><th>HC</th></tr></thead>
            <tbody>
              {currentHandicaps.map((player, index) => (
                <tr key={player.id}><td>{index + 1}</td><td>{player.name}</td><td className="hc">{player.currentHandicap.toFixed(1)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {tab === 'score' && <div className="card form">
          <h2><Flag size={20} /> Enter a result</h2>
          <label>Player</label>
          <select value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(e.target.value)}>{state.players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <label>Result type</label>
          <select value={entryType} onChange={(e) => setEntryType(e.target.value)}><option value="stableford">Stableford points</option><option value="gross">Gross score</option></select>
          {entryType === 'gross' && <>
            <label>Search course</label>
            <input placeholder="e.g. Wirral" value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} />
            <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>{filteredCourses.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.tee}</option>)}</select>
            {selectedCourse && <div className="course-chip"><strong>{selectedCourse.name} — {selectedCourse.tee}</strong><span>Par {selectedCourse.par} • Rating {selectedCourse.rating} • Slope {selectedCourse.slope}</span></div>}
            <label>Holes</label>
            <select value={holes} onChange={(e) => setHoles(e.target.value)}><option value="18">18 holes</option><option value="9">9 holes</option></select>
          </>}
          <label>{entryType === 'stableford' ? 'Stableford points' : 'Gross score'}</label>
          <input type="number" placeholder={entryType === 'stableford' ? 'e.g. 34' : 'e.g. 91'} value={scoreValue} onChange={(e) => setScoreValue(e.target.value)} />
          <button onClick={addRound}><Plus size={16} /> Add result</button>
        </div>}

        {tab === 'courses' && <div className="card form">
          <h2><Database size={20} /> Course database</h2>
          <label>Search courses</label>
          <div className="search"><Search size={16} /><input placeholder="Search England & Wales courses" value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} /></div>
          <div className="course-list">{filteredCourses.map((course) => <button key={course.id} className="course-card" onClick={() => { setSelectedCourseId(course.id); setEntryType('gross'); setTab('score'); }}><strong>{course.name}</strong><span>{course.area} • {course.tee}</span><small>Par {course.par} | Rating {course.rating} | Slope {course.slope}</small></button>)}</div>
          <h3>Course missing? Add it</h3>
          <input placeholder="Course name" value={manualCourse.name} onChange={(e) => setManualCourse({ ...manualCourse, name: e.target.value })} />
          <input placeholder="Area" value={manualCourse.area} onChange={(e) => setManualCourse({ ...manualCourse, area: e.target.value })} />
          <div className="mini-grid"><input placeholder="Tee" value={manualCourse.tee} onChange={(e) => setManualCourse({ ...manualCourse, tee: e.target.value })} /><input type="number" placeholder="Par" value={manualCourse.par} onChange={(e) => setManualCourse({ ...manualCourse, par: e.target.value })} /><input type="number" placeholder="Rating" value={manualCourse.rating} onChange={(e) => setManualCourse({ ...manualCourse, rating: e.target.value })} /><input type="number" placeholder="Slope" value={manualCourse.slope} onChange={(e) => setManualCourse({ ...manualCourse, slope: e.target.value })} /></div>
          <button onClick={addManualCourse}>Save course</button>
        </div>}

        {tab === 'players' && <div className="card form">
          <h2><Users size={20} /> Players</h2>
          <label>Add player</label>
          <input placeholder="Player name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <input type="number" placeholder="Starting handicap" value={playerHandicap} onChange={(e) => setPlayerHandicap(e.target.value)} />
          <button onClick={addPlayer}>Add player</button>
        </div>}
      </section>

      <section className="card recent">
        <h2>Recent results</h2>
        {state.rounds.length === 0 ? <p>No new results entered yet.</p> : <div className="recent-grid">{state.rounds.map((round) => {
          const player = playerById.get(round.playerId)?.name || 'Unknown';
          const course = courseById.get(round.courseId)?.name || '';
          return <div key={round.id} className="result"><span><strong>{player}</strong><br />{round.type === 'stableford' ? `${round.points} Stableford points` : `${course} — ${round.score} gross (${round.holes} holes)`}</span><button className="icon" onClick={() => updateState((s) => ({ ...s, rounds: s.rounds.filter((r) => r.id !== round.id) }))}><Trash2 size={16} /></button></div>;
        })}</div>}
      </section>
    </main>
  );
}



