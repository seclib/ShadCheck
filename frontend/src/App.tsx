import { useEffect, useState } from "react";
import { getGames } from "./api/games";
import type { Game } from "./types/game";

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getGames().then(setGames);
  }, []);

  const filtered = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

return (
  <div className="min-h-screen bg-black text-white p-6">

    {/* HEADER */}
    <div className="border-b border-gray-800 pb-4">
      <h1 className="text-5xl font-extrabold text-blue-400">
        🎮 SHADCHECK
      </h1>
      <p className="text-gray-400 mt-2">
        PS4 Compatibility Tracker
      </p>
    </div>

    {/* SEARCH */}
    <div className="mt-6">
      <input
        className="w-full p-4 text-black text-lg rounded-lg"
        placeholder="Search games or CUSA..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* STATS BAR */}
    <div className="flex gap-4 mt-6 text-sm">
      <div className="bg-green-600 px-3 py-1 rounded">
        PLAYABLE
      </div>
      <div className="bg-yellow-600 px-3 py-1 rounded">
        IN-GAME
      </div>
      <div className="bg-red-600 px-3 py-1 rounded">
        ISSUES
      </div>
    </div>

    {/* GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

      {filtered.map((game) => (
        <div
          key={game.cusa}
          className="bg-[#111] border border-gray-700 p-5 rounded-xl hover:border-blue-500 transition"
        >

          <h2 className="text-xl font-bold text-white">
            {game.title}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            {game.cusa}
          </p>

          <div className="mt-3">
            <span
              className={`
                px-3 py-1 rounded text-sm font-bold
                ${
                  game.status === "playable"
                    ? "bg-green-600"
                    : game.status === "ingame"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }
              `}
            >
              {game.status.toUpperCase()}
            </span>
          </div>

        </div>
      ))}

    </div>

  </div>
);
}