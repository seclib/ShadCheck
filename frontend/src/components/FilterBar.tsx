export default function FilterBar({ setFilter }) {
  return (
    <div className="flex gap-2 mt-2">
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("playable")}>Playable</button>
      <button onClick={() => setFilter("ingame")}>In-game</button>
    </div>
  );
}