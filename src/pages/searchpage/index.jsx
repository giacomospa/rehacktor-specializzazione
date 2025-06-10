// src/pages/searchpage/index.jsx
import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import useFetchSolution from '../../hooks/useFetchSolution';

const API_KEY = "9658c510769241f68a269f4bc5ce0a55";

function CardGame({ gameData }) {
  const image = gameData.background_image || 'https://via.placeholder.com/300x200?text=No+Image';
  
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100">
        <img src={image} className="card-img-top" alt={gameData.name} />
        <div className="card-body">
          <h5 className="card-title">{gameData.name}</h5>
          <p className="card-text text-black">
            Rating: {gameData.rating}/5 <br />
            Released: {gameData.released}
          </p>
          <a href={`/game/${gameData.id}`} className="btn btn-details">
            Dettagli
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('game');
  
  const searchUrl = searchTerm 
    ? `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(searchTerm)}`
    : null;
  
  const { data, error, updateUrl } = useFetchSolution(searchUrl);

  useEffect(() => {
    if (searchTerm && searchUrl) {
      updateUrl(searchUrl);
    }
  }, [searchTerm, searchUrl, updateUrl]);

  if (!searchTerm) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Ricerca Giochi</h1>
            <p>Usa la barra di ricerca per trovare i tuoi giochi preferiti!</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              <h4>Errore nella ricerca</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const games = data?.results || [];

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>Risultati per: "{searchTerm}"</h1>
          <p>Trovati {games.length} giochi</p>
        </div>
      </div>
      
      {games.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="alert text-red">
              <h4>Nessun risultato trovato</h4>
              <p>Prova con un termine di ricerca diverso.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {games.map(game => (
            <CardGame key={game.id} gameData={game} />
          ))}
        </div>
      )}
    </div>
  );
}