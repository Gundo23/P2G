import { useState, useEffect } from "react";

const defaultPlayers = [
  { name: "Dave Ince", handicap: 13.4 },
  { name: "Lewis Jones", handicap: 14.9 },
  { name: "Sam Turner", handicap: 16.7 },
  { name: "Paul Davies", handicap: 17.7 },
  { name: "Ray McDonald", handicap: 18.6 },
];

function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("golfPlayers");
    return saved ? JSON.parse(saved) : defaultPlayers;
  });

  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "golfPlayers",
      JSON.stringify(players)
    );
  }, [players]);

  function addPlayer() {
    if (!name || !handicap) return;

    setPlayers([
      ...players,
      {
        name,
        handicap: Number(handicap),
      },
    ]);

    setName("");
    setHandicap("");
  }

  function removePlayer(index) {
    setPlayers(players.filter((_, i) => i !== index));
  }

  const sorted = [...players].sort(
    (a, b) => a.handicap - b.handicap
  );

  return (
    <main style={{ padding: 20 }}>
      <h1>Golf Handicap League</h1>

      <h2>Add Player</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        placeholder="Handicap"
        type="number"
        value={handicap}
        onChange={(e) =>
          setHandicap(e.target.value)
        }
      />

      <button onClick={addPlayer}>
        Add
      </button>

      <h2>Standings</h2>

      {sorted.map((p, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
            border: "1px solid #ddd",
            marginBottom: 8
          }}
        >
          <span>
            {index + 1}. {p.name} — HC {p.handicap}
          </span>

          <button
            onClick={() =>
              removePlayer(index)
            }
          >
            Remove
          </button>
        </div>
      ))}
    </main>
  );
}

export default App;
