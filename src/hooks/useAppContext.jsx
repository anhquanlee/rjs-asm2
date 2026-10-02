import { useContext } from 'react';
import { AppContext } from '../store/context-provider';

function useAppContext() {
  const ctx = useContext(AppContext);
  if (ctx === null) {
    throw new Error('useAppContext must be used in AppContextProvider');
  }
  return ctx;
}

export default useAppContext;
