export function SearchInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="search-input">
      <span>{label}</span>
      <input
        type="search"
        value={value}
        placeholder="Escribe una palabra, tema o nombre…"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
