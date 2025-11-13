import React, { useState, useEffect } from 'react';
import './SearchBar.css'; // Asegúrate de tener tu CSS

interface SearchBarProps {
  onSearch: (texto: string, distrito: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [texto, setTexto] = useState('');
  const [distrito, setDistrito] = useState('');
  const [listaDistritos, setListaDistritos] = useState<string[]>([]);

  // Cargar la lista de distritos para el select
  useEffect(() => {
    fetch('http://localhost:3000/distritos')
      .then(res => res.json())
      .then(data => setListaDistritos(data))
      .catch(err => console.error(err));
  }, []);

  // Manejar cambio de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTexto(val);
    // Opcional: Si quieres búsqueda en tiempo real, descomenta:
    // onSearch(val, distrito);
  };

  // Manejar cambio de distrito
  const handleDistritoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDistrito(val);
    onSearch(texto, val); // Buscamos inmediatamente al cambiar distrito
  };

  // Manejar botón "Buscar" o Enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(texto, distrito);
  };

  // Función estética
const formatEnum = (text: string) => {
    if (!text) return "";
    
    // 1. Caso especial para Breña (que suele venir como BRE_A)
    if (text === "BRE_A" || text === "Bre A") return "Breña";

    // 2. Reemplaza guiones bajos por espacios y pone Mayúscula Inicial
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };
  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <input 
          type="text" 
          placeholder="Buscar evento..." 
          value={texto}
          onChange={handleTextChange}
          className="search-input"
        />
        
        <select 
          value={distrito} 
          onChange={handleDistritoChange}
          className="search-select"
        >
          <option value="">Todos los Distritos</option>
          {listaDistritos.map(d => (
            <option key={d} value={d}>{formatEnum(d)}</option>
          ))}
        </select>

        <button type="submit" className="search-button">Buscar</button>
      </form>
    </div>
  );
};

export default SearchBar;