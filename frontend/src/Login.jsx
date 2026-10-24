import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Login() {
  const [correo_institucional, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); //Inicializa el hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { correo_institucional, contrasena });
      const { token, usuario } = response.data;
      //guarda el contexto y localStorage
      login(token, usuario);

      navigate('/home');
      
    } catch (error) {
      alert('Error en el login: Credenciales incorrectas');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <input
        type="email" 
        placeholder="Correo electrónico"
        value={correo_institucional}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}