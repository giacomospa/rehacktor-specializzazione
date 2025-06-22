import { useState, useEffect, useContext } from 'react';
import { supabase } from '../../supabase/supabase-client';
import SessionContext from '../../context/SessionContext';
import Avatar from '../../components/Avatar';

export default function AccountPage() {
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    // Solo se c'è una sessione valida
    if (session?.user?.id) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      
      // Double check della sessione
      if (!session?.user?.id) {
        return;
      }
      
      const { user } = session;

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      } else {
        // Se non esiste il profilo, crealo
        await createEmptyProfile(user.id);
      }
    } catch (error) {
      console.error('Error in getProfile:', error);
      alert('Error loading user data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createEmptyProfile = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{ id: userId }]);
      
      if (error) {
        console.error('Error creating profile:', error);
      }
    } catch (error) {
      console.error('Error in createEmptyProfile:', error);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      
      if (!session?.user?.id) {
        return;
      }
      
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Se non c'è sessione, mostra messaggio
  if (!session?.user) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert ">
          <h1>Accesso richiesto!</h1>
          <h5>Devi essere loggato per accedere alla pagina account.</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-dark text-white text-center py-4">
              <h2 className="mb-0">
                <i className="fas fa-user-circle me-2"></i>
                Il Mio Account
              </h2>
            </div>
            <div className="card-body p-5">
              
              {/* Avatar Section */}
              <div className="text-center mb-5">
                <Avatar
                  url={avatarUrl}
                  size={120}
                  onUpload={(event, url) => {
                    setAvatarUrl(url);
                    updateProfile();
                  }}
                />
                <p className="text-muted mt-2">Clicca per cambiare la tua foto profilo</p>
              </div>

              {/* Form Section */}
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="email" className="form-label fw-bold">
                    <i className="fas fa-envelope me-2 text-primary"></i>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                    className="form-control form-control-md bg-light"
                  />
                  <small className="form-text text-muted">La tua email non può essere modificata</small>
                </div>

                <div className="col-md-6 mb-4">
                  <label htmlFor="username" className="form-label fw-bold">
                    <i className="fas fa-user me-2 text-success"></i>
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control form-control-md"
                    placeholder="Inserisci il tuo username"
                  />
                </div>

                <div className="col-12 mb-4">
                  <label htmlFor="website" className="form-label fw-bold">
                    <i className="fas fa-globe me-2 text-info"></i>
                    Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="form-control form-control-md"
                    placeholder="https://tuosito.com"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <button
                  className="btn btn-primary btn-md px-5"
                  onClick={updateProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Salva Modifiche
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}