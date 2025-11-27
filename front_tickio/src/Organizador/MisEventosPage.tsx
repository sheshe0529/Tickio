import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Organizador.css'; // Reusamos el CSS

interface Evento {
  id: number;
  nombre: string;
  fecha_inicio: string;
  estado: string;
  aforo: number;
}

function MisEventosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = 'Tickio - Gestionar Eventos';
  }, []);
  useEffect(() => {
    if (user && user.rol !== 'Organizador') {
      alert("No tienes permisos para acceder a esta página.");
      navigate('/');
    }
    
    if (user) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/eventos/organizador/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setEventos(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, navigate]);

  return (
    <div className="organizador-page">
      <h1>Mis Eventos Creados</h1>
      <p>Aquí puedes ver y gestionar los eventos que has publicado.</p>

      {loading && <p>Cargando eventos...</p>}
      
      {!loading && eventos.length === 0 && (
        <div className="no-data-card">
          <h3>No tienes eventos</h3>
          <p>Aún no has creado ningún evento.</p>
          <Link to="/organizar/crear" className="submit-button">Crear mi primer evento</Link>
        </div>
      )}

      {!loading && eventos.length > 0 && (
        <div className="eventos-lista-organizador">
          {eventos.map(evento => (
            <div key={evento.id} className="evento-card-organizador">
              <div className="info">
                <span className={`estado-badge ${evento.estado.toLowerCase()}`}>{evento.estado}</span>
                <h3>{evento.nombre}</h3>
                <p>Fecha: {new Date(evento.fecha_inicio).toLocaleDateString()}</p>
                <p>Aforo: {evento.aforo} personas</p>
              </div>
              <div className="actions">
                <Link to={`/organizar/reporte/${evento.id}`} className="action-button reporte">
                  Ver Reporte
                </Link>
                <button className="action-button editar">
                  Solicitar Edición
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisEventosPage;