import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

// Sostituisci con la tua API key
const API_KEY = "9658c510769241f68a269f4bc5ce0a55";

function CardGame({ gameData }) {
  const image = gameData.background_image || 'https://via.placeholder.com/300x200?text=No+Image';
  const genres = gameData.genres ? gameData.genres.map(genre => genre.name).join(', ') : 'N/A';

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img src={image} className="card-img-top" alt={gameData.name} style={{height: '200px', objectFit: 'cover'}} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{gameData.name}</h5>
          <p className="card-text text-muted small">{genres}</p>
          <p className="card-text"><small className="text-muted">Data di rilascio: {gameData.released}</small></p>
          <div className="mt-auto">
            <button className="btn btn-primary">Dettagli</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenrePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { genre } = useParams();

  const load = async () => {
    try {
      const genreUrl = `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genre}&page=1`;
      const response = await fetch(genreUrl);
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
  }, [genre]);

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Errore nel caricamento</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h1 className="display-5 text-primary mb-3">
            Giochi - {genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : 'Genere'}
          </h1>
          <p className="lead">
            Scopri tutti i giochi del genere {genre}
          </p>
        </div>
      </div>
      <div className="row">
        {data && data.results ? (
          data.results.map((game) => (
            <CardGame key={game.id} gameData={game} />
          ))
        ) : (
          <div className="col-12">
            <p>Nessun gioco trovato per questo genere.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenrePage;