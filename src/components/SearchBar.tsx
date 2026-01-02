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
    <form className="search" onSubmit={handleSubmit}>
      <input
        className="searchInput"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search IP or domain"
        aria-label="Search IP or domain"
      />
      <button className="searchBtn" type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
