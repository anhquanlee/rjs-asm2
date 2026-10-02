import { Search } from 'lucide-react';

const SearchForm = ({ searchValue, onInputChange, onSearch, onReset }) => {
  return (
    <div className='mx-auto mb-8 max-w-197.5 px-4 pt-24'>
      <form className='rounded-lg bg-white px-6 pt-6 pb-4' onSubmit={onSearch}>
        <div className='relative mb-6'>
          <input
            type='text'
            placeholder='Type Keywords'
            onChange={(e) => onInputChange(e.target.value)}
            value={searchValue}
            className='w-full border-b-2 border-neutral-300 pr-8 pb-2 text-[#555] outline-none focus:border-[#00bbec]'
          />
          <Search
            className='pointer-events-none absolute top-0.5 right-0 text-neutral-400'
            size={24}
            strokeWidth={4}
          />
        </div>

        <div className='flex justify-end gap-6'>
          <button
            className='text-sm font-bold tracking-wide text-black hover:text-neutral-700'
            onClick={onReset}
            type='button'>
            RESET
          </button>
          <button
            className='rounded bg-[#00bbec] px-6 py-2 text-sm font-bold text-white hover:bg-[#00a7d3]'
            type='submit'>
            SEARCH
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
