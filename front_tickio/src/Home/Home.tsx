import './Home.css';

// 1. Importa el componente Hero que creamos
import Hero from './components/Hero';

// (Aquí luego importaremos CategoryList y EventList)

function Home() {
  return (
    <div className="home-container">
      {/* 2. Reemplazamos el texto feo por el componente real */}
      <Hero />

      {/* (Aquí pondremos las otras piezas luego) */}
    </div>
  );
}

export default Home;