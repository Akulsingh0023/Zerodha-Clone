import React, { useState, useRef, useEffect, useMemo } from "react";
import stocksList from "../data/stocksList";
import "./WatchList.css";

const SearchBar = ({ watchlist, onAddStock, watchlistCount }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter stocks locally — instant, no API needed
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return stocksList
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      )
      .slice(0, 15);
  }, [query]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    setIsOpen(val.trim().length > 0);
  };

  const handleSelect = (stock) => {
    if (!stock.symbol) return;

    // Check duplicate
    const exists = watchlist.some(
      (w) => w.symbol.toUpperCase() === stock.symbol.toUpperCase()
    );
    if (exists) {
      setQuery("");
      setIsOpen(false);
      return;
    }

    onAddStock({ symbol: stock.symbol.toUpperCase(), name: stock.name });
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="wl-search-wrapper" ref={wrapperRef}>
      <div className="wl-search-bar">
        <svg className="wl-search-icon" viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="#9b9b9b"
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search eg: INFY, TCS, RELIANCE"
          className="wl-search-input"
          autoComplete="off"
        />
        <span className="wl-stock-count">{watchlistCount} / 50</span>
      </div>

      {isOpen && (
        <div className="wl-search-dropdown">
          {results.length === 0 && query.trim().length > 0 && (
            <div className="wl-search-empty">No results found</div>
          )}
          {results.map((stock, idx) => {
              const isDuplicate = watchlist.some(
                (w) => w.symbol.toUpperCase() === stock.symbol.toUpperCase()
              );
              return (
                <div
                  key={stock.symbol + idx}
                  className={`wl-search-item ${activeIndex === idx ? "wl-search-item-active" : ""} ${isDuplicate ? "wl-search-item-disabled" : ""}`}
                  onClick={() => !isDuplicate && handleSelect(stock)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <span className="wl-search-symbol">{stock.symbol}</span>
                  <span className="wl-search-name">{stock.name}</span>
                  {isDuplicate && <span className="wl-search-added">Added</span>}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
