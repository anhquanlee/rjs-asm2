import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from 'react';

import { fetchSearch } from '../utils/http.js';
import {
  defaultMoviesState,
  moviesReducer,
  STATIC_CATEGORIES,
  STATIC_FETCHERS,
} from './movies-context.jsx';
import {
  defaultSelectionState,
  selectionReducer,
} from './selection-context.jsx';

export const AppContext = createContext({
  movies: defaultMoviesState,
  getSearch: () => {},
  clearSearch: () => {},

  selection: defaultSelectionState,
  selectMovie: () => {},
  setTrailerUrl: () => {},
  setTrailerNotFound: () => {},
  clearSelection: () => {},
});

function AppContextProvider({ children }) {
  const [movies, dispatchMovies] = useReducer(
    moviesReducer,
    defaultMoviesState,
  );

  const [selection, dispatchSelection] = useReducer(
    selectionReducer,
    defaultSelectionState,
  );

  const runFetch = useCallback(async (category, fetchFunction) => {
    dispatchMovies({
      type: 'FETCH_START',
      meta: { category },
    });

    try {
      const data = await fetchFunction();

      dispatchMovies({
        type: 'FETCH_SUCCESS',
        payload: data,
        meta: { category },
      });
    } catch (error) {
      dispatchMovies({
        type: 'FETCH_ERROR',
        payload: error?.message || 'Đã có lỗi xảy ra',
        meta: { category },
      });
    }
  }, []);

  const getSearch = useCallback(
    (query) =>
      runFetch('search', () => fetchSearch(query)),
    [runFetch],
  );

  const clearSearch = useCallback(() => {
    dispatchMovies({
      type: 'CLEAR_SEARCH',
    });
  }, []);

  const selectMovie = useCallback((movie, listId) => {
    dispatchSelection({
      type: 'SELECT_MOVIE',
      payload: movie,
      meta: { listId },
    });
  }, []);

  const setTrailerUrl = useCallback((url, movieId) => {
    dispatchSelection({
      type: 'SET_TRAILER_URL',
      meta: {
        url,
        movieId,
      },
    });
  }, []);

  const setTrailerNotFound = useCallback(
    (trailerNotFound, movieId) => {
      dispatchSelection({
        type: 'SET_TRAILER_NOT_FOUND',
        meta: {
          trailerNotFound,
          movieId,
        },
      });
    },
    [],
  );

  const clearSelection = useCallback(() => {
    dispatchSelection({
      type: 'CLEAR_SELECTION',
    });
  }, []);

  useEffect(() => {
    STATIC_CATEGORIES.forEach((category) => {
      runFetch(category, STATIC_FETCHERS[category]);
    });
  }, [runFetch]);

  const contextValue = {
    movies,
    getSearch,
    clearSearch,

    selection,
    selectMovie,
    setTrailerUrl,
    setTrailerNotFound,
    clearSelection,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
