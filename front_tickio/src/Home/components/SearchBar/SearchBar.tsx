import { useState } from 'react';
import './SearchBar.css';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'; // Importamos íconos

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [district, setDistrict] = useState('');

  return (
    <div className="search-bar-container">
      {/* --- Input de Búsqueda Principal --- */}
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Busca por evento, artista o lugar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- Input de Distrito --- */}
      <div className="search-input-wrapper">
        <FaMapMarkerAlt className="search-icon" />
        <input
          type="text"
          placeholder="Distrito"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
        {/* (Más adelante, esto podría ser un <select> o un autocompletar) */}
      </div>
    </div>
  );
}

export default SearchBar;