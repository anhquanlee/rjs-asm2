import { createContext, useCallback, useEffect, useReducer } from 'react';
import {
  defaultMoviesState,
  moviesReducer,
  STATIC_CATEGORIES,
  STATIC_FETCHERS,
} from './movies-context';
import { defaultSelectionState, selectionReducer } from './selection-context';
import { fetchSearch } from '../utils/http';

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

export default function AppContextProvider({ children }) {
  const [movies, dispatch] = useReducer(moviesReducer, defaultMoviesState);

  const [selection, dispatchSelection] = useReducer(
    selectionReducer,
    defaultSelectionState,
  );

  const runFetch = useCallback(async (category, apiFn) => {
    dispatch({ type: 'FETCH_START', meta: { category } });
    try {
      const data = await apiFn();
      dispatch({
        type: 'FETCH_SUCCESS',
        meta: { category },
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_ERROR',
        meta: { category },
        payload: error?.message || 'Đã có lỗi xảy ra',
      });
    }
  }, []);

  const getSearch = useCallback(
    (query) => runFetch('search', () => fetchSearch(query)),
    [runFetch],
  );

  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
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
      meta: { url, movieId },
    });
  }, []);

  const setTrailerNotFound = useCallback((value, movieId) => {
    dispatchSelection({
      type: 'SET_TRAILER_NOT_FOUND',
      meta: { trailerNotFound: value, movieId },
    });
  }, []);

  const clearSelection = useCallback(() => {
    dispatchSelection({ type: 'CLEAR_SELECTION' });
  }, []);

  // Fetch all static movie categories once when the provider mounts.
  useEffect(() => {
    Promise.all(
      STATIC_CATEGORIES.map((category) =>
        runFetch(category, STATIC_FETCHERS[category]),
      ),
    );
  }, [runFetch]);

  return (
    <AppContext.Provider
      value={{
        movies,
        getSearch,
        clearSearch,
        selection,
        selectMovie,
        setTrailerUrl,
        setTrailerNotFound,
        clearSelection,
      }}>
      {children}
    </AppContext.Provider>
  );
}
