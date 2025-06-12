import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase-client';
import GenresDropdown from './GenresDropdown.jsx';
import Searchbar from './Searchbar.jsx'; 

function Header() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Ottieni la sessione corrente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Ascolta i cambiamenti di autenticazione
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Error logging out:', error.message);
    } else {
      console.log('Logged out successfully');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Rehacktor</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <GenresDropdown />
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">Other</Link>
            </li>
          </ul>
          <div className="ms-3 me-3">
            <Searchbar />
          </div>
        </div>
        
        {/* Conditional rendering per autenticazione */}
        {session ? (
          // Utente loggato - mostra informazioni utente e logout
          <div className="d-flex align-items-center">
            <span className="text-details me-3">
              Ciao, {session.user.user_metadata?.first_name || session.user.email}
            </span>
            <button 
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          // Utente non loggato - mostra link registrazione e login
          <div className="d-flex">
            <li className="list-unstyled me-3">
              <Link to="/register" className="text-decoration-none text-details">
                Registrati
              </Link>
            </li>
            <li className="list-unstyled">
              <Link to="/login" className="text-decoration-none text-details">
                Login
              </Link>
            </li>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;