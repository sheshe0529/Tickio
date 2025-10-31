import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // 1. Importamos el Slider
import './Hero.css';

// --- FIN DE LAS FLECHAS ---

function Hero() {

  // 2. Definimos los "ajustes" del carrusel
  const settings = {
    dots: false,        // Sin puntitos abajo
    infinite: true,     // Que sea un loop infinito
    speed: 500,         // Velocidad de transición
    slidesToShow: 1,    // Muestra 1 slide a la vez
    slidesToScroll: 1,  // Pasa 1 slide a la vez
    autoplay: true,     // (Opcional) Que se mueva solo
    arrows: true,       // ¡Queremos las flechas! (como en tu foto)
  };

  return (
    <div className="hero-slider-container">
      <Slider {...settings}>

        {/* --- Slide 1 --- */}
        <div className="hero-slide">
          {/* (La imagen de fondo la pondremos con CSS) */}
          <div className="hero-content">
            <h1 className="hero-title">
              Musica musical para todos
            </h1>
            <Link to="/eventos" className="hero-button">
              Ver más
            </Link>
          </div>
        </div>

        {/* --- Slide 2 (Ejemplo) --- */}
        <div className="hero-slide-2">
          {/* (Le ponemos otra clase para poner otra imagen de fondo) */}
          <div className="hero-content">
            <h1 className="hero-title">
              Los mejores eventos deportivos
            </h1>
            <Link to="/categoria/deportes" className="hero-button">
              Ver más
            </Link>
          </div>
        </div>

      </Slider>
    </div>
  );
}

export default Hero;