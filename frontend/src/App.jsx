import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Registro from './Registro';
import Home from './Home';
import Director from './Director';
import Orientacion from './Orientacion';
import Salud from './Salud';
import Atrasos from './Atrasos';
import Retiros from './Retiros';
import './style.css'; 

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
              <li><Link to="/home">Home</Link></li>
              
              {user.cargo === 'Director' && (
                <li><Link to="/director">Director</Link></li>
              )}
              
              {['Orientacion', 'Director', 'Salud'].includes(user.cargo) && (
                <>
                <li><Link to="/atrasos">Atrasos</Link></li>
                <li><Link to="/retiros">Retiros</Link></li>
                </>
              )}
              
              {user.cargo === 'Salud' && (
                <li><Link to="/salud">Salud</Link></li>
              )}

              <li>
                <button onClick={handleLogout} className="btn-logout btn-submit" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', cursor: 'pointer' }}>
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
              <Route path="/atrasos" element={<Atrasos />} />
              <Route path="/retiros" element={<Retiros />} />
              <Route path="/salud" element={<Salud />} />
            </Route>
          </Routes>
        </main>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;