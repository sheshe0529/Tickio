import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Solo se usa useNavigate
import { FaCheckCircle } from 'react-icons/fa';
import './Confirmacion.css';

function ConfirmacionPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="confirmacion-container">
      <div className="confirmacion-card">
        <FaCheckCircle className="confirmacion-icon" />
        <h2 className="confirmacion-title">
          Tu compra ha sido procesada correctamente.
        </h2>
        {/* 2. Ya no se muestra el ID */}
        <p className="confirmacion-info">
          Recibirás un correo con los detalles de tu compra.
        </p>
        <button className="confirmacion-button" onClick={handleGoHome}>
          Volver a la Página Principal
        </button>
      </div>
    </div>
  );
}

export default ConfirmacionPage;