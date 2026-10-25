import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  const [formData, setFormData] = useState({
    rut: '',
    correo_institucional: '',
    contrasena: '',
    cargo: 'Orientacion',
    nombre_completo: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/registro', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      alert('Error al registrar: ' + (error.response?.data?.error || 'Verifica los datos'));
    }
  };

  return (
    <div className="login-card">
      <div className="login-header">
        <h1>Portal Escolar</h1>
        <p>Registrar Nuevo Usuario</p>
      </div>

      <form onSubmit={handleRegistro}>
        <div className="input-group">
          <label>RUT</label>
          <input type="text" name="rut" placeholder="12345678-9" maxLength="12" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Nombre Completo</label>
          <input type="text" name="nombre_completo" placeholder="Nombre y Apellido" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Correo Electrónico</label>
          <input type="email" name="correo_institucional" placeholder="correo@colegio.cl" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input type="password" name="contrasena" placeholder="********" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Cargo</label>
          <select name="cargo" onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <option value="Orientacion">Orientacion</option>
            <option value="Salud">Salud</option>
            <option value="UTP">UTP</option>
            <option value="Convivencia">Convivencia</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">Registrarse</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
    </div>
  );
}