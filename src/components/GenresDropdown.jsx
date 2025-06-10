import { useState } from 'react';
import { Link } from 'react-router';
import useFetchSolution from '../hooks/useFetchSolution';

const API_KEY = "9658c510769241f68a269f4bc5ce0a55";
const initialUrl = `https://api.rawg.io/api/genres?key=${API_KEY}`;

function GenresDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, error } = useFetchSolution(initialUrl);

  return (
    <li className="nav-item dropdown">
      <div className="dropdown" style={{position: 'relative'}}>
        <button 
          className="nav-link dropdown-toggle" 
          type="button"
          style={{background: 'none', border: 'none', color: 'rgba(255,255,255,.55)'}}
          onClick={() => setIsOpen(!isOpen)}
        >
          Generi
        </button>
        {isOpen && (
          <ul 
            className="dropdown-menu show" 
            style={{
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              zIndex: 1000,
              minWidth: '200px'
            }}
          >
            {error && (
              <li><span className="dropdown-item text-danger">Errore caricamento</span></li>
            )}
            {data && data.results ? (
              data.results.map((genre) => (
                <li key={genre.id}>
                  <Link 
                    to={`/games/${genre.slug}`} 
                    className="dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    {genre.name}
                  </Link>
                </li>
              ))
            ) : (
              !loading && !error && (
                <li><span className="dropdown-item">Nessun genere disponibile</span></li>
              )
            )}
          </ul>
        )}
      </div>
    </li>
  );
}

export default GenresDropdown;

