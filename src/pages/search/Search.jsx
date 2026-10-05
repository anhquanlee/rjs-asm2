import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Nav from '../../components/browse/Nav.jsx';
import ResultList from '../../components/search/ResultList.jsx';
import SearchForm from '../../components/search/SearchForm.jsx';
import useAppContext from '../../hooks/useAppContext.jsx';

function getSearchTerm(search) {
  if (!search || search.length <= 1) return '';

  return decodeURIComponent(search.slice(1));
}

function Search() {
  const { getSearch, clearSearch } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');

  const searchTerm = getSearchTerm(location.search);
  const hasSearched = Boolean(searchTerm);

  function handleSearch(event) {
    event.preventDefault();

    const term = searchInput.trim();

    if (!term) return;

    navigate(`/search?${encodeURIComponent(term)}`);
  }

  function handleResetSearch() {
    setSearchInput('');
  }

  useEffect(() => {
    if (searchTerm) {
      getSearch(searchTerm);
      return;
    }

    clearSearch();
  }, [searchTerm, getSearch, clearSearch]);

  return (
    <div className='min-h-screen bg-[#111] text-white'>
      <Nav />

      <SearchForm
        searchValue={searchInput}
        onInputChange={setSearchInput}
        onSearch={handleSearch}
        onReset={handleResetSearch}
      />

      {hasSearched && <ResultList />}
    </div>
  );
}

export default Search;
