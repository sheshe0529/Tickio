import React from 'react';
import { Link } from 'react-router-dom';
import './EventList.css';

export interface Evento {
  id: number;
  nombre: string;
  fecha_inicio: string;
  distrito: string;
  tipoEvento: string;
  imagen?: string;
  descripcion?: string;
}

interface EventListProps {
  eventos: Evento[];
}

const EventList: React.FC<EventListProps> = ({ eventos }) => {

  const formatDistrito = (text: string) => {
    if (!text) return "";
    if (text === "BRE_A") return "Breña";
    return text.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Asigna una imagen genérica según el tipo de evento
  const getGenericImage = (tipoEvento: string) => {
    switch (tipoEvento) {
      case 'CONCIERTO':
        return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&q=80&w=800';
      case 'DEPORTE':
        return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&q=80&w=800';
      case 'TEATRO':
        // 👇 IMAGEN CORREGIDA
        return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&q=80&w=800';
      case 'TRENDING':
        // 👇 IMAGEN CORREGIDA
        return 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&q=80&w=800';
      default:
        // 👇 IMAGEN CORREGIDA
        return 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&q=80&w=800';
    }
  };

  if (!eventos || eventos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#333', fontFamily: "'Segoe UI', 'Roboto', sans-serif"}}>
        <h3>No se encontraron eventos</h3>
        <p>Intenta cambiar los filtros de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="event-list-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px', fontFamily: "'Segoe UI', sans-serif" }}>Próximos Eventos</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {eventos.map((evento) => {
          
          // Calculamos la URL de la imagen
          const imageUrl = evento.imagen || getGenericImage(evento.tipoEvento);

          // --- 👇 AQUÍ ESTÁ EL 'RETURN' AÑADIDO ---
          return ( 
            <div key={evento.id} className="event-card" style={{ 
              display: 'flex',
              flexDirection: 'row',
              background: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              minHeight: '180px'
            }}>
              
              {/* Contenedor de Imagen (usa la variable 'imageUrl') */}
              <div style={{ 
                width: '200px',
                minWidth: '200px',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${imageUrl})`, 
                minHeight: '180px'
              }}>
                 {/* Sin texto aquí */}
              </div>

              {/* Contenedor de Texto */}
              <div style={{ 
                padding: '20px', 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.4rem', fontFamily: "'Segoe UI', sans-serif" }}>
                      {evento.nombre}
                    </h3>
                    <span style={{ 
                      background: '#e0e7ff', 
                      color: '#3730a3', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      marginLeft: '10px'
                    }}>
                      {evento.tipoEvento}
                    </span>
                  </div>
                  
                  <p style={{ margin: '5px 0', color: '#64748b', fontSize: '0.95rem', fontFamily: "'Segoe UI', sans-serif" }}>
                    <strong>Fecha:</strong> {new Date(evento.fecha_inicio).toLocaleDateString()}
                  </p>
                  
                  <p style={{ margin: '5px 0', color: '#64748b', fontSize: '0.95rem', fontFamily: "'Segoe UI', sans-serif" }}>
                    <strong>Lugar:</strong> {formatDistrito(evento.distrito)}
                  </p>
                </div>

                {/* Botón */}
                <div style={{ marginTop: '15px' }}>
                  <Link 
                    to={`/evento/${evento.id}`} 
                    style={{ 
                      display: 'block', 
                      textAlign: 'center', 
                      background: '#2563eb', 
                      color: 'white', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      textDecoration: 'none',
                      fontWeight: '600', 
                      fontSize: '1rem', 
                      width: '100%',
                      boxSizing: 'border-box',
                      transition: 'background 0.2s',
                      fontFamily: "'Segoe UI', sans-serif"
                    }}
                  >
                    Ver Entradas
                  </Link>
                </div>
              </div>
            </div>
          ); // --- Cerramos el 'return'
        })} {/* --- Cerramos el 'map' */}
      </div>
    </div>
  );
};

export default EventList;