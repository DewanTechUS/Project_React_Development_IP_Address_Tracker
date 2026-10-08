const STORAGE_KEY = "recentSearches";
const MAX_ITEMS = 5;

// Stored only in this browser; storage errors (private mode) are ignored.
export function loadRecent(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((q): q is string => typeof q === "string").slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function save(items: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore: history is a convenience.
  }
}

export function addRecent(items: string[], query: string) {
  const next = [query, ...items.filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(0, MAX_ITEMS);
  save(next);
  return next;
}

export function clearRecent() {
  save([]);
  return [];
}
