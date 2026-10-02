import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Nav from '../../components/browse/Nav';
import ResultList from '../../components/search/ResultList.jsx';
import SearchForm from '../../components/search/SearchForm.jsx';
import useAppContext from '../../hooks/useAppContext.jsx';

function getSearchTermFromLocation(search) {
  if (!search || search.length <= 1) return '';
  const result = decodeURIComponent(search.slice(1));
  return result;
}

const Search = () => {
  const { getSearch, clearSearch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchInput, setSearchInput] = useState('');

  const hasSearched = getSearchTermFromLocation(location.search) !== '';

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchInput.trim();
    if (!term) return; // Không gửi request khi từ khóa rỗng.

    navigate(`/search?${encodeURIComponent(term)}`);
  };

  const handleResetSearch = () => {
    setSearchInput('');
  };

  useEffect(() => {
    const term = getSearchTermFromLocation(location.search);

    if (term) {
      getSearch(term);
    } else {
      clearSearch();
    }
  }, [location.search, getSearch, clearSearch]);

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
};

export default Search;
