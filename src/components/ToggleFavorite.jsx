import { useState, useContext, useEffect } from 'react';
import { supabase } from '../supabase/supabase-client';
import SessionContext from '../context/SessionContext';

export default function ToggleFavorite({ game }) {
  const { session } = useContext(SessionContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Controlla se il gioco è già nei favoriti
  useEffect(() => {
    if (session && game) {
      checkIfFavorite();
    }
  }, [session, game]);

  const checkIfFavorite = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('game_id', game.id)
        .single();

      if (data) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      setIsFavorite(false);
    }
  };

  const addToFavorites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: session.user.id,
            game_id: game.id,
            game_name: game.name,
            game_image: game.background_image,
            updated_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Errore nell\'aggiunta ai favoriti:', error);
        alert('Errore nell\'aggiunta ai favoriti');
      } else {
        setIsFavorite(true);
        console.log('Gioco aggiunto ai favoriti!', data);
      }
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('game_id', game.id)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Errore nella rimozione dai favoriti:', error);
        alert('Errore nella rimozione dai favoriti');
      } else {
        setIsFavorite(false);
        console.log('Gioco rimosso dai favoriti!');
      }
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!session) {
      alert('Devi essere loggato per aggiungere ai favoriti');
      return;
    }

    if (isFavorite) {
      removeFromFavorites();
    } else {
      addToFavorites();
    }
  };

  // Se l'utente non è loggato, non mostrare il bottone
  if (!session) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-light'} btn-sm`}
      title={isFavorite ? 'Rimuovi dai favoriti' : 'Aggiungi ai favoriti'}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ) : (
        <>
          {isFavorite ? '❤️' : '🤍'} {isFavorite ? 'Rimuovi' : 'Aggiungi'}
        </>
      )}
    </button>
  );
}