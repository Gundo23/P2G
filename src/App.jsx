import { useEffect, useState } from "react";

const defaultPlayers = [
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
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("golfPlayers");
    return saved ? JSON.parse(saved) : defaultPlayers;
  });

  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState("");

  useEffect(() => {
    localStorage.setItem("golfPlayers", JSON.stringify(players));
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

  function removePlayer(playerName) {
    setPlayers(players.filter((p) => p.name !== playerName));
  }

  function resetPlayers() {
    localStorage.removeItem("golfPlayers");
    setPlayers(defaultPlayers);
  }

  const sorted = [...players].sort((a, b) => a.handicap - b.handicap);

  return (
    <main className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900">
      <section className="mx-auto max-w-xl space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow">
          <h1 className="text-3xl font-bold">Golf Handicap League</h1>
          <p className="mt-1 text-sm text-slate-500">
            Player handicap tracker
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-3 text-xl font-semibold">Add Player</h2>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_100px_auto]">
            <input
              className="rounded-xl border border-slate-300 p-3"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="rounded-xl border border-slate-300 p-3"
              placeholder="HC"
              type="number"
              value={handicap}
              onChange={(e) => setHandicap(e.target.value)}
            />

            <button
              className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"
              onClick={addPlayer}
            >
              Add
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Standings</h2>

            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onClick={resetPlayers}
            >
              Reset
            </button>
          </div>

          <div className="space-y-2">
            {sorted.map((p, index) => (
              <div
                key={p.name}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div>
                  <div className="font-semibold">
                    {index + 1}. {p.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    Handicap {p.handicap.toFixed(1)}
                  </div>
                </div>

                <button
                  className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700"
                  onClick={() => removePlayer(p.name)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
