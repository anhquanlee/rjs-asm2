import { useCallback, useEffect, useRef, useState } from 'react';

import useAppContext from '../../hooks/useAppContext.jsx';

const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';
const FADE_DURATION = 1000;

function Banner() {
  const { movies } = useAppContext();
  const results = movies.netflixOriginals.data?.results ?? [];

  const moviesRef = useRef([]);
  const nextIdRef = useRef(0);
  const lastMovieIdRef = useRef(null);
  const hasStartedRef = useRef(false);
  const [layers, setLayers] = useState([]);

  const pickRandomMovie = useCallback(() => {
    const list = moviesRef.current;
    if (!list.length) return null;

    if (list.length === 1) return list[0];

    let movie;
    do {
      const randomIndex = Math.floor(Math.random() * list.length);
      movie = list[randomIndex];
    } while (movie.id === lastMovieIdRef.current);

    return movie;
  }, []);

  useEffect(() => {
    moviesRef.current = results;
  }, [results]);

  useEffect(() => {
    if (!results.length) return;

    let cancelled = false;
    const pendingTimeouts = [];

    function pushMovieLayer(movie) {
      if (cancelled || !movie) return;
      const id = nextIdRef.current++;
      lastMovieIdRef.current = movie.id;

      setLayers((prev) => {
        const previousLayer = prev[prev.length - 1];

        if (previousLayer) {
          const timeoutId = setTimeout(() => {
            if (cancelled) return;
            setLayers((cur) =>
              cur.filter((layer) => layer.id !== previousLayer.id),
            );
          }, FADE_DURATION + 50);
          pendingTimeouts.push(timeoutId);
        }

        return [
          ...(previousLayer ? [{ ...previousLayer, visible: false }] : []),
          { id, movie, visible: false },
        ];
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          setLayers((prev) =>
            prev.map((layer) =>
              layer.id === id ? { ...layer, visible: true } : layer,
            ),
          );
        });
      });
    }

    // Chỉ push layer đầu tiên đúng 1 lần duy nhất, ngay khi có data lần đầu tiên
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      pushMovieLayer(pickRandomMovie());
    }

    const intervalId = setInterval(() => {
      pushMovieLayer(pickRandomMovie());
    }, 5 * 1000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      pendingTimeouts.forEach(clearTimeout);
    };
  }, [results.length, pickRandomMovie]);

  function truncate(str, wordLimit) {
    if (!str) return str;
    const words = str.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + ' ...'
      : str;
  }

  return (
    <div className='relative mb-5 h-112'>
      {layers.map(({ id, movie, visible }) => (
        <header
          key={id}
          className={`text-white h-112 absolute top-0 left-0 right-0 bg-cover bg-center transition-opacity ease-in-out ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transitionDuration: `${FADE_DURATION}ms`,
            backgroundImage: movie.backdrop_path
              ? `url("${BACKDROP_URL}${movie.backdrop_path}")`
              : undefined,
          }}>
          <div className='ml-7.5 h-47.5 pt-35'>
            <h1 className='pb-1 text-5xl font-extrabold mb-12'>
              {movie.title || movie.name || movie.original_name}
            </h1>

            <div className='mt-2 flex'>
              <button className='mr-4 rounded-[0.2vw] bg-[rgba(51,51,51,0.5)] px-8 py-2 font-bold text-white transition-colors duration-200 hover:bg-[#e6e6e6] hover:text-black cursor-pointer'>
                Play
              </button>
              <button className='mr-4 rounded-[0.2vw] bg-[rgba(51,51,51,0.5)] px-8 py-2 font-bold text-white transition-colors duration-200 hover:bg-[#e6e6e6] hover:text-black cursor-pointer'>
                My List
              </button>
            </div>

            <h1 className='mt-2 h-20 w-180 max-w-90 text-sm leading-tight font-normal'>
              {truncate(movie.overview, 25)}
            </h1>
          </div>

          <div className='h-[7.4rem]' />
        </header>
      ))}
    </div>
  );
}

export default Banner;
