function AutoScrollRow({
  children,
  enabled = true,
  paused = false,
  direction = 'left',
  duration,
}) {
  if (!enabled) {
    return <div className='movie-manual-scroll'>{children}</div>;
  }

  const directionClass =
    direction === 'right' ? 'movie-scroll-right' : 'movie-scroll-left';

  return (
    <div className='movie-scroll-viewport'>
      <div
        className={`movie-scroll-track ${directionClass} ${
          paused ? 'movie-scroll-paused' : ''
        }`}
        style={{
          '--movie-scroll-duration': `${duration}s`,
        }}>
        <div className='movie-scroll-group'>{children}</div>

        <div className='movie-scroll-group' aria-hidden='true'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AutoScrollRow;
