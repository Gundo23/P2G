import { useState } from "react";

const startingPlayers = [
  { name: "Dave Ince", handicap: 13.4 },
  { name: "Lewis Jones", handicap: 14.9 },
  { name: "Sam Turner", handicap: 16.7 },
  { name: "Paul Davies", handicap: 17.7 },
  { name: "Ray McDonald", handicap: 18.6 },
  { name: "Franno", handicap: 19.5 },
  { name: "Rob Boon", handicap: 21.1 },
  { name: "Gary K", handicap: 21.1 },
  { name: "James", handicap: 26.5 },
  { name: "Dave Lloyd", handicap: 29.0 },
  { name: "Colin", handicap: 35.9 },
  { name: "Jack", handicap: 44.1 },
];

function App() {
  const [players, setPlayers] = useState(startingPlayers);
  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState("");

  function addPlayer() {
    if (!name || !handicap) return;

    const newPlayer = {
      name,
      handicap: Number(handicap),
    };

    setPlayers([...players, newPlayer]);
    setName("");
    setHandicap("");
  }

  const sortedPlayers = [...players].sort((a, b) => a.handicap - b.handicap);

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Golf Handicap League</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>Add Player</h2>

        <input
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />

        <input
          placeholder="Handicap"
          type="number"
          value={handicap}
          onChange={(e) => setHandicap(e.target.value)}
          style={{ padding: 8, marginRight: 8, width: 100 }}
        />

        <button onClick={addPlayer} style={{ padding: 8 }}>
          Add Player
        </button>
      </section>

      <section>
        <h2>Current Handicap Standings</h2>

        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Handicap</th>
            </tr>
          </thead>

          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={`${player.name}-${index}`}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.handicap.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;
