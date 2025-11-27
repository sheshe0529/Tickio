import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaUserEdit, FaTimes } from 'react-icons/fa'; 
import './Navbar.css';

function Navbar() {
  const { user, logout, login } = useAuth(); 
  const navigate = useNavigate();
  
  // Estados de control visual
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estado para el formulario de edición (Todos los campos del registro menos pass)
  const [editForm, setEditForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    distrito: '',
    tipo1: '' as string | null, // Evento 1
    tipo2: '' as string | null, // Evento 2
    tipo3: '' as string | null, // Evento 3
  });

  // Estados para llenar los Selects (Listas desplegables)
  const [listaDistritos, setListaDistritos] = useState<string[]>([]);
  const [listaEventos, setListaEventos] = useState<string[]>([]);

  // 1. Cargar datos del usuario en el formulario al abrir
  useEffect(() => {
    if (user) {
      setEditForm({
        nombre: user.nombre || '',
        correo: user.correo || '',
        telefono: user.telefono || '',
        distrito: user.distrito || '',
        tipo1: user.tipo1 || '',
        tipo2: user.tipo2 || '',
        tipo3: user.tipo3 || '',
      });
    }
  }, [user]);

  // 2. Cargar listas de Distritos y Eventos desde el Backend
  useEffect(() => {
    // Solo cargamos si el modal se abre o si no tenemos los datos aun
    const fetchDatos = async () => {
      try {
        const resDistritos = await fetch(`${import.meta.env.VITE_API_URL}/distritos`);
        const dataDistritos = await resDistritos.json();
        setListaDistritos(dataDistritos);

        const resEventos = await fetch(`${import.meta.env.VITE_API_URL}/tipo-eventos`);
        const dataEventos = await resEventos.json();
        setListaEventos(dataEventos);
      } catch (error) {
        console.error("Error cargando listas:", error);
      }
    };
    fetchDatos();
  }, []);

  // Función para que los textos se vean bonitos (Ej: "SAN_BORJA" -> "San Borja")
  const formatEnumName = (text: string) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace("Bre A", "Breña");
  };

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    navigate('/'); 
  };

  const handleOpenModal = () => {
    setMenuAbierto(false);
    setModalAbierto(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Convertimos cadenas vacías a null para evitar errores en Prisma
      const dataToSend = {
        ...editForm,
        tipo1: editForm.tipo1 || null,
        tipo2: editForm.tipo2 || null,
        tipo3: editForm.tipo3 || null,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Actualizamos el contexto global y cerramos
        login({ ...user, ...updatedUser }); 
        alert('Perfil actualizado correctamente');
        setModalAbierto(false);
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Tickio Logo" className="navbar-logo-img" />
          </Link>
          <nav className="navbar-links">
            <Link to="/sobre-nosotros">Sobre Nosotros</Link>
          </nav>
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="navbar-logged-in">
              <Link to="/carrito" className="cart-button" title="Ir al carrito">
                <FaShoppingCart />
              </Link>

              <div className="user-menu-container">
                <button className="user-button" onClick={() => setMenuAbierto(!menuAbierto)}>
                  <span className="user-name">{user.nombre}</span>
                  <FaUserCircle className="user-avatar" />
                </button>

                {menuAbierto && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">Hola, <strong>{user.nombre}</strong></div>
                    <button className="dropdown-item" onClick={handleOpenModal}>
                      <FaUserEdit /> Editar Perfil
                    </button>
                    <Link to="/tickets" className="dropdown-item" onClick={() => setMenuAbierto(false)}>
                       Mis Tickets
                    </Link>
                    {user.rol === 'Organizador' && (
                    <>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-header" style={{color: '#2563eb'}}>
                        <strong>Panel de Organizador</strong>
                      </div>
                      <Link to="/organizar/eventos" className="dropdown-item" onClick={() => setMenuAbierto(false)}>
                        Mis Eventos
                      </Link>
                      <Link to="/organizar/crear" className="dropdown-item" onClick={() => setMenuAbierto(false)}>
                        Crear Evento
                      </Link>
                      <Link to="/organizar/reporte-general" className="dropdown-item" onClick={() => setMenuAbierto(false)}>
                        Reporte General
                      </Link>
                    </>
                  )}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <FaSignOutAlt /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to="/register" className="navbar-button-secondary">Registrarse</Link>
              <Link to="/login" className="navbar-button-primary">Inicia Sesión</Link>
            </>
          )}
        </div>
      </header>

      {/* --- EL MODAL DE EDICIÓN --- */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Perfil</h2>
              <button className="close-modal-btn" onClick={() => setModalAbierto(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form className="modal-form" onSubmit={handleSaveProfile}>
              
              {/* 1. NOMBRE */}
              <div className="form-group">
                <label>Nombre Completo</label>
                <input 
                  type="text" 
                  value={editForm.nombre} 
                  onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                />
              </div>

              {/* 2. CORREO */}
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  value={editForm.correo} 
                  onChange={(e) => setEditForm({...editForm, correo: e.target.value})}
                />
              </div>

              {/* 3. TELÉFONO */}
              <div className="form-group">
                <label>Teléfono</label>
                <input 
                  type="text" 
                  maxLength={9}
                  value={editForm.telefono} 
                  onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                />
              </div>

              {/* 4. DISTRITO */}
              <div className="form-group">
                <label>Distrito</label>
                <select 
                  value={editForm.distrito} 
                  onChange={(e) => setEditForm({...editForm, distrito: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="">Seleccione distrito</option>
                  {listaDistritos.map((d) => (
                    <option key={d} value={d}>{formatEnumName(d)}</option>
                  ))}
                </select>
              </div>

              {/* 5. PREFERENCIAS DE EVENTOS (Lógica de no duplicados incluida) */}
              <div className="form-group">
                <label>Intereses / Favoritos</label>
                
                {/* Select 1 */}
                <select 
                  value={editForm.tipo1 || ''} 
                  onChange={(e) => setEditForm({...editForm, tipo1: e.target.value})}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="">Preferencia 1</option>
                  {listaEventos.map((ev) => (
                    <option key={ev} value={ev} disabled={editForm.tipo2 === ev || editForm.tipo3 === ev}>
                      {formatEnumName(ev)}
                    </option>
                  ))}
                </select>

                {/* Select 2 */}
                <select 
                  value={editForm.tipo2 || ''} 
                  onChange={(e) => setEditForm({...editForm, tipo2: e.target.value})}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="">Preferencia 2</option>
                  {listaEventos.map((ev) => (
                    <option key={ev} value={ev} disabled={editForm.tipo1 === ev || editForm.tipo3 === ev}>
                      {formatEnumName(ev)}
                    </option>
                  ))}
                </select>

                {/* Select 3 */}
                <select 
                  value={editForm.tipo3 || ''} 
                  onChange={(e) => setEditForm({...editForm, tipo3: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="">Preferencia 3</option>
                  {listaEventos.map((ev) => (
                    <option key={ev} value={ev} disabled={editForm.tipo1 === ev || editForm.tipo2 === ev}>
                      {formatEnumName(ev)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;