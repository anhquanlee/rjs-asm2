import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 z-10 flex h-15 w-full items-center justify-between px-5 py-5 transition-colors duration-500 ease-in ${
        show ? 'bg-[#111]' : 'bg-transparent'
      }`}>
      <Link to='/' className='text-2xl font-bold text-red-600 no-underline'>
        <p>Movie App</p>
      </Link>
      <Link to='/search' aria-label='Search movies'>
        <div className='flex h-7.5 w-7.5 items-center justify-center'>
          <Search
            className='pointer-events-none top-0.5 right-0 text-neutral-400'
            size={36}
            strokeWidth={4}
          />
        </div>
      </Link>
    </div>
  );
}

export default Nav;
