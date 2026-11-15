import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

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
    <div>
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
    </div>
  );
}