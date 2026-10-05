import axios from 'axios';

const BEARER_TOKEN =
  import.meta.env.VITE_TMDB_BEARER_TOKEN;

const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY;

const NETFLIX_NETWORK_ID = 213;

const GENRE = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  ROMANCE: 10749,
  DOCUMENTARY: 99,
};

const DEFAULT_DISCOVER_PARAMS = {
  include_adult: false,
  include_video: false,
  sort_by: 'popularity.desc',
};

if (!BEARER_TOKEN && !API_KEY) {
  console.warn(
    '[TMDB] Missing VITE_TMDB_BEARER_TOKEN or VITE_TMDB_API_KEY.',
  );
}

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',

  params: {
    language: 'en-US',
    ...(BEARER_TOKEN
      ? {}
      : { api_key: API_KEY }),
  },

  headers: {
    ...(BEARER_TOKEN
      ? {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        }
      : {}),
  },
});

async function fetchMoviesByGenre(genreId) {
  const { data } = await tmdb.get('/discover/movie', {
    params: {
      ...DEFAULT_DISCOVER_PARAMS,
      with_genres: genreId,
    },
  });

  return data;
}

export async function fetchTrending() {
  const { data } = await tmdb.get('/trending/all/week');

  return data;
}

export async function fetchNetflixOriginals() {
  const { data } = await tmdb.get('/discover/tv', {
    params: {
      ...DEFAULT_DISCOVER_PARAMS,
      with_networks: NETFLIX_NETWORK_ID,
    },
  });

  return data;
}

export async function fetchTopRated() {
  const { data } = await tmdb.get('/movie/top_rated');

  return data;
}

export function fetchActionMovies() {
  return fetchMoviesByGenre(GENRE.ACTION);
}

export function fetchComedyMovies() {
  return fetchMoviesByGenre(GENRE.COMEDY);
}

export function fetchHorrorMovies() {
  return fetchMoviesByGenre(GENRE.HORROR);
}

export function fetchRomanceMovies() {
  return fetchMoviesByGenre(GENRE.ROMANCE);
}

export function fetchDocumentaries() {
  return fetchMoviesByGenre(GENRE.DOCUMENTARY);
}

export async function fetchSearch(query) {
  const { data } = await tmdb.get('/search/movie', {
    params: {
      query,
    },
  });

  return data;
}

function getMediaType(movie) {
  if (movie.media_type) {
    return movie.media_type;
  }

  const isTvShow =
    !movie.release_date &&
    Boolean(movie.first_air_date || movie.name);

  return isTvShow ? 'tv' : 'movie';
}

export async function fetchMovieVideos(movie) {
  const mediaType = getMediaType(movie);

  const { data } = await tmdb.get(
    `/${mediaType}/${movie.id}/videos`,
  );

  return data;
}

export async function fetchTrailerKey(movie) {
  const { results = [] } = await fetchMovieVideos(movie);

  const trailer =
    results.find(
      (video) =>
        video.site === 'YouTube' &&
        video.type === 'Trailer',
    ) ??
    results.find(
      (video) =>
        video.site === 'YouTube',
    );

  return trailer?.key ?? null;
}
