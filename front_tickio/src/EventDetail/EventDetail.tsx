import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './EventDetail.css';

// (Importaremos los íconos)
import { FaCalendar, FaClock, FaMap, FaMapMarkerAlt } from 'react-icons/fa';
import { fakeEventData } from '../data/mockData';

import TicketSelector from './components/TicketSelector/TicketSelector';

function EventDetail() {
  const { id } = useParams(); // Leemos el ID (ej: "3")

  // 2. Creamos un "estado" para guardar el evento que encontremos
  const [event, setEvent] = useState<any>(null); // (Usamos 'any' por ahora)

  // 3. Este "efecto" se ejecuta CADA VEZ que el 'id' de la URL cambia
  useEffect(() => {
    // Buscamos en nuestra base de datos falsa el evento con ese id
    const foundEvent = fakeEventData.find(e => e.id === id);

    if (foundEvent) {
      setEvent(foundEvent); // ¡Lo encontramos! Lo guardamos en el estado
    } else {
      // (En el futuro, aquí redirigiríamos a una página de "No Encontrado")
      console.log("¡Evento no encontrado!");
      setEvent(null);
    }
  }, [id]); // El [id] le dice que se ejecute de nuevo si el ID cambia

  // 4. Mostramos un "Cargando..." si aún no lo encontramos
  if (!event) {
    return (
      <div className="event-detail-page">
        <Link to="/" className="back-button">&larr; Volver</Link>
        <h2>Cargando evento... (o no encontrado)</h2>
      </div>
    );
  }

  // 5. ¡AHORA SÍ! Reemplazamos el texto "a fuego" por el del 'event'
  return (
    <div className="event-detail-page">
      <Link to="/" className="back-button">
        &larr; Volver
      </Link>

      <div className="event-detail-container">
        {/* --- COLUMNA IZQUIERDA (DINÁMICA) --- */}
        <div className="event-detail-left">
          <img
            src={event.mainImage}
            alt={event.title}
            className="event-main-image"
          />
          <div className="location-card">
            <div className="location-header">
              <FaMap />
              <h3>Ubicación</h3>
            </div>

            {/* --- NUEVA ESTRUCTURA PARA LA DIRECCIÓN --- */}
            <div className="location-address">
              <FaMapMarkerAlt />
              <p>{event.location}</p>
            </div>

            <img
              src={event.mapImage}
              alt="Mapa del Estadio"
              className="stadium-map-image"
            />
          </div>
        </div>

        {/* --- COLUMNA DERECHA (DINÁMICA) --- */}
        <div className="event-detail-right">
          <h2>{event.title}</h2>

          <div className="event-info">
            <span><FaCalendar /> {event.date}</span>
            <span><FaClock /> {event.time}</span>
          </div>

          <div className="event-description">
            <h3>Descripción</h3>
            <p>{event.description}</p>
          </div>

          <div className="ticket-zones">
            <h3>Zonas del estadio</h3>

            {/* Reemplazamos el <p> por un .map() */}
            {event.zones.map((zone: any) => (
              <TicketSelector key={zone.id} zone={zone} />
            ))}

          </div>

          <button className="cart-button">
            Ir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;