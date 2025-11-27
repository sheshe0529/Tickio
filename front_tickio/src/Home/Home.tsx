import { useState, useEffect } from 'react';
import './Home.css';
import SearchBar from './components/SearchBar/SearchBar';
import Hero from './components/Hero/Hero';
import CategoryList from './components/CategoryList/CategoryList';
import EventList from './components/EventList/EventList';

// Definimos qué forma tiene un evento
export interface Evento {
  id: number;
  nombre: string;
  fecha_inicio: string;
  distrito: string;
  tipoEvento: string;
  imagen?: string; 
  descripcion?: string;
}

function Home() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);

  // ESTADO DE FILTROS UNIFICADO
  const [filtros, setFiltros] = useState({
    q: '',          // Texto
    distrito: '',   // Distrito
    tipo: '',        // Categoría
    fechaInicio: '', // 👈 AÑADE ESTO
    fechaFin: ''     // 👈 AÑADE ESTO
  });
  useEffect(() => {
    document.title = 'Tickio - Inicio';
  }, []);
  // 1. Se ejecuta automáticamente cuando cambia cualquier filtro
  useEffect(() => {
    buscarEventos();
  }, [filtros]);

  const buscarEventos = async () => {
    setLoading(true);
    try {
      // Construimos la URL con los parámetros
      const params = new URLSearchParams();
      if (filtros.q) params.append('q', filtros.q);
      if (filtros.distrito) params.append('distrito', filtros.distrito);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.fechaInicio) params.append('desde', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('hasta', filtros.fechaFin);
      params.append('limit', '100');
      // Llamamos a tu "Súper Buscador"
      const res = await fetch(`${import.meta.env.VITE_API_URL}/buscarEventos?${params.toString()}`);
      
      if (!res.ok) throw new Error('Error en la petición');
      const data = await res.json();

      // Asignamos los resultados (data.items es lo que devuelve tu search.ts)
      setEventos(data.items || []);
    } catch (error) {
      console.error(error);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  // --- MANEJADORES PARA LOS HIJOS ---

  // Recibe Texto y Distrito desde el SearchBar
  const handleSearchUpdate = (texto: string, distrito: string, fechaInicio: string, fechaFin: string) => {
    setFiltros(prev => ({ 
      ...prev, 
      q: texto, 
      distrito: distrito, 
      fechaInicio: fechaInicio, // 👈 AÑADE ESTO
      fechaFin: fechaFin        // 👈 AÑADE ESTO
    }));
  };

  // Recibe la Categoría desde CategoryList
  const handleCategorySelect = (categoria: string) => {
    // Si ya estaba seleccionada, la quitamos (toggle), si no, la ponemos
    setFiltros(prev => ({
      ...prev,
      tipo: prev.tipo === categoria ? '' : categoria
    }));
  };

  return (
    <div className="home-container">
      {/* Pasamos la función al SearchBar */}
      <SearchBar onSearch={handleSearchUpdate} />
      
      <Hero />
      
      {/* Pasamos la función a CategoryList */}
      <CategoryList 
          onSelectCategory={handleCategorySelect} 
          selectedCategory={filtros.tipo}  /* 👈 ¿TIENES ESTA LÍNEA? ES OBLIGATORIA */
        />
      
      {/* Mostramos resultados */}
      <div className="events-section">
        {loading ? (
          <p style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>Cargando...</p>
        ) : (
          <EventList eventos={eventos} />
        )}
      </div>
    </div>
  );
}

export default Home;