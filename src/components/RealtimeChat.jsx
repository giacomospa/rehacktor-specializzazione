import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { supabase } from '../supabase/supabase-client';

const RealtimeChat = forwardRef(({ data }, ref) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Funzione per ottenere i messaggi iniziali
  const getInitialMessages = async () => {
    try {
      console.log('Caricamento messaggi per game_id:', data?.id);
      
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('game_id', data.id)
        .order('updated_at', { ascending: true });

      if (error) {
        console.error('Errore nel recupero dei messaggi:', error);
      } else {
        console.log('Messaggi caricati:', messagesData);
        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error('Errore generale nel recupero dei messaggi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Esponi il metodo refreshMessages al componente padre
  useImperativeHandle(ref, () => ({
    refreshMessages: () => {
      console.log('Ricaricamento manuale dei messaggi...');
      getInitialMessages();
    }
  }));

  // Funzione per lo scroll automatico
  const scrollSmoothToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Funzione per formattare la data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ottieni l'utente corrente
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      console.log('Utente corrente:', user);
    };
    
    getCurrentUser();
  }, []);

  // Carica i messaggi iniziali
  useEffect(() => {
    if (data?.id) {
      getInitialMessages();
    }
  }, [data?.id]);

  // Sottoscrizione al canale realtime
  useEffect(() => {
    if (!data?.id) return;

    console.log('Sottoscrizione al canale realtime per game_id:', data.id);

    const channel = supabase
      .channel(`messages:game_id=eq.${data.id}`, {
        config: {
          broadcast: { self: true }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `game_id=eq.${data.id}`
        },
        (payload) => {
          console.log('Realtime update ricevuto:', payload);
          
          if (payload.eventType === 'INSERT') {
            console.log('Nuovo messaggio inserito:', payload.new);
            setMessages(prev => {
              const exists = prev.some(msg => msg.id === payload.new.id);
              if (exists) return prev;
              return [...prev, payload.new];
            });
          } else if (payload.eventType === 'DELETE') {
            console.log('Messaggio eliminato:', payload.old);
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            console.log('Messaggio aggiornato:', payload.new);
            setMessages(prev =>
              prev.map(msg =>
                msg.id === payload.new.id ? payload.new : msg
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Stato sottoscrizione realtime:', status);
      });

    return () => {
      console.log('Rimozione sottoscrizione realtime');
      supabase.removeChannel(channel);
    };
  }, [data?.id]);

  // Scroll automatico quando arrivano nuovi messaggi
  useEffect(() => {
    scrollSmoothToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '350px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded" style={{ height: '350px', overflowY: 'auto' }}>
      {messages.length === 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
          <i className="bi bi-chat-dots fs-1 mb-2"></i>
          <p className="mb-0">Nessun messaggio</p>
        </div>
      ) : (
        <div className="p-3">
          {messages.map((message) => {
            const isCurrentUser = message.profile_id === currentUser?.id;
            return (
              <div
                key={message.id}
                className={`d-flex mb-3 ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div className="w-75">
                  <div className={`p-3 rounded ${isCurrentUser ? 'bg-primary text-white' : 'bg-light'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className={`fw-bold ${isCurrentUser ? 'text-white-50' : 'text-muted'}`}>
                        {message.profile_username || 'Utente'}
                      </small>
                      <small className={`${isCurrentUser ? 'text-white-50' : 'text-muted'}`}>
                        {formatDate(message.updated_at)}
                      </small>
                    </div>
                    <div>{message.content}</div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
});

export default RealtimeChat;