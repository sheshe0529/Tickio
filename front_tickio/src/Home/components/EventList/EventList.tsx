import { Link } from 'react-router-dom';
import './EventList.css';
import { FaFilter } from 'react-icons/fa'; // Importamos el ícono de filtro

// (En el futuro, esta 'data' vendrá de tu API)

import { fakeEventData } from '../../../data/mockData';

function EventList() {
  return (
    <div className="event-list-container">
      {/* --- Fila del Título --- */}
      <div className="event-list-header">
        <h2>Top Eventos Según Tu Ubicación</h2>
        <button className="event-filter-button">
          <FaFilter /> Filter
        </button>
      </div>

      {/* --- Contenedor de las Tarjetas de Evento --- */}
      <div className="event-cards-wrapper">
        {fakeEventData.map((event) => (
          <div key={event.id} className="event-card">
            {/* --- Imagen --- */}
            <img
              src={event.mainImage}
              alt={event.title}
              className="event-card-img"
            />

            {/* --- Info del Evento --- */}
            <div className="event-card-info">
              <span className="event-date">{event.date}</span>
              <span className="event-day-time">{event.time}</span>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-location">{event.location}</p>
            </div>

            {/* --- Botones --- */}
            <div className="event-card-buttons">
              <Link to={`/evento/${event.id}`} className="event-btn-details">
                Ver detalles
              </Link>
              <Link to={`/comprar/${event.id}`} className="event-btn-book">
                Reservar ahora
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* --- Botón "Show More" --- */}
      <button className="event-show-more">
        Ver más
      </button>
    </div>
  );
}

export default EventList;