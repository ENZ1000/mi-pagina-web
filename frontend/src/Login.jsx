import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Login() {
  const [correo_institucional, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { correo_institucional, contrasena });
      const { token, usuario } = response.data;
      login(token, usuario);
      navigate('/home');
    } catch (error) {
      alert('Error en el login: Credenciales incorrectas');
    }
  };

  return (
    <div className="login-card">
      <div className="login-header">
        <h1>Portal Escolar</h1>
        <p>Inicie sesión con su cuenta institucional</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Usuario / RUT</label>
          <input
            type="email" 
            placeholder="ej. admin@colegio.cl"
            value={correo_institucional}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-submit">Ingresar</button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/registro" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>
          ¿No tienes cuenta? Regístrate aquí
        </Link>
      </div>
    </div>
  );
}