import { Routes, Route } from 'react-router-dom';

// 1. Importa el componente de tu amigo
import Login from './Login/Login';

// 2. Importa tus nuevos componentes
import Layout from './components/Layout'; // El layout reutilizable
import Home from './Home/Home';       // Tu página Home
import EventDetail from './EventDetail/EventDetail';

// (Pendiente) Aquí importaremos tus pantallas cuando las creemos
// import EventDetail from './EventDetail/EventDetail';

function App() {
  return (
    <Routes>
      {/* Ruta 1: Si van a /login, muestra la vista 'login' */}
      <Route path="/login" element={<Login defaultView="login" />} />

      {/* Ruta 2: (NUEVA) Si van a /register, muestra la vista 'register' */}
      <Route path="/register" element={<Login defaultView="register" />} />

      {/* Ruta 3: Rutas que SÍ usan el Navbar/Footer */}
      <Route element={<Layout />}>
        {/* La ruta "/" ahora renderiza TU Home DENTRO del Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/evento/:id" element={<EventDetail />} />
        {/* (Pendiente) Aquí irá tu página de Evento */}
        {/* <Route path="/evento/:id" element={<EventDetail />} /> */}
      </Route>
    </Routes>
  );
}

export default App;