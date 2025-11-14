import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'; // 1. Importamos el Router
import { CartProvider } from './context/CartContext'

import App from './App'; // 2. Apuntamos al nuevo App.tsx

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './Login/Login.css';

// (Opcional) Si quieres estilos globales, este es un buen lugar
// Por ahora, dejamos el de Login


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> 
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);