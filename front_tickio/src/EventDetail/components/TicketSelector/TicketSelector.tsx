import { useState } from 'react';
import './TicketSelector.css';

// 1. Definimos las "props" que este componente espera recibir
interface TicketSelectorProps {
  zone: {
    name: string;
    price: number;
    available: number;
    total: number;
  };
}

function TicketSelector({ zone }: TicketSelectorProps) {
  // 2. Cada fila maneja su propia cantidad
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    // (Falta lógica para no pasarse del 'available')
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="ticket-selector-row">
      {/* --- Info de la Zona --- */}
      <div className="zone-info">
        <span className="zone-name">{zone.name}</span>
        <span className="zone-availability">{zone.available} de {zone.total} disponibles</span>
      </div>

      {/* --- Contador --- */}
      <div className="quantity-controls">
        <button onClick={handleDecrement} disabled={quantity === 0}>-</button>
        <span className="quantity-display">{quantity}</span>
        <button onClick={handleIncrement}>+</button>
      </div>

      {/* --- Precio y Botón --- */}
      <div className="price-info">
        <span className="price-display">s/ {zone.price.toFixed(2)}</span>
        <button className="add-button">
          Agregar
        </button>
      </div>
    </div>
  );
}

export default TicketSelector;