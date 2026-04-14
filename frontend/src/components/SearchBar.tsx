export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="w-full p-3 rounded bg-[#111827] border border-gray-700 text-white"
      placeholder="Search games or CUSA..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}