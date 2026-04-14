import { getGames, searchGames } from "./api/games";
import axios from "axios";

const load = async () => {
  const res = await axios.get("http://localhost:3000/games");
  setGames(res.data);
};

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");

useEffect(() => {
  load();
}, []);

const load = async () => {
  const res = await fetch("http://localhost:3000/games");
  const data = await res.json();
  setGames(data);
};

  const onSearch = async (value: string) => {
    setSearch(value);

    if (!value) return load();

    const data = await searchGames(value);
    setGames(data);
  };

  const statusColor = (status: Game["status"]) => {
    switch (status) {
      case "playable":
        return "text-green-400";
      case "ingame":
        return "text-yellow-400";
      case "menus":
        return "text-orange-400";
      case "boots":
      case "nothing":
        return "text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      
      <h1 className="text-3xl font-bold mb-4">
        🎮 ShadCheck
      </h1>

      <input
        className="w-full p-2 rounded text-black"
        placeholder="Search CUSA or game..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="mt-6 grid gap-3">
        {games.map((g) => (
          <div
            key={g.cusa}
            className="bg-[#1a1a1a] p-4 rounded hover:bg-[#222]"
          >
            <div className="text-lg font-bold">
              {g.title}
            </div>

            <div className="text-sm opacity-70">
              {g.cusa}
            </div>

            <div className={`font-semibold ${statusColor(g.status)}`}>
              {g.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
console.log(games);