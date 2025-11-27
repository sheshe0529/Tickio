import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './EventDetail.css';

// 1. 👈 Importamos el nuevo ícono para la duración
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaHourglassHalf } from 'react-icons/fa';
import TicketSelector from './components/TicketSelector/TicketSelector';

const getGenericImage = (tipoEvento?: string) => {
  switch (tipoEvento) {
    case 'CONCIERTO':
      return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&q=80&w=1920&h=1080&fit=crop';
    case 'DEPORTE':
      return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&q=80&w=1920&h=1080&fit=crop';
    case 'TEATRO':
      return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&q=80&w=1920&h=1080&fit=crop';
    case 'TRENDING':
      return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&q=80&w=1920&h=1080&fit=crop';
    default:
      return 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&q=80&w=1920&h=1080&fit=crop';
  }
};

// 2. 👈 Actualizamos la Interfaz para incluir la 'duracion'
interface TipoTicket {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface EventoDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: number;
  duracion: number; 
  distrito: string;
  direccion: string;
  tipoEvento: string; // 👈 NECESITAMOS ESTE CAMPO
  tipoTickets: TipoTicket[];
  imagen?: string; // (Lo dejamos por si en el futuro sí usas el schema)
}

function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cartItems } = useCart(); 
  const [event, setEvent] = useState<EventoDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (event) {
        document.title = `Tickio - ${event.nombre}`;
      } else {
        document.title = 'Tickio - Detalle del Evento';
      }
    }, [event]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // Asumimos que esta ruta devuelve el evento completo, incluyendo 'tipoEvento'
        const res = await fetch(`${import.meta.env.VITE_API_URL}/eventos/${id}`); 
        if (!res.ok) {
          throw new Error('Evento no encontrado');
        }
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error(error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // --- Funciones de Formato ---

  const formatDistrito = (text: string) => {
    if (!text) return "";
    if (text === "BRE_A") return "Breña";
    return text.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const formatTime = (time: number) => {
    // Asumiendo que 'hora_inicio' es la hora (ej: 19)
    return `${time}:00`; 
  };
  
  // 3. 👈 Nueva función para convertir minutos a horas/minutos
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    let result = '';
    if (h > 0) result += `${h} ${h > 1 ? 'horas' : 'hora'} `;
    if (m > 0) result += `${m} minutos`;
    return result.trim();
  };

  // --- Renderizado ---
  if (loading) {
    return <div className="event-detail-page"><h2>Cargando evento...</h2></div>;
  }

  if (!event) {
    return <div className="event-detail-page"><h2>Evento no encontrado</h2></div>;
  }

  // 4. 👈 Preparamos la URL para el mapa
  const mapQuery = `${event.direccion}, ${formatDistrito(event.distrito)}, Lima, Peru`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const imageUrl = event.imagen || getGenericImage(event.tipoEvento);
  return (
    <div className="event-detail-page">
      <div className="back-button-container">
        <Link to="/" className="back-button">&larr; Volver</Link>
      </div>
      <div className="event-header-image" style={{ backgroundImage: `url(${imageUrl})` }}>
      </div>
      <div className="event-detail-container">
        {/* --- COLUMNA IZQUIERDA --- */}
        <div className="event-detail-left">
          <div className="location-card">
            <h3><FaMapMarkerAlt /> Ubicación</h3>
            <p>{event.direccion}</p>
            <p><strong>{formatDistrito(event.distrito)}</strong>, Lima</p>
            
            <iframe
              src={`https://maps.google.com/maps?q=$${encodeURIComponent(event.direccion + ', ' + event.distrito)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '8px', marginTop: '1rem' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* --- COLUMNA DERECHA --- */}
        <div className="event-detail-right">
          <h2>{event.nombre}</h2>

          {/* 6. 👈 Añadimos la duración formateada */}
          <div className="event-info">
            <span><FaCalendarAlt /> {formatDate(event.fecha_inicio)}</span>
            <span><FaClock /> {formatTime(event.hora_inicio)}</span>
            <span><FaHourglassHalf /> {formatDuration(event.duracion)}</span>
          </div>

          <div className="event-description">
            <h3>Descripción</h3>
            <p>{event.descripcion}</p>
          </div>

          <div className="ticket-zones">
            <h3>Zonas del estadio</h3>
            {event.tipoTickets.map((ticket) => (
              <TicketSelector 
                key={ticket.id} 
                ticket={ticket} 
                evento={{ id: event.id, nombre: event.nombre }}
              />
            ))}
          </div>

          {cartItems.length > 0 && (
            <button className="cart-button-main" onClick={() => navigate('/carrito')}>
              Ir al carrito ({cartItems.length} tipos)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;