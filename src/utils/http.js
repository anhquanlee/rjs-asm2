import axios from 'axios';

// TMDB credentials are stored in .env.local. Bearer Token is preferred;
// the v3 API Key is used only when a Bearer Token is not provided.
const BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!BEARER_TOKEN && !API_KEY) {
  console.warn(
    '[http] Thiếu VITE_TMDB_BEARER_TOKEN hoặc VITE_TMDB_API_KEY trong .env.local — các request tới TMDB sẽ thất bại.',
  );
}

const GENRE = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  ROMANCE: 10749,
  DOCUMENTARY: 99,
};

const NETFLIX_NETWORK_ID = 213;

const DEFAULT_DISCOVER_PARAMS = {
  include_adult: false,
  include_video: false,
  sort_by: 'popularity.desc',
};

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    language: 'en-US',
    ...(BEARER_TOKEN ? {} : { api_key: API_KEY }),
  },
  headers: {
    ...(BEARER_TOKEN ? { Authorization: `Bearer ${BEARER_TOKEN}` } : {}),
  },
});

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

export async function fetchActionMovies() {
  const { data } = await tmdb.get('/discover/movie', {
    params: { ...DEFAULT_DISCOVER_PARAMS, with_genres: GENRE.ACTION },
  });
  return data;
}

export async function fetchComedyMovies() {
  const { data } = await tmdb.get('/discover/movie', {
    params: { ...DEFAULT_DISCOVER_PARAMS, with_genres: GENRE.COMEDY },
  });
  return data;
}

export async function fetchHorrorMovies() {
  const { data } = await tmdb.get('/discover/movie', {
    params: { ...DEFAULT_DISCOVER_PARAMS, with_genres: GENRE.HORROR },
  });
  return data;
}

export async function fetchRomanceMovies() {
  const { data } = await tmdb.get('/discover/movie', {
    params: { ...DEFAULT_DISCOVER_PARAMS, with_genres: GENRE.ROMANCE },
  });
  return data;
}

export async function fetchDocumentaries() {
  const { data } = await tmdb.get('/discover/movie', {
    params: { ...DEFAULT_DISCOVER_PARAMS, with_genres: GENRE.DOCUMENTARY },
  });
  return data;
}

export async function fetchSearch(query) {
  const { data } = await tmdb.get('/search/movie', {
    params: { query },
  });
  return data;
}

// Trending may contain both movies and TV shows, while Netflix Originals are
// TV shows. Pick the correct TMDB video endpoint from the available metadata.
export async function fetchMovieVideos(movie) {
  const isTvShow =
    movie.media_type === 'tv' ||
    (!movie.release_date && Boolean(movie.first_air_date || movie.name));
  const mediaType = isTvShow ? 'tv' : 'movie';

  const { data } = await tmdb.get(`/${mediaType}/${movie.id}/videos`);
  return data;
}

export async function fetchTrailerKey(movie) {
  const data = await fetchMovieVideos(movie);
  const videos = data.results ?? [];

  const trailer =
    videos.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer',
    ) ?? videos.find((video) => video.site === 'YouTube');

  return trailer?.key ?? null;
}
