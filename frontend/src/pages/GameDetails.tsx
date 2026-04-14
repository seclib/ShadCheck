import { useParams } from "react-router-dom";

export default function GameDetails() {
  const { id } = useParams();

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold">{id}</h1>

      <p className="mt-4 text-gray-400">
        Detailed compatibility info coming soon...
      </p>
    </div>
  );
}