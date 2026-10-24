import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // permite navegacion para poder redirigir


export default function Registro() {
  const [formData, setFormData] = useState({
    rut: '',
    correo_institucional: '',
    contrasena: '',
    cargo: 'Orientacion',
    nombre_completo: ''
  });

  const navigate = useNavigate(); //Inicializa el hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/registro', formData);
      alert(response.data.message);
      // Redirige al usuario a login tras el éxito
      navigate('/login');

    } catch (error) {
      alert('Error al registrar: ' + (error.response?.data?.error || 'Verifica los datos'));
    }
  };

  return (
    <form onSubmit={handleRegistro}>
      <h2>Registrar Usuario</h2>
      <input type="text" name="rut" placeholder="RUT (ej. 12345678-9)" maxLength="12" onChange={handleChange} required />
      <input type="text" name="nombre_completo" placeholder="Nombre completo" onChange={handleChange} required />
      <input type="email" name="correo_institucional" placeholder="Correo electrónico" onChange={handleChange} required />
      <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
      <select name="cargo" onChange={handleChange}>
        <option value="Orientacion">Orientacion</option>
        <option value="Salud">Salud</option>
        <option value="UTP">UTP</option>
        <option value="Convivencia">Convivencia</option>
      </select>
      <button type="submit">Registrarse</button>
    </form>
  );
}