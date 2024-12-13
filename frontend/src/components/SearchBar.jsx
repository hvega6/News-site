import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/articles/search?q=${query}`);
      onSearchResults(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar; 