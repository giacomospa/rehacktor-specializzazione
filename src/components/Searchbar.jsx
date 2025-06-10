// src/components/Searchbar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Naviga alla pagina di ricerca con il query string
      navigate(`/search?game=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Cerca un gioco..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button 
        type="submit" 
        className="btn btn-outline-light"
        disabled={!searchTerm.trim()}
      >
        Cerca
      </button>
    </form>
  );
}