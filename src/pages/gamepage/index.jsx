import { useParams } from 'react-router';
import { useEffect } from 'react';
import useFetchSolution from '../../hooks/useFetchSolution';
import ToggleFavorite from '../../components/ToggleFavorite';
import Chatbox from '../../components/Chatbox';


const API_KEY = "9658c510769241f68a269f4bc5ce0a55";

function GamePage() {
  const { id } = useParams();
  const initialUrl = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`;
  const { data, loading, error, updateUrl } = useFetchSolution(initialUrl);
  
  useEffect(() => {
    if (id) {
      const newUrl = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`;
      updateUrl(newUrl);
    }
  }, [id, updateUrl]);
  
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
  
  if (!data) {
    return null;
  }
  
  const image = data.background_image || 'https://via.placeholder.com/800x400?text=No+Image';
  const genres = data.genres ? data.genres.map(genre => genre.name).join(', ') : 'N/A';
  const platforms = data.platforms ? data.platforms.map(p => p.platform.name).join(', ') : 'N/A';
  
  return (
    <div className="container py-5">
    <div className="row">
    <div className="col-lg-8">
    <img src={image} className="img-fluid rounded mb-4" alt={data.name} />
    </div>
    <div className="col-lg-4 textwhite">
    <div className="d-flex justify-content-between align-items-start mb-3">
    <h1 className="display-5 mb-0">{data.name}</h1>
    <ToggleFavorite game={data} />
    </div>
    
    <div className="mb-3">
    <strong>Data di rilascio:</strong> {data.released || 'Non disponibile'}
    </div>
    
    <div className="mb-3">
    <strong>Generi:</strong> {genres}
    </div>
    
    <div className="mb-3">
    <strong>Piattaforme:</strong> {platforms}
    </div>
    
    <div className="mb-3">
    <strong>Valutazione:</strong> {data.rating || 'N/A'}/5
    </div>
    </div>
    </div>
    
    {data.description_raw && (
      <div className="row mt-4">
      <div className="col-12">
      <h3>Descrizione</h3>
      <p className="lead">{data.description_raw}</p>
      </div>
      </div>
    )}
    
    <div className="style-chatbox">
    <Chatbox data={data && data} />
    </div>
    </div>
  );
}

export default GamePage;