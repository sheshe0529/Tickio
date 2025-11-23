// En Hero.tsx
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { useState, useEffect } from 'react'; // 👈 AÑADE ESTO
import { useAuth } from '../../../context/AuthContext';// 👈 AÑADE ESTO
import './Hero.css';

// Interfaz para el evento (simple)
interface EventoRecomendado {
  id: number;
  nombre: string;
  tipoEvento: string;
  imagen?: string;
}

// Función para imágenes genéricas (igual que en EventList)
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


function Hero() {
  const { user } = useAuth(); // 👈 Obtenemos al usuario
  const [recomendados, setRecomendados] = useState<EventoRecomendado[]>([]);

  // 👈 Obtenemos los eventos recomendados
  useEffect(() => {
    const fetchRecomendados = async () => {
      const usuarioId = user ? user.id : '';
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/recomendaciones?usuarioId=${usuarioId}`);
        const data = await res.json();
        setRecomendados(data);
      } catch (error) {
        console.error("Error cargando recomendaciones:", error);
      }
    };
    fetchRecomendados();
  }, [user]); // Se vuelve a ejecutar si el usuario inicia sesión

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
  };

  // Si no hay eventos, muestra un cargando o un slide estático
  if (recomendados.length === 0) {
    return (
      <div className="hero-slider-container">
        <div className="hero-slide-loading">
          <div className="hero-content">
            <h1 className="hero-title">Cargando eventos...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-slider-container">
      {/* 👈 MAPEAMOS LOS EVENTOS RECOMENDADOS */}
      <Slider {...settings}>
        {recomendados.map(evento => {
          const imageUrl = evento.imagen || getGenericImage(evento.tipoEvento);
          return (
            <div key={evento.id}>
              <div 
                className="hero-slide"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${imageUrl})` }}
              >
                <div className="hero-content">
                  <h1 className="hero-title">{evento.nombre}</h1>
                  <Link to={`/evento/${evento.id}`} className="hero-button">
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default Hero;