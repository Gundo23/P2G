import React, { useMemo, useState } from 'react';
import { Trophy, Plus, Trash2, RotateCcw, Flag, Users, Search, Database, Smartphone } from 'lucide-react';
import './style.css';

const STORAGE_KEY = 'golf-handicap-league-v1';

function App() {
  return (
    <main className="page">
      <section className="hero card">
        <div>
          <div className="pill">
            <Smartphone size={16} /> Pin-to-home-screen web app
          </div>

          <h1>Golf Handicap League</h1>
          <p>League app loaded successfully.</p>
        </div>

        <button className="secondary">
          <RotateCcw size={16} />
          Reset
        </button>
      </section>

      <section className="card">
        <h2>
          <Trophy size={20} /> Handicap League Ready
        </h2>

        <p>
          Your main app is connected and working.
        </p>
      </section>
    </main>
  );
}

export default App;
