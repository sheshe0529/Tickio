import { Link } from 'react-router-dom';
import './Navbar.css';
// import logoTickio from '../../assets/logo.png'; // (Ajusta la ruta a tu logo)

function Navbar() {
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        {/* En lugar de un <a>, usamos <Link> para la navegación interna */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Tickio Logo" className="navbar-logo-img" />
        </Link>
        <nav className="navbar-links">
          <Link to="/categoria/concierto">Concierto</Link>
          <Link to="/categoria/deportes">Deportes</Link>
          <Link to="/categoria/otros">Otros</Link>
          <Link to="/sobre-nosotros">Sobre Nosotros</Link>
        </nav>
      </div>
      <div className="navbar-right">
        {/* Y aquí está el link para ir al login de tu amigo */}
        <Link to="/register" className="navbar-button-secondary">
          Registrarse
        </Link>
        <Link to="/login" className="navbar-button-primary">
          Inicia Sesión
        </Link>
      </div>
    </header>
  );
}

export default Navbar;