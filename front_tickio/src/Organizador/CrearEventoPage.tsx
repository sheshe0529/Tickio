import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Organizador.css'; // Reusamos el CSS

// Helper para formatear
const formatEnumName = (text: string) => {
  if (!text) return "";
  return text.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()).replace("Bre A", "Breña");
};
const subtipos = ["INFANTIL", "GENERAL", "MAS18"];

// 👇 Interface para el formulario de ticket
interface TicketForm {
  nombre: string;
  precio: number;
  cantidad: number;
}

function CrearEventoPage() {
  useEffect(() => {
    document.title = 'Tickio - Crear Evento';
  }, []);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [distritos, setDistritos] = useState<string[]>([]);
  const [tiposEvento, setTiposEvento] = useState<string[]>([]);
  
  // Estado del formulario principal
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    distrito: '',
    fecha_inicio: '',
    fecha_fin: '',
    hora_inicio: 18,
    duracion: 120,
    aforo: 100,
    tipoEvento: '',
    subtipo: '',
  });

  // 👇 NUEVO ESTADO para los tipos de ticket (array)
  const [tiposTicket, setTiposTicket] = useState<TicketForm[]>([
    { nombre: 'General', precio: 50, cantidad: 100 } // Empezamos con uno
  ]);

  // ... (useEffect para permisos y carga de selects) ...
  useEffect(() => {
    if (user && user.rol !== 'Organizador') {
      alert("No tienes permisos para acceder a esta página.");
      navigate('/');
    }
    // Cargar selects
    fetch(`${import.meta.env.VITE_API_URL}/distritos`).then(res => res.json()).then(setDistritos);
    fetch(`${import.meta.env.VITE_API_URL}/tipo-eventos`).then(res => res.json()).then(setTiposEvento);
  }, [user, navigate]);

  // Manejador para el formulario principal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // --- 👇 NUEVAS FUNCIONES PARA MANEJAR LOS TICKETS ---
  
  // Actualiza un ticket específico en el array
  const handleTicketChange = (index: number, field: keyof TicketForm, value: string | number) => {
    // Prevenimos valores negativos
    if ((field === 'precio' || field === 'cantidad') && Number(value) < 0) {
      value = 0;
    }
    
    setTiposTicket(currentTickets => 
      currentTickets.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    );
  };
  
  // Añade un nuevo formulario de ticket vacío
  const addTicketType = () => {
    setTiposTicket([
      ...tiposTicket,
      { nombre: '', precio: 0, cantidad: 50 }
    ]);
  };
  
  // Elimina un formulario de ticket
  const removeTicketType = (index: number) => {
    if (tiposTicket.length <= 1) { // No dejar eliminar el último
      alert("Debes tener al menos un tipo de ticket.");
      return;
    }
    setTiposTicket(currentTickets => 
      currentTickets.filter((_, i) => i !== index)
    );
  };
  // --- FIN DE NUEVAS FUNCIONES ---

  // 👇 handleSubmit actualizado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);

    // Validación de tickets
    for (const ticket of tiposTicket) {
      if (!ticket.nombre || ticket.precio <= 0 || ticket.cantidad <= 0) {
        setError("Revisa los datos de los tickets. El nombre no puede estar vacío y el precio/cantidad debe ser mayor a 0.");
        setLoading(false);
        return;
      }
    }
    
    // (Lógica de fechas...)
    const fechaInicioConHora = new Date(`${form.fecha_inicio}T${String(form.hora_inicio).padStart(2, '0')}:00:00`);
    const fechaFinConHora = new Date(form.fecha_fin); 
    
    const dataToSend = {
      ...form,
      fecha_inicio: fechaInicioConHora.toISOString(),
      fecha_fin: fechaFinConHora.toISOString(),
      hora_inicio: Number(form.hora_inicio),
      duracion: Number(form.duracion),
      aforo: Number(form.aforo),
      usuarioId: user.id,
      tipoTickets: tiposTicket // 👈 AÑADIMOS EL ARRAY DE TICKETS
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error al crear el evento');
      }
      alert('¡Evento y tickets creados exitosamente!');
      navigate('/organizar/eventos');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organizador-page">
      <h1>Crear Nuevo Evento</h1>
      
      <form className="organizador-form" onSubmit={handleSubmit}>
        {/* ... (el .form-grid con los datos del evento, sigue igual) ... */}
        {/* (Copia y pega el JSX de tu 'CrearEventoPage' anterior aquí) */}
        <div className="form-grid">
          {/* Columna 1 */}
          <div className="form-column">
             <label>Nombre del Evento</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            
            <label>Dirección (Lugar)</label>
            <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required />

            <label>Distrito</label>
            <select name="distrito" value={form.distrito} onChange={handleChange} required>
              <option value="">Selecciona un distrito</option>
              {distritos.map(d => <option key={d} value={d}>{formatEnumName(d)}</option>)}
            </select>

            <label>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={5}></textarea>
          </div>
          
          {/* Columna 2 */}
          <div className="form-column">
            <div className="form-row">
              <div>
                <label>Fecha de Inicio</label>
                <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} required />
              </div>
              <div>
                <label>Fecha de Fin</label>
                <input type="date" name="fecha_fin" value={form.fecha_fin} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="form-row">
              <div>
                <label>Hora Inicio (24h)</label>
                <input type="number" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} min="0" max="23" />
              </div>
              <div>
                <label>Duración (min)</label>
                <input type="number" name="duracion" value={form.duracion} onChange={handleChange} min="30" step="15" />
              </div>
            </div>

            <label>Aforo Total</label>
            <input type="number" name="aforo" value={form.aforo} onChange={handleChange} min="1" />

            <label>Tipo de Evento</label>
            <select name="tipoEvento" value={form.tipoEvento} onChange={handleChange} required>
              <option value="">Selecciona un tipo</option>
              {tiposEvento.map(t => <option key={t} value={t}>{formatEnumName(t)}</option>)}
            </select>
            
            <label>Subtipo (Público)</label>
            <select name="subtipo" value={form.subtipo} onChange={handleChange} required>
              <option value="">Selecciona público</option>
              {subtipos.map(s => <option key={s} value={s}>{formatEnumName(s)}</option>)}
            </select>
          </div>
        </div>
        
        {/* --- 👇 SECCIÓN DE TICKETS AÑADIDA --- */}
        <h2 className="form-section-title">Tipos de Ticket</h2>
        <div className="tickets-section">
            <div className="ticket-form-header-row">
            <span>Nombre del Ticket</span>
            <span>Precio (S/)</span>
            <span>Cantidad</span>
            <span className="remove-ticket-btn-placeholder"></span> {/* Espaciador */}
          </div>
          {tiposTicket.map((ticket, index) => (
            <div key={index} className="ticket-form-row">
              <input
                type="text"
                placeholder="Nombre (Ej: VIP)"
                value={ticket.nombre}
                onChange={(e) => handleTicketChange(index, 'nombre', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Precio (S/)"
                value={ticket.precio}
                min="0"
                onChange={(e) => handleTicketChange(index, 'precio', Number(e.target.value))}
                required
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={ticket.cantidad}
                min="1"
                onChange={(e) => handleTicketChange(index, 'cantidad', Number(e.target.value))}
                required
              />
              <button type="button" onClick={() => removeTicketType(index)} className="remove-ticket-btn"
                disabled={tiposTicket.length <= 1}>
                &times;
              </button>
            </div>
          ))}
          <button type="button" onClick={addTicketType} className="add-ticket-btn">
            + Añadir otro tipo de ticket
          </button>
        </div>
        {/* --- FIN SECCIÓN TICKETS --- */}

        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Evento y Tickets'}
        </button>
      </form>
    </div>
  );
}

export default CrearEventoPage;