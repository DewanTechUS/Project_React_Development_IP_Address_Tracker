import { useState } from "react";

type Props = {
  onSearch: (value: string) => void;
  isLoading: boolean;
};

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label htmlFor="ip-search" className="srOnly">
        IP address or domain
      </label>
      <input
        id="ip-search"
        className="searchInput"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. 8.8.8.8 or google.com"
        aria-describedby="search-hint"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="url"
        enterKeyHint="search"
        maxLength={255}
      />
      <button className="searchBtn" type="submit" disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? <span className="spinner" aria-hidden="true" /> : null}
        <span>{isLoading ? "Searching…" : "Search"}</span>
      </button>
      <p id="search-hint" className="srOnly">
        Leave the field empty and search to look up your own public IP address.
      </p>
    </form>
  );
}
