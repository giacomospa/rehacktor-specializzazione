import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from '../layout/Layout';
import HomePage from '../pages/homepage';
import ErrorPage from '../pages/error/index.jsx';
import GenrePage from '../pages/genrepage';
import GamePage from '../pages/gamepage';

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/games/:genre" element={<GenrePage />} />
          <Route path="/games/:slug/:id" element={<GamePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;

