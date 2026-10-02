import MovieList from '../../components/browse/MovieList';
import Banner from '../../components/browse/Banner';
import Nav from '../../components/browse/Nav';

function Browse() {
  return (
    <div className='m-0 bg-[#111]'>
      <Nav />
      <Banner />
      <MovieList title='' category='netflixOriginals' isLargeRow />
      <MovieList title='Xu hướng' category='trending' />
      <MovieList title='Xếp hạng cao' category='topRated' />
      <MovieList title='Hành động' category='action' />
      <MovieList title='Hài' category='comedy' />
      <MovieList title='Kinh dị' category='horror' />
      <MovieList title='Lãng mạn' category='romance' />
      <MovieList title='Tài liệu' category='documentaries' />
    </div>
  );
}

export default Browse;
