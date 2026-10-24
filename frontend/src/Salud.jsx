import React, { useState, useEffect } from 'react';

export default function Salud() {
  const [filtroEstado, setFiltroEstado] = useState('activa');

  // TODO: Conectar con tu lógica backend existente para carga de datos de la base de datos
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    // TODO: Llamada API para obtener los cursos, alumnos y el listado de licencias médicas desde la base de datos
  }, []);

  const handleLicenciaSubmit = (e) => {
    e.preventDefault();
    // TODO: Lógica de inserción de la nueva licencia médica (POST a tu API backend)
  };

  return (
    <div>
      <h2>Departamento de Salud - Licencias Médicas</h2>
      <p>Gestión y registro de licencias médicas de estudiantes, control de estados y vigencia.</p>

      {/* FORMULARIO DE REGISTRO DE LICENCIA */}
      <section className="card-section">
        <h3>Registrar Nueva Licencia Médica</h3>
        <form onSubmit={handleLicenciaSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="salud-curso">Curso</label>
              <select id="salud-curso" required>
                <option value="">Seleccione un curso...</option>
                {/* TODO: Mapear cursos obtenidos de la base de datos */}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="salud-alumno">Nombre del Alumno</label>
              <select id="salud-alumno" required>
                <option value="">Seleccione un curso primero...</option>
                {/* TODO: Mapear alumnos filtrados por curso desde la base de datos */}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="salud-fecha-ingreso">Fecha de Ingreso (Hoy)</label>
              <input type="date" id="salud-fecha-ingreso" required readOnly />
            </div>

            <div className="input-group">
              <label htmlFor="salud-inicio">Licencia Desde</label>
              <input type="date" id="salud-inicio" required />
            </div>

            <div className="input-group">
              <label htmlFor="salud-termino">Licencia Hasta</label>
              <input type="date" id="salud-termino" required />
            </div>
          </div>

          <button type="submit" className="btn-submit btn-form">Guardar Licencia</button>
        </form>
      </section>

      <hr className="divider" />

      {/* SECCIÓN DE FICHAS Y FILTROS */}
      <section>
        <div className="table-header-actions">
          <h3>Fichas de Estudiantes con Licencia</h3>
          
          {/* FILTRO DE ACTIVAS / PASADAS */}
          <div className="filter-box">
            <label htmlFor="filtro-estado" style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem' }}>Filtrar:</label>
            <select 
              id="filtro-estado" 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="activa">Activas</option>
              <option value="pasada">Pasadas</option>
            </select>
          </div>
        </div>

        <table className="data-table" id="tabla-licencias">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Alumno</th>
              <th>Ingreso Sistema</th>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: Mapear el listado de licencias médicas desde la base de datos aplicando el filtroEstado */}
          </tbody>
        </table>
      </section>
    </div>
  );
}