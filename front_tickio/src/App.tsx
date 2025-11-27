import { Routes, Route } from 'react-router-dom';

import Login from './Login/Login';

// 2. Importa tus nuevos componentes
import EventDetail from './EventDetail/EventDetail';

import Layout from './components/Layout';
import Home from './Home/Home';
import CarritoPage from './Carrito/Carrito';
import PasarelaPage from './Pasarela/Pasarela';
import ConfirmacionPage from './Confirmacion/Confirmacion';
import TicketsPage from './Tickets/TicketsPage';
import SobreNosotrosPage from './SobreNosotros/SobreNosotrosPage';

import CrearEventoPage from './Organizador/CrearEventoPage';
import MisEventosPage from './Organizador/MisEventosPage';
import ReporteVentasPage from './Organizador/ReporteVentasPage';
import ReporteGeneralPage from './Organizador/ReporteGeneralPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login defaultView="login" />} />
      <Route path="/register" element={<Login defaultView="register" />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/evento/:id" element={<EventDetail />} />
        <Route path="carrito" element={<CarritoPage />} />
        <Route path="pasarela" element={<PasarelaPage />} />
        <Route path="confirmacion" element={<ConfirmacionPage />} />
        <Route path="tickets" element={<TicketsPage />} /> 

        <Route path="/organizar/crear" element={<CrearEventoPage />} />
        <Route path="/organizar/eventos" element={<MisEventosPage />} />
        <Route path="/organizar/reporte/:id" element={<ReporteVentasPage />} />
        <Route path="/organizar/reporte-general" element={<ReporteGeneralPage />} />
        <Route path="/sobre-nosotros" element={<SobreNosotrosPage />} />
      </Route>
    </Routes>
  );
}

export default App;