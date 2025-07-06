import { useState, useRef } from 'react';
import { supabase } from '../supabase/supabase-client';
import RealtimeChat from './RealtimeChat';

const Chatbox = ({ data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const realtimeChatRef = useRef(null);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!message || !message.trim()) {
        alert('Il messaggio non può essere vuoto');
        setIsSubmitting(false);
        return;
      }

      if (!data?.id) {
        alert('Errore: ID del gioco non trovato');
        setIsSubmitting(false);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Errore nel recupero utente:', userError);
        alert('Errore di autenticazione');
        setIsSubmitting(false);
        return;
      }

      if (!user) {
        alert('Devi essere autenticato per inviare messaggi');
        setIsSubmitting(false);
        return;
      }

      console.log('Utente autenticato:', user.id);
      console.log('Game ID:', data.id);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Errore nel recupero profilo:', profileError);
      }

      const messageData = {
        content: message.trim(),
        profile_id: user.id,
        profile_username: profile?.username || 'Utente Anonimo',
        game_id: parseInt(data.id)
      };

      console.log('Dati messaggio da inserire:', messageData);

      const { data: insertedMessage, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select();

      if (error) {
        console.error('Errore nell\'invio del messaggio:', error);
        alert(`Errore nell'invio del messaggio: ${error.message}`);
        return;
      }

      console.log('Messaggio inserito con successo:', insertedMessage);

      // Reset del form
      setMessage('');

      // Fallback: ricarica i messaggi se il realtime non funziona
      setTimeout(() => {
        if (realtimeChatRef.current && realtimeChatRef.current.refreshMessages) {
          realtimeChatRef.current.refreshMessages();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Errore generale:', error);
      alert('Errore nell\'invio del messaggio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header btn-details text-white">
        <h5 className="card-title mb-0">
          <i className="bi bi-chat-fill me-2"></i>
          Chat
        </h5>
      </div>
      
      <div className="card-body p-0">
        <RealtimeChat ref={realtimeChatRef} data={data} />
      </div>
      
      <div className="card-footer">
        <form onSubmit={handleMessageSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Scrivi un messaggio..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              className="btn btn-details"
              type="submit"
              disabled={isSubmitting || !message.trim()}
            >
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
              ) : (
                <i className="bi bi-send-fill"></i>
              )}
              {isSubmitting ? 'Invio...' : 'Invia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;