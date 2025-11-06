import './Home.css';

// 1. Importa el componente Hero que creamos
import SearchBar from './components/SearchBar/SearchBar';
import Hero from './components/Hero/Hero';
import CategoryList from './components/CategoryList/CategoryList';
import EventList from './components/EventList/EventList';

// (Aquí luego importaremos CategoryList y EventList)

function Home() {
  return (
    <div className="home-container">
      {/* 2. Reemplazamos el texto feo por el componente real */}
      <SearchBar />
      <Hero />
      <CategoryList />
      <EventList />
      {/* (Aquí pondremos las otras piezas luego) */}
    </div>
  );
}

export default Home;