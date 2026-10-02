import YouTube from 'react-youtube';

const opts = {
  height: '400',
  width: '100%',
  playerVars: {
    autoplay: 0,
  },
};

const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const MovieDetail = ({ movieTrailer, noTrailer, movieData }) => {
  const {
    release_date,
    first_air_date,
    title,
    name,
    overview,
    vote_average,
    backdrop_path,
  } = movieData;

  const releaseDate = release_date || first_air_date || 'N/A';
  const vote = Number.isFinite(vote_average) ? vote_average.toFixed(1) : 'N/A';

  return (
    <div className='grid grid-cols-2 text-white'>
      <div className='pr-8'>
        <h1 className='font-[Arial] text-3xl font-bold'>{title || name}</h1>
        <hr className='my-5 border-2 border-neutral-400' />

        <h3 className='text-xl font-semibold'>Release Date: {releaseDate}</h3>
        <h3 className='text-xl font-semibold'>Vote: {vote} / 10</h3>
        <br />
        <p>{overview}</p>
      </div>

      <div>
        {movieTrailer && (
          <YouTube key={movieTrailer} videoId={movieTrailer} opts={opts} />
        )}

        {!movieTrailer && noTrailer && backdrop_path && (
          <img
            src={`${BACKDROP_BASE_URL}${backdrop_path}`}
            alt={title || name}
            className='h-100 w-full rounded-md object-cover'
          />
        )}

        {!movieTrailer && noTrailer && !backdrop_path && (
          <p className='flex h-100 items-center justify-center text-sm text-neutral-400'>
            Không tìm thấy trailer cho phim này
          </p>
        )}

        {!movieTrailer && !noTrailer && (
          <p className='flex h-100 items-center justify-center text-sm text-neutral-400'>
            Đang tải trailer...
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
