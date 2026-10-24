import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recupera ambos datos almacenados en las cookies del usuario
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');
    
    // Solo restaura la sesión si ambos existen
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        // convierte el texto JSON para convertirlo nuevamente en objeto
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al recuperar el usuario del localStorage:', error);
        // Si el JSON guardado está corrupto, limpiamos la sesión defectuosa
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(newUser)); // Guardamos el objeto como texto
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};