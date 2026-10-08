type Props = {
  items: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
};

export default function RecentSearches({ items, onSelect, onClear }: Props) {
  return (
    <div className="recent" aria-label="Quick searches">
      <button type="button" className="chip" onClick={() => onSelect("")}>
        My IP
      </button>
      {items.map((query) => (
        <button type="button" className="chip" key={query} onClick={() => onSelect(query)}>
          {query}
        </button>
      ))}
      {items.length > 0 ? (
        <button type="button" className="chipClear" onClick={onClear} aria-label="Clear recent searches">
          Clear
        </button>
      ) : null}
    </div>
  );
}
