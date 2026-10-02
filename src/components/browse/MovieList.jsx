import MovieDetail from '../../components/browse/MovieDetail';
import MovieCard from './MovieCard.jsx';
import useAppContext from '../../hooks/useAppContext.jsx';
import { fetchTrailerKey } from '../../utils/http.js';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w300';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';
const MOVIES_LIMIT = 20;

// Build the TMDB image URL according to the row type.
function buildImageUrl(movie, isLargeRow) {
  const path = isLargeRow ? movie.poster_path : movie.backdrop_path;
  if (!path) return undefined;
  const base = isLargeRow ? POSTER_BASE_URL : BACKDROP_BASE_URL;
  return `${base}${path}`;
}

function MovieList({ title, category, isLargeRow }) {
  const {
    movies,
    selection,
    selectMovie,
    setTrailerUrl,
    setTrailerNotFound,
    clearSelection,
  } = useAppContext();

  const { data, isLoading, error } = movies[category];
  const { selectedMovie, trailerUrl, trailerNotFound, activeListId } =
    selection;

  const isOwner = activeListId === category;

  const handleClick = async (movie) => {
    if (selectedMovie && selectedMovie.id === movie.id && isOwner) {
      clearSelection();
      return;
    }

    selectMovie(movie, category);

    try {
      const trailerKey = await fetchTrailerKey(movie);
      if (trailerKey) {
        setTrailerUrl(trailerKey, movie.id);
      } else {
        setTrailerNotFound(true, movie.id);
      }
    } catch {
      setTrailerNotFound(true, movie.id);
    }
  };

  const results = [...(data?.results ?? [])]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, MOVIES_LIMIT);

  return (
    <div className='ml-5 text-white'>
      <h2 className='font-[Arial] text-2xl font-semibold'>{title}</h2>

      {isLoading && (
        <p className='px-5 text-sm text-neutral-400'>Đang tải...</p>
      )}

      {!isLoading && error && (
        <p className='px-5 text-sm text-red-400'>Lỗi: {error}</p>
      )}

      {!isLoading && !error && (
        <div className='flex gap-2.5 overflow-x-auto overflow-y-auto p-5 scrollbar-thin [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:transition-colors hover:[&::-webkit-scrollbar-thumb]:bg-white/30'>
          {results
            .filter((movie) => buildImageUrl(movie, isLargeRow) !== undefined)
            .map((movie) => (
              <MovieCard
                key={movie.id}
                onClick={() => handleClick(movie)}
                src={buildImageUrl(movie, isLargeRow)}
                alt={movie.name || movie.title}
                isLargeRow={isLargeRow}
              />
            ))}
        </div>
      )}

      <div className='p-10'>
        {isOwner && selectedMovie && (
          <MovieDetail
            movieData={selectedMovie}
            movieTrailer={trailerUrl}
            noTrailer={trailerNotFound}
          />
        )}
      </div>
    </div>
  );
}

export default MovieList;
