import { useState, useCallback, useEffect, useContext } from "react";
import { supabase } from "../supabase/supabase-client";
import FavoritesContext from "./FavoritesContext";
import SessionContext from "./SessionContext";

export default function FavoritesProvider({ children }) {
  const { session } = useContext(SessionContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Funzione per ottenere tutti i favoriti dell'utente
  const getFavorites = useCallback(async () => {
    if (!session?.user?.id) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      let { data: favourites, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", session.user.id);
      
      if (error) {
        console.error("Errore nel caricamento favoriti:", error);
      } else {
        setFavorites(favourites || []);
      }
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Funzione per aggiungere un gioco ai favoriti
  const addFavorites = async (game) => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from("favorites")
        .insert([
          {
            user_id: session.user.id,
            game_id: game.id,
            game_name: game.name,
            game_image: game.background_image,
            updated_at: new Date().toISOString()
          },
        ])
        .select();

      if (error) {
        console.error("Errore nell'aggiunta ai favoriti:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Errore:", error);
      return false;
    }
  };

  // Funzione per rimuovere un gioco dai favoriti
  const removeFavorite = async (gameId) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("game_id", gameId)
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Errore nella rimozione dai favoriti:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Errore:", error);
      return false;
    }
  };

  // Funzione per controllare se un gioco è nei favoriti
  const isFavorite = (gameId) => {
    return favorites.some(fav => fav.game_id === gameId);
  };

  // Effect per caricare i favoriti quando cambia la sessione
  useEffect(() => {
    if (session) {
      getFavorites();
    } else {
      setFavorites([]);
    }
  }, [getFavorites, session]);

  // Listener per i cambiamenti in tempo reale
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel("favorites")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "favorites",
          filter: `user_id=eq.${session.user.id}`
        },
        () => {
          console.log("Cambiamento nei favoriti rilevato, ricarico...");
          getFavorites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getFavorites, session]);

  const contextValue = {
    favorites,
    loading,
    getFavorites,
    addFavorites,
    removeFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}