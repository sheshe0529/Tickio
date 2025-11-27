import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 👈 1. Importamos el Contexto
import './Carrito.css';
import CartItem from './components/CartItem/CartItem';
import CartSummary from './components/CartSummary/CartSummary';

function CarritoPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Tickio - Mi Carrito';
  }, []);
  // 2. Leemos los datos y funciones reales del Contexto
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalItems 
  } = useCart();

  // 3. Botón "Volver" (si lo quieres usar)
  const handleGoBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  // 4. Si el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container empty-cart">
        <h2>Tu carrito está vacío</h2>
        <p>No has agregado ningún ticket todavía.</p>
        <button onClick={() => navigate('/')} className="back-button">
          &larr; Buscar Eventos
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        {/* Usamos el total real del contexto */}
        <h2>Lista de Entradas ({totalItems})</h2>
        <button className="delete-all-button" onClick={clearCart}>
          Eliminar Todo <span className="trash-icon">🗑️</span>
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items-list">
          {/* 5. Mapeamos los items reales del carrito */}
          {cartItems.map(item => (
            <CartItem
              key={item.ticketId}
              item={item}
              onQuantityChange={updateQuantity} // Pasamos la función real
              onRemove={removeFromCart}       // Pasamos la función real
            />
          ))}
          <button className="back-button" onClick={handleGoBack}>
            &larr; Volver
          </button>
        </div>
        
        <div className="cart-summary-sidebar">
          {/* Pasamos los items reales al resumen */}
          <CartSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
}

export default CarritoPage;