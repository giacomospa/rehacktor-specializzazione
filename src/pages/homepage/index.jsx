import { Link } from 'react-router';
import useFetchSolution from '../../hooks/useFetchSolution';

const API_KEY = "9658c510769241f68a269f4bc5ce0a55";
const initialUrl = `https://api.rawg.io/api/games?key=${API_KEY}&dates=2024-01-01,2024-12-31&page=1`;

function CardGame({ gameData }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img 
          src={gameData.background_image}
          className="card-img-top"
          alt={gameData.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{gameData.name}</h5>
          <p className="card-text flex-grow-1">
            <small className="text-muted">
              Rilasciato: {gameData.released}
            </small>
          </p>
          <div className="mb-2">
            <span className="badge bg-warning me-1">
              Rating: {gameData.rating}
            </span>
            <span className="badge bg-secondary">
              {gameData.playtime}h di gioco
            </span>
          </div>
          <div className="mb-3">
            {gameData.genres && gameData.genres.slice(0, 2).map(genre => (
              <span key={genre.id} className="badge bg-secondary me-1">
                {genre.name}
              </span>
            ))}
          </div>
          <Link 
            to={`/games/${gameData.slug}/${gameData.id}`} 
            className="btn btn-details mt-auto"
          >
            Vedi dettagli
          </Link>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const { data, loading, error } = useFetchSolution(initialUrl);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h1 className="display-5 text-center mb-3">Giochi del 2024</h1>
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
        {data && data.results && data.results.map(game => (
          <CardGame key={game.id} gameData={game} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;