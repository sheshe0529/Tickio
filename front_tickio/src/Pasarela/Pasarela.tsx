import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pasarela.css';
import CartSummary from '../Carrito/components/CartSummary/CartSummary';

const cartItems = [
  {
    id: 1,
    title: 'Universitario vs Alianza Lima',
    price: 30,
    quantity: 1,
  },
  {
    id: 2,
    title: 'Sporting Cristal vs UTC',
    price: 50,
    quantity: 2,
  },
];

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

function PasarelaPage() {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    let formattedValue = value;
    switch (id) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(paymentData.expiryDate, value);
        break;
      case 'cvv':
        formattedValue = formatCvv(value);
        break;
    }

    setPaymentData({
      ...paymentData,
      [id]: formattedValue,
    });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Simulando pago con:', paymentData);
      navigate('/confirmacion');
    }, 2000);
  };

  return (
    <div className="pasarela-page-container">
      <div className="pasarela-main-content">
        <button className="back-button" onClick={() => navigate('/carrito')}>
          &lt; Volver al carrito
        </button>
        <h2 className="pasarela-title">Datos de Pago</h2>

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
            {loading ? 'Procesando...' : 'Pagar'}
          </button>
        </form>
      </div>

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