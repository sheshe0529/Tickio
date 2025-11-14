import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Definimos qué forma tiene nuestro usuario
interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  telefono?: string;
  distrito?: string;       // 👈 Nuevo
  tipo1?: string | null;   // 👈 Nuevo
  tipo2?: string | null;   // 👈 Nuevo
  tipo3?: string | null;   // 👈 Nuevo
  RUC?: string | null; // 👈 AÑADE ESTO (para datos del organizador)
  razon_social?: string | null; // 👈 AÑADE ESTO
  // Agrega más campos si los necesitas
}

interface AuthContextType {
  user: Usuario | null;
  login: (userData: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  // Al cargar la app, revisamos si hay un usuario guardado en el navegador
  useEffect(() => {
    const storedUser = localStorage.getItem('usuarioTickio');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: Usuario) => {
    setUser(userData);
    localStorage.setItem('usuarioTickio', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuarioTickio');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Un hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};