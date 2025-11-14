import React from 'react';
import { useCart, type CartItem as CartItemType } from '../../../context/CartContext';import './CartItem.css';
import { FaTrash } from 'react-icons/fa'; // Un ícono más limpio

type CartItemProps = {
  item: CartItemType; // 👈 2. Usamos el tipo real del Contexto
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
};

function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.ticketId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    // 3. Validamos contra el stock real que guardamos
    if (item.quantity < item.stock) {
      onQuantityChange(item.ticketId, item.quantity + 1);
    } else {
      alert(`Stock máximo alcanzado (${item.stock})`);
    }
  };

  return (
    <div className="cart-item-card">
      <div className="cart-item-details">
        {/* 4. Mostramos los datos reales del contexto */}
        <h3>{item.eventoName}</h3>
        <p>Ticket: {item.ticketName}</p>
        <p>Precio: S/ {item.price.toFixed(2)} c/u</p>
      </div>
      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button onClick={handleDecrease}>-</button>
          <span>{item.quantity}</span>
          <button onClick={handleIncrease} disabled={item.quantity >= item.stock}>+</button>
        </div>
        <span className="item-price">
          S/ {(item.price * item.quantity).toFixed(2)}
        </span>
        <button className="remove-item-btn" onClick={() => onRemove(item.ticketId)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default CartItem;