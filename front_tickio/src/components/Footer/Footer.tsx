import { Link } from 'react-router-dom';
import './Footer.css';

// 1. Importamos los íconos que necesitamos de la librería
import {
  FaEnvelope,
  FaPhone,
  FaRegCalendarAlt,
  FaRegClock,
  FaMapMarkerAlt
} from 'react-icons/fa';

// (Asumo que tienes tu logo en la carpeta assets)
//import logoTickio from 'front_tickio/public/logo.png';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Columna 1: Logo */}
        <div className="footer-column-logo">
          {<img src="/logo.png" alt="Tickio" className="footer-logo-img" />}
          {/* Si no tienes la imagen, usa esto como placeholder: */}
        </div>

        {/* Columna 2: Links de Navegación */}
        <div className="footer-column-links">
          <Link to="/">Home</Link>
          <Link to="/sobre-nosotros">About Us</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/trending">Trending Events</Link>
          <Link to="/categorias">Categories</Link>
        </div>

        {/* Columna 3: Contacto (con íconos) */}
        <div className="footer-column-contact">
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" />
            <span className="contact-label">Email</span>
            <span className="contact-value">sparessupport@metaticket.in</span>
          </div>
          <div className="footer-contact-item">
            <FaPhone className="footer-icon" />
            <span className="contact-label">Phone Number</span>
            <span className="contact-value">8884516856</span>
          </div>
          <div className="footer-contact-item">
            <FaRegCalendarAlt className="footer-icon" />
            <span className="contact-label">Working Days</span>
            <span className="contact-value">Monday - Sunday</span>
          </div>
          <div className="footer-contact-item">
            <FaRegClock className="footer-icon" />
            <span className="contact-label">Working Hours</span>
            <span className="contact-value">8:00AM - 8:00PM (IST)</span>
          </div>
          <div className="footer-contact-item">
            <FaMapMarkerAlt className="footer-icon" />
            <span className="contact-label">Address</span>
            <span className="contact-value">Jr Yavari 123, Breña, Lima</span>
          </div>
        </div>

      </div>
      <div className="footer-copyright">
        {/* El PDF dice MetaTicket, pero lo ajusto a Tickio ;) */}
        © 2025 Tickio Private Limited
      </div>
    </footer>
  );
}

export default Footer;