import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    const res = await axios.get("http://localhost:3000/games");
    setGames(res.data);
  };

  const searchGames = async (q) => {
    setSearch(q);
    if (q.length === 0) return loadGames();

    const res = await axios.get(
      `http://localhost:3000/search?q=${q}`
    );
    setGames(res.data);
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">🎮 ShadCheck</h1>

      <input
        className="p-2 w-full text-black"
        placeholder="Search CUSA or game..."
        value={search}
        onChange={(e) => searchGames(e.target.value)}
      />

      <div className="mt-6 grid gap-2">
        {games.map((g, i) => (
          <div key={i} className="p-3 bg-gray-800 rounded">
            <div className="font-bold">{g.title}</div>
            <div>{g.cusa}</div>
            <div>Status: {g.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
