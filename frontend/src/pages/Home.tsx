import { useEffect, useState } from "react";
import { getGames } from "../api/games";
import GameCard from "../components/GameCard";
import SearchBar from "../components/SearchBar";
import StatsBar from "../components/StatsBar";

export default function Home() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getGames().then(setGames);
  }, []);

  const filtered = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-6">

      <h1 className="text-5xl font-bold text-blue-400">
        🎮 ShadCheck
      </h1>

      <p className="text-gray-400">
        SteamDB-style PS4 compatibility tracker
      </p>

      <SearchBar value={search} onChange={setSearch} />

      <StatsBar games={games} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((game) => (
          <GameCard key={game.cusa} game={game} />
        ))}
      </div>

    </div>
  );
}