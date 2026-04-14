export default function StatsBar({ games }) {
  const playable = games.filter(g => g.status === "playable").length;
  const ingame = games.filter(g => g.status === "ingame").length;

  return (
    <div className="flex gap-3 mt-4 text-sm">
      <div className="bg-green-600 px-3 py-1 rounded">
        Playable: {playable}
      </div>
      <div className="bg-yellow-600 px-3 py-1 rounded">
        In-game: {ingame}
      </div>
    </div>
  );
}