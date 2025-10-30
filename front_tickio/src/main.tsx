import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Importamos el Router

import App from './App'; // 2. Apuntamos al nuevo App.tsx

// (Opcional) Si quieres estilos globales, este es un buen lugar
// Por ahora, dejamos el de Login
import './Login/Login.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* 3. Envolvemos la App con el BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);