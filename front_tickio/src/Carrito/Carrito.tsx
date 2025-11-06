import React, { useState } from 'react';
import './Carrito.css'; // Importa el CSS con el nuevo nombre
import CartItem from './components/CartItem/CartItem';
import CartSummary from './components/CartSummary/CartSummary';

const initialItems = [
  {
    id: 1,
    title: 'Universitario vs Alianza Lima',
    date: '11/09/2025',
    time: '16:00 h',
    location: 'Lima - Estadio Monumental de Lima',
    tag: 'General',
    price: 30,
    quantity: 1,
  },
  {
    id: 2,
    title: 'Sporting Cristal vs UTC',
    date: '12/09/2025',
    time: '15:00 h',
    location: 'Lima - Estadio Alberto Gallardo',
    tag: 'General',
    price: 50,
    quantity: 2,
  },
];

function CarritoPage() { // Renombramos la función
  const [cartItems, setCartItems] = useState(initialItems);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== id));
  };
  
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h2>Lista de Entradas ({totalItemCount})</h2>
        <button className="delete-all-button">
          Eliminar <span className="trash-icon">🗑️</span>
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
          <button className="back-button">&lt; Volver</button>
        </div>
        
        <div className="cart-summary-sidebar">
          <CartSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
}

export default CarritoPage; // Exportamos la función con el nuevo nombre