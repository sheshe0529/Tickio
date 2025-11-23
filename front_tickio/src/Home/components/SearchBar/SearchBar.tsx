import React, { useState, useEffect } from 'react';
import './SearchBar.css'; // Asegúrate de tener tu CSS

interface SearchBarProps {
  onSearch: (texto: string, distrito: string, fechaInicio: string, fechaFin: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [texto, setTexto] = useState('');
  const [distrito, setDistrito] = useState('');
  const [listaDistritos, setListaDistritos] = useState<string[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Cargar la lista de distritos para el select
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/distritos`)
      .then(res => res.json())
      .then(data => setListaDistritos(data))
      .catch(err => console.error(err));
  }, []);

  // Manejar cambio de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTexto(e.target.value);
  };
  const handleDistritoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDistrito(val);
    onSearch(texto, val, fechaInicio, fechaFin); // Envía los 4
  };
  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFechaInicio(val);
    onSearch(texto, distrito, val, fechaFin); // Envía los 4
  };
  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFechaFin(val);
    onSearch(texto, distrito, fechaInicio, val); // Envía los 4
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(texto, distrito, fechaInicio, fechaFin); // Envía los 4
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
        
        <input
            type="date"
            placeholder="Desde"
            value={fechaInicio}
            onChange={handleFechaInicioChange}
            className="search-input date-input"
            style={{borderLeft: '1px solid #e0e0e0', paddingLeft: '10px'}}
        />
        <input
            type="date"
            placeholder="Hasta"
            value={fechaFin}
            onChange={handleFechaFinChange}
            className="search-input date-input"
            style={{borderLeft: '1px solid #e0e0e0', paddingLeft: '10px'}}
        />

        <button type="submit" className="search-button">Buscar</button>
      </form>
    </div>
  );
};

export default SearchBar;