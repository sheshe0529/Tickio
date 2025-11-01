import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartSummary.css';

type Item = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type CartSummaryProps = {
  items: Item[];
  hideTitle?: boolean;
  hidePaymentMethods?: boolean;
};

function CartSummary({ items, hideTitle = false, hidePaymentMethods = false }: CartSummaryProps) {
  const navigate = useNavigate();

  const { subtotal, igv, total } = useMemo(() => {
    const sub = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const igv = sub * 0.18;
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
          <div key={item.id} className="summary-item">
            <span>{item.title}</span>
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
          <span>IGV</span>
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