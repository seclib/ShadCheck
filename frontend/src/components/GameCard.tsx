export default function GameCard({ game }) {
  const color =
    game.status === "playable"
      ? "text-green-400"
      : game.status === "ingame"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 hover:scale-[1.03] transition">
      <h2 className="text-xl font-bold">{game.title}</h2>

      <p className="text-gray-400 text-sm">{game.cusa}</p>

      <span className={`${color} font-bold mt-2 inline-block`}>
        {game.status.toUpperCase()}
      </span>
    </div>
  );
}