import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Browse from './pages/browse/Browse';
import Search from './pages/search/Search';
import AppContextProvider from './store/context-provider.jsx';

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Browse />} />
          <Route path='/search' element={<Search />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
