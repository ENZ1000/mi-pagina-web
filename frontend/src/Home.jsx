import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const modulos = [
    {
      titulo: 'Panel de Dirección',
      descripcion: 'Gestión institucional, reportería y administración general.',
      ruta: '/director',
      permitido: user?.cargo === 'Director'
    },
    {
      titulo: 'Control de Atrasos',
      descripcion: 'Registro diario y seguimiento de puntualidad de alumnos.',
      ruta: '/atrasos',
      permitido: ['Orientacion', 'Director', 'Salud'].includes(user?.cargo)
    },
    {
      titulo: 'Retiro de Alumnos',
      descripcion: 'Autorizaciones y registros de salida anticipada.',
      ruta: '/retiros',
      permitido: ['Orientacion', 'Director', 'Salud'].includes(user?.cargo)
    },
    {
      titulo: 'Reuniones de Apoderados',
      descripcion: 'Agendamiento y control de citaciones a apoderados.',
      ruta: '/reuniones',
      permitido: ['Orientacion', 'Director', 'Salud'].includes(user?.cargo)
    },
    {
      titulo: 'Preuniversitarios',
      descripcion: 'Inscripción y seguimiento de talleres vocacionales.',
      ruta: '/preuniversitarios',
      permitido: ['Orientacion', 'Director', 'Salud'].includes(user?.cargo)
    },
    {
      titulo: 'Registro de Licencias',
      descripcion: 'Ingreso de nuevas licencias médicas y certificados de reposo.',
      ruta: '/salud',
      permitido: ['Salud', 'Director'].includes(user?.cargo)
    },
    {
      titulo: 'Historial de Licencias',
      descripcion: 'Consulta de licencias médicas activas, finalizadas y descarga de archivos.',
      ruta: '/salud/historial',
      permitido: ['Salud', 'Director'].includes(user?.cargo)
    }
  ];

  const modulosVisibles = modulos.filter((m) => m.permitido);

  return (
    <div style={{ position: 'relative', minHeight: '70vh' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Portal Institucional</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Selecciona una sección de trabajo autorizada para tu perfil ({user?.cargo || 'Usuario'}).
        </p>
      </div>

      <div className="actions-grid">
        {modulosVisibles.map((mod) => (
          <Link key={mod.ruta} to={mod.ruta} className="action-card">
            <h3>{mod.titulo}</h3>
            <p>{mod.descripcion}</p>
          </Link>
        ))}

        {modulosVisibles.length === 0 && (
          <div className="info-box">
            No tienes módulos asignados con tu cargo actual.
          </div>
        )}
      </div>

      {/* Botón flotante de Luna / Sol en la esquina inferior */}
      <button 
        onClick={toggleDarkMode} 
        className="theme-toggle-btn"
        title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {darkMode ? (
          // Icono de Sol (cuando está en modo oscuro, para pasar a claro)
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line>
          </svg>
        ) : (
          // Icono de Luna (cuando está en modo claro, para pasar a oscuro)
          <svg viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}