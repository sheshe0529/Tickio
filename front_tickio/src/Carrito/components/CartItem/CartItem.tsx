import React from 'react';
import './CartItem.css';

type CartItemProps = {
  item: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    tag: string;
    price: number;
    quantity: number;
  };
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
};

function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  return (
    <div className="cart-item-card">
      <div className="cart-item-selection">
        <input type="checkbox" />
      </div>
      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p>{item.date} - {item.time}</p>
        <p>{item.location}</p>
      </div>
      <div className="cart-item-controls">
        <span className="item-tag">{item.tag}</span>
        <div className="quantity-controls">
          <button onClick={handleDecrease}>-</button>
          <span>{item.quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
        <span className="item-price">S/. {item.price.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartItem;