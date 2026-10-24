import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Registro from './Registro';
import Home from './Home';
import Director from './Director';
import Orientacion from './Orientacion';
import Salud from './Salud';
import './style.css'; 

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="usm-header">
      <div className="usm-brand">
        <h1 className="usm-title">Portal Escolar</h1>
      </div>

      <nav className="usm-nav">
        {!user ? (
          <>
            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
            <Link to="/registro" className="nav-link">Registrarse</Link> {/* <Link opcional en la barra si no ha iniciado sesión */}
          </>
        ) : (
          <>
            <Link to="/home" className="nav-link">Inicio</Link>
            
            {user.cargo === 'Director' && (
              <Link to="/director" className="nav-link">Director</Link>
            )}
            
            {user.cargo === 'Orientacion' && (
              <Link to="/orientacion" className="nav-link">Orientación</Link>
            )}
            
            {user.cargo === 'Salud' && (
              <Link to="/salud" className="nav-link">Salud</Link>
            )}

            <button onClick={handleLogout} className="btn-danger" style={{ marginLeft: '20px' }}>
              Cerrar Sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Contenedor principal flex para empujar el contenido */}
        <div className="app-container">
          
          <Navbar />

          {/* Contenedor central alineado */}
          <main className="main-content">
            
            {/* Panel de tarjeta blanca con borde superior */}
            <div className="card-panel">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} /> {/* <--- 2. Agregas la ruta pública de registro */}

                <Route element={<ProtectedRoute />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/director" element={<Director />} />
                  <Route path="/orientacion" element={<Orientacion />} />
                  <Route path="/salud" element={<Salud />} />
                </Route>
              </Routes>
            </div>
            
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;