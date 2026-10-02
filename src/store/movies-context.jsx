import {
  fetchTrending,
  fetchNetflixOriginals,
  fetchTopRated,
  fetchActionMovies,
  fetchComedyMovies,
  fetchHorrorMovies,
  fetchRomanceMovies,
  fetchDocumentaries,
} from '../utils/http.js';

const STATIC_FETCHERS = {
  trending: fetchTrending,
  netflixOriginals: fetchNetflixOriginals,
  topRated: fetchTopRated,
  action: fetchActionMovies,
  comedy: fetchComedyMovies,
  horror: fetchHorrorMovies,
  romance: fetchRomanceMovies,
  documentaries: fetchDocumentaries,
};

const STATIC_CATEGORIES = Object.keys(STATIC_FETCHERS);

const emptyCategoryState = { data: null, isLoading: false, error: null };

const defaultMoviesState = [...STATIC_CATEGORIES, 'search'].reduce(
  (acc, category) => {
    acc[category] = emptyCategoryState;
    return acc;
  },
  {},
);

function moviesReducer(state, { type, payload, meta }) {
  switch (type) {
    case 'FETCH_START':
      return {
        ...state,
        [meta.category]: {
          ...state[meta.category],
          isLoading: true,
          error: null,
        },
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        [meta.category]: {
          data: payload,
          isLoading: false,
          error: null,
        },
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        [meta.category]: {
          ...state[meta.category],
          isLoading: false,
          error: payload,
        },
      };

    case 'CLEAR_SEARCH':
      return {
        ...state,
        search: emptyCategoryState,
      };
    default:
      return state;
  }
}

export {
  STATIC_FETCHERS,
  STATIC_CATEGORIES,
  defaultMoviesState,
  moviesReducer,
};
