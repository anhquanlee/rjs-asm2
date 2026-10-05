import { useState } from 'react';

import useAppContext from '../../hooks/useAppContext.jsx';
import { fetchTrailerKey } from '../../utils/http.js';

import AutoScrollRow from './AutoScrollRow.jsx';
import MovieCard from './MovieCard.jsx';
import MovieDetail from './MovieDetail.jsx';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w300';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';

const MOVIES_LIMIT = 20;

function buildImageUrl(movie, isLargeRow) {
  const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;

  if (!imagePath) return null;

  const baseUrl = isLargeRow ? POSTER_BASE_URL : BACKDROP_BASE_URL;

  return `${baseUrl}${imagePath}`;
}

function getRandomDirection() {
  return Math.random() < 0.5 ? 'left' : 'right';
}

function getRandomDuration() {
  return Math.floor(Math.random() * (50 - 30 + 1)) + 30;
}

function MovieList({
  title,
  category,
  isLargeRow = false,
  marquee = false,
  marqueeDirection,
  marqueeDuration,
}) {
  const {
    movies,
    selection,
    selectMovie,
    setTrailerUrl,
    setTrailerNotFound,
    clearSelection,
  } = useAppContext();

  const [randomDirection] = useState(getRandomDirection);

  const [randomDuration] = useState(getRandomDuration);

  const { data, isLoading, error } = movies[category];

  const { selectedMovie, trailerUrl, trailerNotFound, activeListId } =
    selection;

  const ownsSelectedMovie = activeListId === category;

  const pauseMarquee = ownsSelectedMovie && Boolean(selectedMovie);

  const direction = marqueeDirection ?? randomDirection;

  const duration = marqueeDuration ?? randomDuration;

  const movieItems = [...(data?.results ?? [])]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, MOVIES_LIMIT)
    .map((movie) => ({
      movie,
      imageUrl: buildImageUrl(movie, isLargeRow),
    }))
    .filter(({ imageUrl }) => imageUrl);

  async function handleMovieClick(movie) {
    const isSelectedMovie = selectedMovie?.id === movie.id && ownsSelectedMovie;

    if (isSelectedMovie) {
      clearSelection();
      return;
    }

    selectMovie(movie, category);

    try {
      const trailerKey = await fetchTrailerKey(movie);

      if (trailerKey) {
        setTrailerUrl(trailerKey, movie.id);

        return;
      }

      setTrailerNotFound(true, movie.id);
    } catch {
      setTrailerNotFound(true, movie.id);
    }
  }

  const movieCards = movieItems.map(({ movie, imageUrl }) => (
    <MovieCard
      key={movie.id}
      src={imageUrl}
      alt={movie.name || movie.title}
      isLargeRow={isLargeRow}
      onClick={() => handleMovieClick(movie)}
    />
  ));

  return (
    <section className='ml-5 text-white'>
      <h2 className='font-[Arial] text-2xl font-semibold'>{title}</h2>

      {isLoading && (
        <p className='px-5 text-sm text-neutral-400'>Đang tải...</p>
      )}

      {!isLoading && error && (
        <p className='px-5 text-sm text-red-400'>Lỗi: {error}</p>
      )}

      {!isLoading && !error && (
        <AutoScrollRow
          enabled={marquee}
          paused={pauseMarquee}
          direction={direction}
          duration={duration}>
          {movieCards}
        </AutoScrollRow>
      )}

      {ownsSelectedMovie && selectedMovie && (
        <div className='p-10'>
          <MovieDetail
            movieData={selectedMovie}
            movieTrailer={trailerUrl}
            noTrailer={trailerNotFound}
          />
        </div>
      )}
    </section>
  );
}

export default MovieList;
