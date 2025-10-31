import { Link } from 'react-router-dom';
import './CategoryList.css';

// (En el futuro, esta 'data' vendrá de tu API)
const categories = [
  {
    name: 'Conciertos',
    image: '/categories/concert.jpg' // (Pon tus imágenes en 'public/categories/')
  },
  {
    name: 'Deportes',
    image: '/categories/sports.png'
  },
  {
    name: 'Teatro',
    image: '/categories/theater.jpg'
  },
  {
    name: 'Familia',
    image: '/categories/family.jpg'
  },
];

function CategoryList() {
  return (
    <div className="category-list-container">
      {/* --- Fila del Título --- */}
      <div className="category-list-header">
        <h2>Navega Según Categoría</h2>
        <Link to="/categorias" className="category-see-more">
          Ver más
        </Link>
      </div>

      {/* --- Contenedor de las Tarjetas --- */}
      <div className="category-cards-wrapper">
        {categories.map((category) => (
          <div key={category.name} className="category-card">
            <img
              src={category.image}
              alt={category.name}
              className="category-card-img"
            />
            <div className="category-card-overlay"></div>
            <span className="category-card-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;