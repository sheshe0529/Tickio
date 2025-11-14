import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // 👈 1. Importar useNavigate
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext'; // 👈 2. Importar useAuth
import './TicketSelector.css';

interface TipoTicket {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number; // Stock
}

interface TicketSelectorProps {
  ticket: TipoTicket;
  evento: {
    id: number;
    nombre: string;
  };
}

function TicketSelector({ ticket, evento }: TicketSelectorProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); // 👈 3. Traemos el estado de autenticación
  const navigate = useNavigate();        // 👈 4. Inicializamos el hook de navegación

  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    if (quantity < ticket.cantidad) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0) return;

    // --- 5. ¡AQUÍ ESTÁ LA VERIFICACIÓN! ---
    if (!isAuthenticated) {
      // Si no está logueado...
      alert("Debes iniciar sesión para agregar tickets al carrito.");
      navigate('/login'); // Lo redirigimos al login
      return; // Detenemos la función aquí
    }
    // --- Fin de la verificación ---

    // Si llegó hasta aquí, SÍ está logueado:
    addToCart({
      ticketId: ticket.id,
      ticketName: ticket.nombre,
      eventoId: evento.id,
      eventoName: evento.nombre,
      quantity: quantity,
      price: ticket.precio,
      stock: ticket.cantidad,
    });

    setQuantity(0); 
    alert(`${quantity} x ${ticket.nombre} agregado(s) al carrito!`);
  };

  return (
    <div className="ticket-selector-row">
      <div className="zone-info">
        <span className="zone-name">{ticket.nombre}</span>
        <span className="zone-availability">{ticket.cantidad} disponibles</span>
      </div>

      <div className="quantity-controls">
        <button onClick={handleDecrement} disabled={quantity === 0}>-</button>
        <span className="quantity-display">{quantity}</span>
        <button onClick={handleIncrement} disabled={quantity >= ticket.cantidad}>+</button>
      </div>

      <div className="price-info">
        <span className="price-display">S/ {ticket.precio.toFixed(2)}</span>
        <button 
          className="add-button" 
          onClick={handleAddToCart}
          disabled={quantity === 0}
        >
          Agregar
        </button>
      </div>
    </div>
  );
}

export default TicketSelector;