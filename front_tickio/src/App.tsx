import { Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Layout from './components/Layout';
import Home from './Home/Home';
import CarritoPage from './Carrito/Carrito';
import PasarelaPage from './Pasarela/Pasarela';
import ConfirmacionPage from './Confirmacion/Confrimacion';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login defaultView="login" />} />
      <Route path="/register" element={<Login defaultView="register" />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="carrito" element={<CarritoPage />} />
        <Route path="pasarela" element={<PasarelaPage />} />
        <Route path="confirmacion" element={<ConfirmacionPage />} />
      </Route>
    </Routes>
  );
}

export default App;