import { useRef, useState } from 'react';

import MovieDetail from '../browse/MovieDetail.jsx';
import MovieCard from '../browse/MovieCard.jsx';
import useAppContext from '../../hooks/useAppContext.jsx';
import { useGridColumnCount } from '../../hooks/useGridColumnCount.jsx';
import { fetchTrailerKey } from '../../utils/http.js';

const BASE_URL = 'https://image.tmdb.org/t/p/original';

const DEFAULT_STATE = {
  selectedMovie: null,
  trailerUrl: '',
  trailerNotFound: false,
};

const ResultList = () => {
  const { movies } = useAppContext();
  const { data, isLoading, error } = movies.search;
  const [state, setState] = useState(DEFAULT_STATE);
  const trailerRequestIdRef = useRef(0);

  const { gridRef, columnCount } = useGridColumnCount();

  const results = [...(data?.results ?? [])].filter(
    (movie) => movie.poster_path,
  );

  const handleClick = async (movie) => {
    const requestId = ++trailerRequestIdRef.current;

    if (state.selectedMovie && state.selectedMovie.id === movie.id) {
      setState(DEFAULT_STATE);
      return;
    }

    setState({ selectedMovie: movie, trailerUrl: '', trailerNotFound: false });

    try {
      const trailerKey = await fetchTrailerKey(movie);
      if (requestId !== trailerRequestIdRef.current) return;

      setState((prev) => ({
        ...prev,
        trailerUrl: trailerKey ?? '',
        trailerNotFound: !trailerKey,
      }));
    } catch {
      if (requestId !== trailerRequestIdRef.current) return;
      setState((prev) => ({ ...prev, trailerNotFound: true }));
    }
  };

  if (isLoading) {
    return <p className='text-center text-sm text-neutral-400'>Đang tìm...</p>;
  }

  if (!isLoading && error) {
    return <p className='text-center text-sm text-red-400'>Lỗi: {error}</p>;
  }

  if (!isLoading && !error && results.length === 0) {
    return <p className='text-center'>Không có bộ phim nào được tìm thấy</p>;
  }

  const selectedIndex = state.selectedMovie
    ? results.findIndex((movie) => movie.id === state.selectedMovie.id)
    : -1;

  let lastIndexOfSelectedRow = -1;
  if (selectedIndex !== -1 && columnCount > 0) {
    const rowIndex = Math.floor(selectedIndex / columnCount);
    lastIndexOfSelectedRow = Math.min(
      rowIndex * columnCount + columnCount - 1,
      results.length - 1,
    );
  }

  const gridItems = [];
  results.forEach((movie, index) => {
    gridItems.push(
      <MovieCard
        key={movie.id}
        onClick={() => handleClick(movie)}
        src={`${BASE_URL}${movie.poster_path}`}
        alt={movie.name || movie.title}
        isLargeRow
      />,
    );

    if (index === lastIndexOfSelectedRow) {
      gridItems.push(
        <div key='movie-detail' className='col-span-full px-5 py-10'>
          <MovieDetail
            movieData={state.selectedMovie}
            movieTrailer={state.trailerUrl}
            noTrailer={state.trailerNotFound}
          />
        </div>,
      );
    }
  });

  return (
    <div className='ml-5 text-white'>
      <h2 className='text-2xl font-semibold'>Search Result</h2>

      <div
        ref={gridRef}
        className='mt-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5'>
        {gridItems}
      </div>
    </div>
  );
};

export default ResultList;
