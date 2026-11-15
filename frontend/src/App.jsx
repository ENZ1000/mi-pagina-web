import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Registro from './Registro';
import Home from './Home';
import Director from './Director';
// Importamos la nueva vista que crearemos
import BuscarAlumno from './BuscarAlumno'; 
import Orientacion from './Orientacion';
import Salud from './Salud';
import HistorialSalud from './HistorialSalud';
import Atrasos from './Atrasos';
import Retiros from './Retiros';
import Reuniones from './Reuniones';
import Preuniversitario from './Preuniversitario';
import './style.css';
import DetalleAlumno from './DetalleAlumno';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to={user ? "/home" : "/login"} className="brand">
        Colegio - Intranet
      </Link>

      <nav>
        <ul>
          {!user ? (
            <>
              <li><Link to="/login">Iniciar Sesión</Link></li>
              <li><Link to="/registro">Registrarse</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/home">Inicio</Link></li>
              <li>
                <button onClick={handleLogout} className="btn-logout" style={{ border: 'none', color: '#fff', cursor: 'pointer' }}>
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';

  return (
    <div className={isAuthPage ? "login-wrapper" : "app-container"}>
      {!isAuthPage && <Navbar />}

      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      ) : (
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/director" element={<Director />} />
              
              {/* RUTAS DEL DIRECTOR */}
              {/* Reutilizamos Atrasos pero le pasamos la prop modoDirector */}
              <Route path="/director/atrasos" element={<Atrasos modoDirector={true} />} />
              <Route path="/director/buscar-alumno" element={<BuscarAlumno />} />
              {/* Ruta futura para ver el detalle de un alumno específico */}
              <Route path="/director/alumno/:rut" element={<DetalleAlumno />} />

              <Route path="/orientacion" element={<Orientacion />} />
              <Route path="/director/alumno/:rut" element={<DetalleAlumno />} />
              <Route path="/atrasos" element={<Atrasos />} />
              <Route path="/retiros" element={<Retiros />} />
              <Route path="/reuniones" element={<Reuniones />} />
              <Route path="/preuniversitarios" element={<Preuniversitario />} />
              <Route path="/salud" element={<Salud />} />
              <Route path="/salud/historial" element={<HistorialSalud />} />
            </Route>
          </Routes>
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}