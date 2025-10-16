export default function ToneSelector({ tone, onChange }) {
    return (
      <select
        value={tone}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 w-full"
      >
        <option value="funny">LOMF</option>
        <option value="deep">KAFKA</option>
        <option value="unhinged">Unhinged</option>
        <option value="motivational">CRACKED</option>
      </select>
    );
  }