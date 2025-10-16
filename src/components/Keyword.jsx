export default function Keyword({ value, onChange, placeholder }) {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
    );
  }