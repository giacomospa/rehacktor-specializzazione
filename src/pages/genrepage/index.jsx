import { useParams, Link } from 'react-router';
import { useEffect } from 'react';
import useFetchSolution from '../../hooks/useFetchSolution';

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
            <Link 
              to={`/games/${gameData.slug}/${gameData.id}`} 
              className="btn btn-details"
            >
              Vedi dettagli
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenrePage() {
  const { genre } = useParams();
  const initialUrl = `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genre}&page=1`;
  const { data, loading, error, updateUrl } = useFetchSolution(initialUrl);

  useEffect(() => {
    if (genre) {
      const newUrl = `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genre}&page=1`;
      updateUrl(newUrl);
    }
  }, [genre, updateUrl]);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h1 className="display-5 mb-3">
            Giochi - {genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : 'Genere'}
          </h1>
          <p className="lead">
            Scopri tutti i giochi del genere {genre}
          </p>
        </div>
      </div>

      {error && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              <h4>Errore nel caricamento</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {data && data.results ? (
          data.results.map((game) => (
            <CardGame key={game.id} gameData={game} />
          ))
        ) : (
          !loading && !error && (
            <div className="col-12">
              <p>Nessun gioco trovato per questo genere.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default GenrePage;