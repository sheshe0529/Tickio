import React from 'react';
import './CategoryList.css'; // Asegúrate de tener tu CSS

interface CategoryListProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

// Deben ser IGUALES a tu enum de Prisma
const categorias = ["CONCIERTO", "DEPORTE", "TEATRO", "TRENDING"]; 

const CategoryList: React.FC<CategoryListProps> = ({ onSelectCategory, selectedCategory }) => {
  return (
    <div className="category-list-container">
      {categorias.map((cat) => (
        <button 
          key={cat} 
          onClick={() => onSelectCategory(cat)}
          className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;