import { useCallback, useEffect, useRef, useState } from 'react';

import useAppContext from '../../hooks/useAppContext.jsx';

const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const FADE_DURATION = 1000;
const BANNER_CHANGE_INTERVAL = 5000;
const OVERVIEW_WORD_LIMIT = 25;

function truncateText(text, wordLimit) {
  if (!text) return '';

  const words = text.split(' ');

  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(' ')} ...`
    : text;
}

function Banner() {
  const { movies } = useAppContext();
  const results = movies.netflixOriginals.data?.results ?? [];

  const moviesRef = useRef([]);
  const nextLayerIdRef = useRef(0);
  const lastMovieIdRef = useRef(null);
  const hasStartedRef = useRef(false);

  const [layers, setLayers] = useState([]);

  const pickRandomMovie = useCallback(() => {
    const movieList = moviesRef.current;

    if (!movieList.length) return null;
    if (movieList.length === 1) return movieList[0];

    let movie;

    do {
      const randomIndex = Math.floor(Math.random() * movieList.length);
      movie = movieList[randomIndex];
    } while (movie.id === lastMovieIdRef.current);

    return movie;
  }, []);

  useEffect(() => {
    moviesRef.current = results;
  }, [results]);

  useEffect(() => {
    if (!results.length) return;

    let isCancelled = false;
    const pendingTimeouts = [];

    function showMovie(movie) {
      if (isCancelled || !movie) return;

      const layerId = nextLayerIdRef.current++;
      lastMovieIdRef.current = movie.id;

      setLayers((currentLayers) => {
        const previousLayer = currentLayers[currentLayers.length - 1];

        if (previousLayer) {
          const timeoutId = setTimeout(() => {
            if (isCancelled) return;

            setLayers((layers) =>
              layers.filter((layer) => layer.id !== previousLayer.id),
            );
          }, FADE_DURATION + 50);

          pendingTimeouts.push(timeoutId);
        }

        return [
          ...(previousLayer
            ? [{ ...previousLayer, visible: false }]
            : []),
          {
            id: layerId,
            movie,
            visible: false,
          },
        ];
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isCancelled) return;

          setLayers((currentLayers) =>
            currentLayers.map((layer) =>
              layer.id === layerId
                ? { ...layer, visible: true }
                : layer,
            ),
          );
        });
      });
    }

    // Display the first banner as soon as movie data becomes available.
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      showMovie(pickRandomMovie());
    }

    const intervalId = setInterval(() => {
      showMovie(pickRandomMovie());
    }, BANNER_CHANGE_INTERVAL);

    return () => {
      isCancelled = true;

      clearInterval(intervalId);
      pendingTimeouts.forEach(clearTimeout);
    };
  }, [results.length, pickRandomMovie]);

  return (
    <div className='relative mb-5 h-112'>
      {layers.map(({ id, movie, visible }) => (
        <header
          key={id}
          className={`absolute top-0 right-0 left-0 h-112 bg-cover bg-center text-white transition-opacity ease-in-out ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transitionDuration: `${FADE_DURATION}ms`,
            backgroundImage: movie.backdrop_path
              ? `url("${BACKDROP_BASE_URL}${movie.backdrop_path}")`
              : undefined,
          }}>
          <div className='ml-7.5 h-47.5 pt-35'>
            <h1 className='mb-12 pb-1 text-5xl font-extrabold'>
              {movie.title || movie.name || movie.original_name}
            </h1>

            <div className='mt-2 flex'>
              <button className='mr-4 cursor-pointer rounded-[0.2vw] bg-[rgba(51,51,51,0.5)] px-8 py-2 font-bold text-white transition-colors duration-200 hover:bg-[#e6e6e6] hover:text-black'>
                Play
              </button>

              <button className='mr-4 cursor-pointer rounded-[0.2vw] bg-[rgba(51,51,51,0.5)] px-8 py-2 font-bold text-white transition-colors duration-200 hover:bg-[#e6e6e6] hover:text-black'>
                My List
              </button>
            </div>

            <p className='mt-2 h-20 w-180 max-w-90 text-sm leading-tight font-normal'>
              {truncateText(movie.overview, OVERVIEW_WORD_LIMIT)}
            </p>
          </div>
        </header>
      ))}
    </div>
  );
}

export default Banner;
