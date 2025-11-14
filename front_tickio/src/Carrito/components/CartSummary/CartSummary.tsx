import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { type CartItem } from '../../../context/CartContext'; // 👈 1. Importamos el TIPO real
import './CartSummary.css';

type CartSummaryProps = {
  items: CartItem[]; // 👈 2. Usamos el TIPO real
  hideTitle?: boolean;
  hidePaymentMethods?: boolean;
};

function CartSummary({ items, hideTitle = false, hidePaymentMethods = false }: CartSummaryProps) {
  const navigate = useNavigate();

  // 3. El cálculo de total (tu lógica de IGV es genial, la mantenemos)
  const { subtotal, igv, total } = useMemo(() => {
    const sub = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const igv = sub * 0.18; // 18% IGV
    const total = sub + igv;
    return { subtotal: sub, igv: igv, total: total };
  }, [items]);

  const handleCheckout = () => {
    navigate('/pasarela');
  };

  return (
    <div className="cart-summary-card">
      {!hideTitle && <h3 className="summary-title">Carrito de Compras</h3>}
      
      <div className="summary-list">
        <h4>Lista de Productos</h4>
        {items.map(item => (
          <div key={item.ticketId} className="summary-item">
            {/* 4. Mostramos los datos reales */}
            <span>{item.quantity}x {item.ticketName}</span> 
            <span>S/. {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="summary-totals">
        <div className="summary-line">
          <span>Subtotal</span>
          <span>S/. {subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>IGV (18%)</span>
          <span>S/. {igv.toFixed(2)}</span>
        </div>
        <div className="summary-line total-line">
          <span>Total</span>
          <span>S/. {total.toFixed(2)}</span>
        </div>
      </div>

      {!hidePaymentMethods && (
        <>
          <div className="summary-payment">
            <h4>Métodos de Pago</h4>
            <div className="payment-icons">
              <div className="payment-icon-placeholder"></div>
              <div className="payment-icon-placeholder"></div>
            </div>
          </div>
          <button className="summary-checkout-button" onClick={handleCheckout}>
            Proceder con el Pago
          </button>
        </>
      )}
    </div>
  );
}

export default CartSummary;