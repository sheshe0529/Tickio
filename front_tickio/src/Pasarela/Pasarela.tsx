import React, { useState, useMemo , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Pasarela.css';
import CartSummary from '../Carrito/components/CartSummary/CartSummary';

// Interfaz para los formularios de Nombre/DNI
interface TicketHolderForm {
  tempId: string;
  tipoTicketId: number;
  ticketName: string;
  eventoName: string;
  nombre: string;
  apellido: string;
  dni: string;
}


// Tus funciones de formateo de tarjeta
const formatCardNumber = (value: string) => {
  const numericValue = value.replace(/[^\d]/g, '');
  const groups = numericValue.match(/\d{1,4}/g) || [];
  return groups.join(' ').slice(0, 19);
};
const formatExpiryDate = (currentValue: string, newValue: string) => {
  const numericValue = newValue.replace(/[^\d]/g, '');
  if (newValue.length < currentValue.length && currentValue.endsWith('/')) {
    return numericValue;
  }
  if (numericValue.length >= 2) {
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}`;
  }
  return numericValue;
};
const formatCvv = (value: string) => {
  return value.replace(/[^\d]/g, '').slice(0, 3);
};

// --- EL COMPONENTE ---
function PasarelaPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Tickio - Pasarela de Pago';
  }, []);
  // Calculamos el total real (con el IGV de tu CartSummary)
  const { finalTotal } = useMemo(() => {
    const sub = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const igv = sub * 0.18;
    const total = sub + igv;
    return { finalTotal: total };
  }, [cartItems]);

  // Creamos los formularios de Propietario (Nombre/DNI)
  const initialForms = useMemo(() => {
    return cartItems.flatMap(item => 
      Array(item.quantity).fill(null).map((_, index) => ({
        tempId: `${item.ticketId}-${index}`,
        tipoTicketId: item.ticketId,
        ticketName: item.ticketName,
        eventoName: item.eventoName,
        nombre: '',
        apellido: '',
        dni: ''
      }))
    );
  }, [cartItems]);

  const [ticketHolders, setTicketHolders] = useState<TicketHolderForm[]>(initialForms);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // --- MANEJADORES ---

  // Manejador para los inputs de Nombre/DNI
  const handleHolderChange = (tempId: string, field: keyof TicketHolderForm, value: string) => {
    setTicketHolders(currentHolders =>
      currentHolders.map(h => 
        h.tempId === tempId ? { ...h, [field]: value } : h
      )
    );
  };

  // Manejador para los inputs de Tarjeta
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let formattedValue = value;
    switch (id) {
      case 'cardNumber': formattedValue = formatCardNumber(value); break;
      case 'expiryDate': formattedValue = formatExpiryDate(paymentData.expiryDate, value); break;
      case 'cvv': formattedValue = formatCvv(value); break;
    }
    setPaymentData({ ...paymentData, [id]: formattedValue });
  };

  // --- SUBMIT FUSIONADO ---
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // A. Validación de Propietarios (Nombre/DNI)
    for (const ticket of ticketHolders) {
      if (!ticket.nombre || !ticket.apellido || !ticket.dni) {
        setError(`Por favor, completa los datos del Ticket: ${ticket.eventoName} (${ticket.ticketName})`);
        return;
      }
      if (ticket.dni.length !== 8 || !/^\d+$/.test(ticket.dni)) {
         setError(`El DNI del ticket ${ticket.ticketName} debe tener 8 dígitos numéricos.`);
         return;
      }
    }

    // B. Validación de Tarjeta (Tu lógica)
    const unformattedCardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (unformattedCardNumber.length !== 16 || !/^\d+$/.test(unformattedCardNumber)) {
      setError('Número de tarjeta inválido. Debe tener 16 dígitos.');
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)) {
      setError('Fecha de vencimiento inválida. Use el formato MM/AA.');
      return;
    }
    if (paymentData.cvv.length !== 3 || !/^\d+$/.test(paymentData.cvv)) {
      setError('CVV inválido. Debe tener 3 dígitos.');
      return;
    }

    // C. Llamada al Backend REAL
    setLoading(true);

    const dataToSend = {
      usuarioId: user!.id, // Sabemos que el usuario existe (lo validamos abajo)
      tickets: ticketHolders.map(t => ({
        tipoTicketId: t.tipoTicketId,
        nombre: t.nombre,
        apellido: t.apellido,
        dni: t.dni
      }))
    };

    try {
      // (Simulación de pago de tarjeta...)
      // Ahora, registramos la compra en nuestro backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/compras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error al procesar la compra en el servidor');
      }
      const result = await response.json();
      
      // ¡ÉXITO!
      setIsNavigating(true);
      navigate('/confirmacion'); // 1. NAVEGAMOS PRIMERO
      clearCart();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Redirecciones si no hay usuario o carrito
  if (!user) {
    navigate('/login?redirect=/pasarela');
    return null; 
  }
  if (cartItems.length === 0 && !isNavigating) { 
     navigate('/');
     return null;
  }

  // --- RENDERIZADO ---
  return (
    <div className="pasarela-page-container">
      <div className="pasarela-main-content">
        <button className="back-button" onClick={() => navigate('/carrito')}>
          &lt; Volver al carrito
        </button>
        
        {/* --- FORMULARIOS DE PROPIETARIOS --- */}
        <div className="ticket-forms-section">
          <h2 className="pasarela-title">Datos de los Asistentes</h2>
          <p>Ingresa los datos de cada persona que usará el ticket.</p>
          
          {ticketHolders.map((ticket, index) => (
            <div key={ticket.tempId} className="ticket-form-card">
              <div className="ticket-form-header">
                <strong>Ticket {index + 1}:</strong> {ticket.eventoName} ({ticket.ticketName})
              </div>
              <div className="form-fields">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={ticket.nombre}
                  onChange={(e) => handleHolderChange(ticket.tempId, 'nombre', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={ticket.apellido}
                  onChange={(e) => handleHolderChange(ticket.tempId, 'apellido', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="DNI (8 dígitos)"
                  maxLength={8}
                  value={ticket.dni}
                  onChange={(e) => handleHolderChange(ticket.tempId, 'dni', e.target.value)}
                  inputMode="numeric"
                />
              </div>
            </div>
          ))}
        </div>

        {/* --- FORMULARIO DE PAGO (Tu código) --- */}
        <h2 className="pasarela-title" style={{marginTop: '2rem'}}>Datos de Pago</h2>
        <form className="payment-form" onSubmit={handlePaymentSubmit}>
          <div className="form-group">
            <label>Metodo de pago</label>
            <div className="payment-method-selector">
              <span>💳</span> Tarjeta de Débito/Crédito
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cardNumber">Datos de la tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              placeholder="Ej: 1234 5678 1234 5678"
              value={paymentData.cardNumber}
              onChange={handleChange}
              maxLength={19}
              inputMode="numeric"
            />
          </div>

          <div className="form-row">
            <div className="form-group expiry-group">
              <label htmlFor="expiryDate">Fecha de Vencimiento</label>
              <input
                type="text"
                id="expiryDate"
                placeholder="MM/AA"
                value={paymentData.expiryDate}
                onChange={handleChange}
                maxLength={5}
                inputMode="numeric"
              />
            </div>
            <div className="form-group cvv-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={handleChange}
                maxLength={3}
                inputMode="numeric"
              />
            </div>
          </div>
          
          {error && <div className="payment-error">{error}</div>}

          <button type="submit" className="pay-button" disabled={loading}>
            {loading ? 'Procesando...' : `Pagar S/ ${finalTotal.toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* --- SIDEBAR DE RESUMEN --- */}
      <div className="pasarela-sidebar">
        <div className="pasarela-summary-title">Resumen</div>
        <CartSummary 
          items={cartItems} 
          hideTitle={true} 
          hidePaymentMethods={true} 
        />
      </div>
    </div>
  );
}

export default PasarelaPage;