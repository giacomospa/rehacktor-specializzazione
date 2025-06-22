import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from '../layout/Layout';
import HomePage from '../pages/homepage';
import ErrorPage from '../pages/error/index.jsx';
import GenrePage from '../pages/genrepage';
import GamePage from '../pages/gamepage';
import SearchPage from '../pages/searchpage';
import RegisterPage from '../pages/register';
import LoginPage from '../pages/login';
import AccountPage from '../pages/account';

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/games/:genre" element={<GenrePage />} />
          <Route path="/games/:slug/:id" element={<GamePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />}/>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;