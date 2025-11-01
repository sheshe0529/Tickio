import { Link } from 'react-router-dom';
import './EventList.css';
import { FaFilter } from 'react-icons/fa'; // Importamos el ícono de filtro

// (En el futuro, esta 'data' vendrá de tu API)
const events = [
  {
    id: 1,
    date: 'Aug 13',
    day: 'Sun',
    time: '10:00am',
    title: 'Elements Music and Arts Festival - Sunday',
    location: 'Pocono Raceway',
    image: '/events/event1.png' // Pon tus imágenes en 'public/events/'
  },
  {
    id: 2,
    date: 'Aug 13',
    day: 'Sun',
    time: '11:00am',
    title: 'Orange County Fair - Admission',
    location: 'Orange County Fair and Event Center',
    image: '/events/event2.png'
  },
  {
    id: 3,
    date: 'Oct 31',
    day: 'Fri',
    time: '5:00pm',
    title: 'La casa de los brainrots',
    location: 'Jr Yanacocha 1234, Lima',
    image: '/events/event3.jpeg'
  },
];

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
        {events.map((event) => (
          <div key={event.id} className="event-card">
            {/* --- Imagen --- */}
            <img
              src={event.image}
              alt={event.title}
              className="event-card-img"
            />

            {/* --- Info del Evento --- */}
            <div className="event-card-info">
              <span className="event-date">{event.date}</span>
              <span className="event-day-time">{event.day} • {event.time}</span>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-location">{event.location}</p>
            </div>

            {/* --- Botones --- */}
            <div className="event-card-buttons">
              <Link to="/carrito" className="event-btn-details">
                Ver detalles
              </Link>
              <Link to="/carrito" className="event-btn-book">
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