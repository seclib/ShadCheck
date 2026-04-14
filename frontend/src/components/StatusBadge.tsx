export default function StatusBadge({ status }) {
  const styles = {
    playable: "bg-green-600",
    ingame: "bg-yellow-600",
    menus: "bg-orange-600",
    nothing: "bg-red-600",
  };

  return (
    <span className={`px-2 py-1 rounded text-white text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}