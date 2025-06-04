import { useState, useEffect } from 'react';
import { Link } from 'react-router';

// Sostituisci con la tua API key
const API_KEY = "9658c510769241f68a269f4bc5ce0a55";
const genresUrl = `https://api.rawg.io/api/genres?key=${API_KEY}`;

function GenresDropdown() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const response = await fetch(genresUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return <span className="text-danger">Errore caricamento generi</span>;
  }

  return (
    <div className="dropdown">
      <button 
        className="nav-link dropdown-toggle" 
        type="button" 
        data-bs-toggle="dropdown"
        style={{background: 'none', border: 'none', color: 'rgba(255,255,255,.55)'}}
      >
        Generi
      </button>
      <ul className="dropdown-menu">
        {data && data.results ? (
          data.results.map((genre) => (
            <li key={genre.id}>
              <Link to={`/games/${genre.slug}`} className="dropdown-item">
                {genre.name}
              </Link>
            </li>
          ))
        ) : (
          <li><span className="dropdown-item">Caricamento generi...</span></li>
        )}
      </ul>
    </div>
  );
}

export default GenresDropdown;