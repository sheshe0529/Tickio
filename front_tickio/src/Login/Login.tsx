import React, { useState, useEffect } from 'react'; // 1. Importa useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoTickio from '/logo.png';


// (Las interfaces RegisterErrors, ForgotErrors, ErrorState no cambian)
interface RegisterErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  dni?: string;
  password?: string;
  confirmPassword?: string;
}

interface ForgotErrors {
  email?: string;
  code?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

interface ErrorState {
  login: string;
  register: RegisterErrors;
  forgot: ForgotErrors;
}

type LoginView = 'login' | 'register' | 'forgotEmail' | 'forgotCode' | 'forgotReset' | 'forgotSuccess';

interface LoginProps {
  defaultView: LoginView;
}

const initialLoginForm = { email: '', password: '' };
const initialRegisterForm = {
  fullName: '',
  email: '',
  phone: '',
  //dni: '',
  distrito: '',
  event1: null,
  event2: null,
  event3: null,
  password: '',
  confirmPassword: '',
};
const initialForgotForm = {
  email: '',
  code: '',
  newPassword: '',
  confirmNewPassword: '',
};
const initialErrors: ErrorState = { login: '', register: {}, forgot: {} };

function Login({ defaultView = 'login' }: LoginProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [view, setView] = useState<LoginView>(defaultView);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [forgotForm, setForgotForm] = useState(initialForgotForm);
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  
  //const INVALID_EVENT_VALUES = ["Evento 1", "Evento 2", "Evento 3"];
  // --- 2. AÑADE ESTE BLOQUE ---
  // Este hook se ejecuta cada vez que la variable 'view' cambia
  useEffect(() => {
    switch (view) {
      case 'login':
        document.title = 'Tickio - Iniciar Sesión';
        break;
      case 'register':
        document.title = 'Tickio - Registrarse';
        break;
      default:
        document.title = 'Tickio';
    }
  }, [view]); // El 'view' aquí le dice que solo se ejecute cuando 'view' cambie
  // --- FIN DEL BLOQUE AÑADIDO ---
  const [eventos, setEventos] = useState<string[]>([]);

  useEffect(() => {
    // Cargar los enums desde el backend
    fetch(`${import.meta.env.VITE_API_URL}/tipo-eventos`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error('Error al obtener eventos:', err));
  }, []);

  const [distritos, setDistritos] = useState<string[]>([]);

  useEffect(() => {
    // Cargar los enums desde el backend
    fetch(`${import.meta.env.VITE_API_URL}/distritos`)
      .then((res) => res.json())
      .then((data) => setDistritos(data))
      .catch((err) => console.error('Error al obtener distritos:', err));
  }, []);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegisterForm({ ...registerForm, [e.target.id]: e.target.value });
  };

  const handleForgotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotForm({ ...forgotForm, [e.target.id]: e.target.value });
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(initialErrors);

    // 1. Validar campos vacíos
    if (!loginForm.email || !loginForm.password) {
      return setErrors({ ...errors, login: 'Por favor, complete todos los campos.' });
    }

    setLoading(true); 

    try {

      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: loginForm.email,
          contrasena: loginForm.password,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setLoading(false);
        return setErrors({ ...errors, login: data.error || 'Error al iniciar sesión' });
      }

      // 3. Login Exitoso
      console.log('Login Exitoso, Usuario:', data);
      login(data);
      navigate('/');
      // Redirigir a donde necesites (ej: Home)
      // navigate('/home'); 

    } catch (error) {
      console.error("Error de red:", error);
      setLoading(false);
      setErrors({ ...errors, login: 'Error de conexión con el servidor.' });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: RegisterErrors = {};

    if (!registerForm.fullName) newErrors.fullName = 'El nombre es obligatorio.';

    if (!registerForm.email) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!validateEmail(registerForm.email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }

    const phoneRegex = /^\d+$/;
    if (!registerForm.phone) {
      newErrors.phone = 'El teléfono es obligatorio.';
    } else if (!phoneRegex.test(registerForm.phone)) {
      newErrors.phone = 'El teléfono solo debe contener números.';
    } else if (registerForm.phone.length !== 9) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos.';
    }
    /*
    const dniRegex = /^\d+$/;
    if (!registerForm.dni) {
      newErrors.dni = 'El DNI es obligatorio.';
    } else if (!dniRegex.test(registerForm.dni)) {
      newErrors.dni = 'El DNI solo debe contener números.';
    } else if (registerForm.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener 8 dígitos.';
    }*/

    if (!registerForm.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (registerForm.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors({ ...errors, register: newErrors });

    if (Object.keys(newErrors).length === 0) {
      try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: registerForm.fullName,
            correo: registerForm.email,
            telefono: registerForm.phone,
            contrasena: registerForm.password,
            rol:'Cliente',
            Activa: 1,
            distrito: registerForm.distrito,
            tipo1: registerForm.event1 || null, // Envía null si está vacío
            tipo2: registerForm.event2 || null,
            tipo3: registerForm.event3 || null, 
          }),
        });

        // Leemos la respuesta (sea error o éxito)
        const data = await respuesta.json();

        if (!respuesta.ok) {
          // Si la respuesta NO fue 200-299, usamos el 'error' del backend
          throw new Error(data.error || "Error al registrar usuario");
        }

        // Si todo OK:
        alert(`Usuario ${data.nombre} registrado con éxito`);
        changeView("login"); 
        
      } catch (error) {
        // Mostramos el error específico (ej: "El correo ya está registrado")
        console.error(error);
        alert((error as Error).message);
      }
    }
  };

  const handleSendRecoveryEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: ForgotErrors = {};
    if (!forgotForm.email) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!validateEmail(forgotForm.email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }

    setErrors({ ...errors, forgot: newErrors });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      console.log('Simulando envío de correo a:', forgotForm.email);
      setLoading(false);
      setView('forgotCode');
    }, 2000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: ForgotErrors = {};
    const codeRegex = /^\d+$/;

    if (!forgotForm.code) {
      newErrors.code = 'El código es obligatorio.';
    } else if (!codeRegex.test(forgotForm.code) || forgotForm.code.length !== 6) {
      newErrors.code = 'El código debe ser de 6 dígitos numéricos.';
    }

    setErrors({ ...errors, forgot: newErrors });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      console.log('Simulando verificación de código...');
      setLoading(false);
      setView('forgotReset');
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: ForgotErrors = {};

    if (!forgotForm.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria.';
    } else if (forgotForm.newPassword.length < 8) {
      newErrors.newPassword = 'Debe tener al menos 8 caracteres.';
    }

    if (forgotForm.newPassword !== forgotForm.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Las contraseñas no coinciden.';
    }

    setErrors({ ...errors, forgot: newErrors });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      console.log('Simulando cambio de contraseña...');
      setLoading(false);
      setView('forgotSuccess');
    }, 1500);
  };

  const formatEnumName = (text: string) => {
    if (!text) return "";
    return text
      .toLowerCase() // 1. Todo a minúsculas
      .replace(/_/g, " ") // 2. Reemplazar guiones bajos por espacios
      .replace(/\b\w/g, (l) => l.toUpperCase()) // 3. Capitalizar primera letra de cada palabra
      .replace("Bre A", "Breña"); // 4. Caso especial para Breña si viene mal del back
  };

  const changeView = (newView: LoginView) => {
    setLoginForm(initialLoginForm);
    setRegisterForm(initialRegisterForm);
    setForgotForm(initialForgotForm);
    setErrors(initialErrors);
    setView(newView);
  };

  return (
    <div className="login-container">
      <header className="main-header">
        <img src={logoTickio} alt="Tickio Logo" className="header-logo" />
      </header>

      <div className="login-card">
        {(view === 'login' || view === 'register') && !loading && (
          <div className="login-tabs">
            <button
              className={`tab ${view === 'login' ? 'active' : ''}`}
              onClick={() => changeView('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`tab ${view === 'register' ? 'active' : ''}`}
              onClick={() => changeView('register')}
            >
              Registrarse
            </button>
          </div>
        )}

        {view === 'login' && (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="Ingresa su correo electrónico"
                value={loginForm.email}
                onChange={handleLoginChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                value={loginForm.password}
                onChange={handleLoginChange}
              />
            </div>
            {errors.login && <div className="form-login-error">{errors.login}</div>}
            <button type="submit" className="login-button">Iniciar Sesión</button>
          </form>
        )}

        {view === 'register' && (
          <form className="register-form" onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Nombre Completo</label>
              <input
                type="text"
                id="fullName"
                placeholder="Ingresa tu nombre completo"
                value={registerForm.fullName}
                onChange={handleRegisterChange}
              />
              {errors.register.fullName && <div className="form-field-error">{errors.register.fullName}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="Ingresa tu correo electrónico"
                value={registerForm.email}
                onChange={handleRegisterChange}
              />
              {errors.register.email && <div className="form-field-error">{errors.register.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                placeholder="+51"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                maxLength={9}
              />
              {errors.register.phone && <div className="form-field-error">{errors.register.phone}</div>}
            </div>
            {/*
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                placeholder="Ingresa tu número de DNI"
                value={registerForm.dni}
                onChange={handleRegisterChange}
                maxLength={8}
              />
              {errors.register.dni && <div className="form-field-error">{errors.register.dni}</div>}
            </div>*/} 
            {/*
            <div className="form-group">
              <label htmlFor="event1">Eventos Favoritos</label>
              <select id="event1" value={registerForm.event1} onChange={handleRegisterChange}>
                <option>Evento 1</option>
                <option>Evento A</option>
                <option>Evento B</option>
              </select>
            </div>
            <div className="form-group">
              <select id="event2" value={registerForm.event2} onChange={handleRegisterChange}>
                <option>Evento 2</option>
                <option>Evento C</option> 
                <option>Evento D</option>
              </select>
            </div>
            <div className="form-group">
              <select id="event3" value={registerForm.event3} onChange={handleRegisterChange}>
                <option>Evento 3</option>
                <option>Evento E</option>
                <option>Evento F</option>
              </select>
            </div>
            */}
            <div className="form-group">
              <label htmlFor="distrito">Distrito</label>
              <select id="distrito" value={registerForm.distrito} onChange={handleRegisterChange}>
                <option value="">Seleccione su distrito</option>
                {distritos.map((distrito) => (
                  <option key={distrito} value={distrito}>
                    {formatEnumName(distrito)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="event1">Eventos favoritos</label>
              <select id="event1" value={registerForm.event1 || ""} onChange={handleRegisterChange}>
                <option value="">Seleccione una evento</option>
                {eventos.map((evento) => (
                  <option 
                    key={evento} 
                    value={evento}
                    // Deshabilitar si ya está seleccionado en el 2 o el 3
                    disabled={registerForm.event2 === evento || registerForm.event3 === evento}
                    style={{ color: (registerForm.event2 === evento || registerForm.event3 === evento) ? '#ccc' : 'inherit' }}
                  >
                    {formatEnumName(evento)}
                  </option>
                ))}
              </select>
            </div>

            {/* --- REEMPLAZAR BLOQUE EVENTO 2 --- */}
            <div className="form-group">
              <select id="event2" value={registerForm.event2 || ""} onChange={handleRegisterChange}>
                <option value="">Seleccione una evento</option>
                {eventos.map((evento) => (
                  <option 
                    key={evento} 
                    value={evento}
                    // Deshabilitar si ya está seleccionado en el 1 o el 3
                    disabled={registerForm.event1 === evento || registerForm.event3 === evento}
                    style={{ color: (registerForm.event1 === evento || registerForm.event3 === evento) ? '#ccc' : 'inherit' }}
                  >
                    {formatEnumName(evento)}
                  </option>
                ))}
              </select>
            </div>

            {/* --- REEMPLAZAR BLOQUE EVENTO 3 --- */}
            <div className="form-group">
              <select id="event3" value={registerForm.event3 || ""} onChange={handleRegisterChange}>
                <option value="">Seleccione una evento</option>
                {eventos.map((evento) => (
                  <option 
                    key={evento} 
                    value={evento}
                    // Deshabilitar si ya está seleccionado en el 1 o el 2
                    disabled={registerForm.event1 === evento || registerForm.event2 === evento}
                    style={{ color: (registerForm.event1 === evento || registerForm.event2 === evento) ? '#ccc' : 'inherit' }}
                  >
                    {formatEnumName(evento)}
                  </option>
                ))}
              </select>
            </div>
            ----
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Mínimo 8 caracteres"
                value={registerForm.password}
                onChange={handleRegisterChange}
              />
              {errors.register.password && <div className="form-field-error">{errors.register.password}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repite tu contraseña"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
              />
              {errors.register.confirmPassword && <div className="form-field-error">{errors.register.confirmPassword}</div>}
            </div>
            <button type="submit" className="login-button">Registrar</button>
          </form>
        )}

        {view === 'forgotEmail' && (
          <form className="forgot-form" onSubmit={handleSendRecoveryEmail}>
            <h3 className="form-title">Recuperar Contraseña</h3>
            <p className="form-description">Ingresa tu correo electrónico para enviarte un código de recuperación.</p>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="tu-correo@ejemplo.com"
                value={forgotForm.email}
                onChange={handleForgotChange}
                disabled={loading}
              />
              {errors.forgot.email && <div className="form-field-error">{errors.forgot.email}</div>}
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>
            <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); if (!loading) changeView('login'); }}>
              &larr; Volver a Iniciar Sesión
            </a>
          </form>
        )}

        {view === 'forgotCode' && (
          <form className="forgot-form" onSubmit={handleVerifyCode}>
            <h3 className="form-title">Verificar Código</h3>
            <p className="form-description">Ingresa el código de 6 dígitos que enviamos a tu correo.</p>
            <div className="form-group">
              <label htmlFor="code">Código de 6 dígitos</label>
              <input
                type="text"
                id="code"
                placeholder="123456"
                maxLength={6}
                value={forgotForm.code}
                onChange={handleForgotChange}
                disabled={loading}
              />
              {errors.forgot.code && <div className="form-field-error">{errors.forgot.code}</div>}
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
            <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); if (!loading) changeView('login'); }}>
              &larr; Volver a Iniciar Sesión
            </a>
          </form>
        )}

        {view === 'forgotReset' && (
          <form className="forgot-form" onSubmit={handleResetPassword}>
            <h3 className="form-title">Crear Nueva Contraseña</h3>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Mínimo 8 caracteres"
                value={forgotForm.newPassword}
                onChange={handleForgotChange}
                disabled={loading}
              />
              {errors.forgot.newPassword && <div className="form-field-error">{errors.forgot.newPassword}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmNewPassword"
                placeholder="Repite tu nueva contraseña"
                value={forgotForm.confirmNewPassword}
                onChange={handleForgotChange}
                disabled={loading}
              />
              {errors.forgot.confirmNewPassword && <div className="form-field-error">{errors.forgot.confirmNewPassword}</div>}
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}

        {view === 'forgotSuccess' && (
          <div className="success-message">
            <h3 className="form-title">¡Éxito!</h3>
            <p className="form-description">Tu contraseña ha sido actualizada correctamente.</p>
            <button className="login-button" onClick={() => changeView('login')}>
              Ir a Iniciar Sesión
            </button>
          </div>
        )}

        {view === 'login' && (
          <div className="login-links">
            <a href="#" onClick={(e) => { e.preventDefault(); changeView('forgotEmail'); }}>
              ¿Olvidaste tu contraseña?
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); changeView('register'); }}>
              ¿No tienes cuenta? Regístrate
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;