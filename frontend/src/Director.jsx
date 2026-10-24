import React from 'react';
import { Link } from 'react-router-dom';

export default function Director() {
  // TODO: Aquí puedes integrar la lógica de obtención de datos del rol Director si es necesario
  
  return (
    <div>
      <h2>Módulo de Dirección</h2>
      <p>Seleccione una de las siguientes opciones de gestión académica y disciplinaria:</p>

      <div className="actions-grid">
        <Link to="/director/atrasos" className="action-card">
          <h3>📋 Ver Atrasos</h3>
          <p>Revisar el registro de atrasos y asistencia diaria de los estudiantes.</p>
        </Link>

        <Link to="/director/buscar-alumno" className="action-card">
          <h3>🔍 Buscar Alumno</h3>
          <p>Consultar fichas, historial y datos de matrícula por estudiante.</p>
        </Link>
      </div>
    </div>
  );
}