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
      
      {/* 1. CAMBIO: Usamos Flex Column en lugar de Grid para hacer una lista hacia abajo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {eventos.map((evento) => (
          <div key={evento.id} className="event-card" style={{ 
            display: 'flex',           /* 2. CAMBIO: La tarjeta ahora es horizontal (Flex) */
            flexDirection: 'row',      /* Imagen a la izquierda, texto a la derecha */
            background: 'white', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minHeight: '180px'         /* Altura mínima para consistencia */
          }}>
            
            {/* 3. CAMBIO: Contenedor de Imagen con ancho fijo */}
            <div style={{ 
              width: '200px',          /* Ancho fijo para la imagen */
              minWidth: '200px',       /* Evita que se aplaste */
              background: '#cbd5e1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#64748b'
            }}>
               {/* <img src={evento.imagen} ... /> */}
               <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Imagen</span>
            </div>

            {/* 4. CAMBIO: Contenedor de Texto que ocupa el espacio restante (flex: 1) */}
            <div style={{ 
              padding: '20px', 
              flex: 1,                 /* Ocupa todo el ancho que sobra */
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between' /* Empuja el botón hacia abajo */
            }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.4rem', fontFamily: "'Segoe UI', sans-serif" }}>
                    {evento.nombre}
                  </h3>
                  {/* Badge de Tipo de Evento */}
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

              {/* 5. CAMBIO: El botón ocupa el 100% del ancho de su contenedor padre */}
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
                    width: '100%',         /* Se estira al máximo */
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
        ))}
      </div>
    </div>
  );
};

export default EventList;