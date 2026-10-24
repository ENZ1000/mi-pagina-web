import React, { useState, useEffect } from 'react';

export default function Orientacion() {
  // Estado para controlar las pestañas activas
  const [activeTab, setActiveTab] = useState('atrasos');

  // TODO: Conectar con tu lógica backend existente para carga de datos de la base de datos
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [historialAtrasos, setHistorialAtrasos] = useState([]);
  const [historialRetiros, setHistorialRetiros] = useState([]);
  const [listaPreu, setListaPreu] = useState([]);

  useEffect(() => {
    // TODO: Llamada API para obtener cursos, alumnos, registros y preuniversitario desde tu backend / base de datos
  }, []);

  const handleAtrasoSubmit = (e) => {
    e.preventDefault();
    // TODO: Lógica de inserción de atraso (POST a tu API)
  };

  const handleRetiroSubmit = (e) => {
    e.preventDefault();
    // TODO: Lógica de inserción de retiro (POST a tu API)
  };

  const handleReunionSubmit = (e) => {
    e.preventDefault();
    // TODO: Lógica de guardado de acta de reunión y preguntas dinámicas (POST a tu API)
  };

  return (
    <div>
      <h2>Departamento de Orientación</h2>
      <p>Gestión de atrasos, retiros, actas de reuniones y control de asistencia a preuniversitario.</p>

      {/* NAVEGACIÓN POR PESTAÑAS (TABS) */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'atrasos' ? 'active' : ''}`} 
          onClick={() => setActiveTab('atrasos')}
        >
          ⏰ Registro de Atrasos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'retiros' ? 'active' : ''}`} 
          onClick={() => setActiveTab('retiros')}
        >
          🚗 Registro de Retiros
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reuniones' ? 'active' : ''}`} 
          onClick={() => setActiveTab('reuniones')}
        >
          🤝 Reuniones
        </button>
        <button 
          className={`tab-btn ${activeTab === 'preu' ? 'active' : ''}`} 
          onClick={() => setActiveTab('preu')}
        >
          🎓 Preuniversitario
        </button>
      </div>

      {/* SECCIÓN 1: ATRASOS */}
      <section className={`tab-content ${activeTab === 'atrasos' ? 'active' : ''}`} style={{ display: activeTab === 'atrasos' ? 'block' : 'none' }}>
        <h3>Ingresar Registro de Atraso (Llegada &gt; 8:10 AM)</h3>
        <form onSubmit={handleAtrasoSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="atraso-curso">Curso</label>
              <select id="atraso-curso" required>
                <option value="">Cargando cursos...</option>
                {/* Mapear cursos desde la base de datos */}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="atraso-alumno">Nombre del Alumno</label>
              <select id="atraso-alumno" required>
                <option value="">Seleccione un curso primero...</option>
                {/* Mapear alumnos filtrados por curso desde la base de datos */}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="atraso-fecha">Fecha (Hoy)</label>
              <input type="date" id="atraso-fecha" required readOnly />
            </div>

            <div className="input-group">
              <label htmlFor="atraso-hora">Hora de Llegada</label>
              <input type="time" id="atraso-hora" required />
            </div>
          </div>

          <button type="submit" className="btn-submit btn-form">Registrar Atraso</button>
        </form>

        <hr className="divider" />

        <h3>Historial de Atrasos de Hoy</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora Llegada</th>
              <th>Curso</th>
              <th>Alumno</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: Mapear historialAtrasos de la base de datos */}
          </tbody>
        </table>
      </section>

      {/* SECCIÓN 2: RETIROS */}
      <section className={`tab-content ${activeTab === 'retiros' ? 'active' : ''}`} style={{ display: activeTab === 'retiros' ? 'block' : 'none' }}>
        <h3>Registrar Retiro de Alumno</h3>
        <form onSubmit={handleRetiroSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="retiro-curso">Curso</label>
              <select id="retiro-curso" required>
                <option value="">Cargando cursos...</option>
                {/* Mapear cursos desde la base de datos */}
              </select>
            </div>
            
            <div className="input-group">
              <label htmlFor="retiro-alumno">Nombre del Alumno</label>
              <select id="retiro-alumno" required>
                <option value="">Seleccione un curso primero...</option>
                {/* Mapear alumnos desde la base de datos */}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="retiro-fecha">Fecha (Hoy)</label>
              <input type="date" id="retiro-fecha" required readOnly />
            </div>

            <div className="input-group">
              <label htmlFor="retiro-motivo">Motivo del Retiro</label>
              <input type="text" id="retiro-motivo" placeholder="ej. Cita médica, Asunto personal" required />
            </div>
          </div>

          <button type="submit" className="btn-submit btn-form">Registrar Retiro</button>
        </form>

        <hr className="divider" />

        <h3>Historial de Retiros de Hoy</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Curso</th>
              <th>Alumno</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: Mapear historialRetiros de la base de datos */}
          </tbody>
        </table>
      </section>

      {/* SECCIÓN 3: REUNIONES */}
      <section className={`tab-content ${activeTab === 'reuniones' ? 'active' : ''}`} style={{ display: activeTab === 'reuniones' ? 'block' : 'none' }}>
        <h3>Registro de Reunión con Apoderados</h3>
        <form onSubmit={handleReunionSubmit}>
          <div className="input-group">
            <label htmlFor="reunion-resumen">Resumen de la Reunión</label>
            <textarea id="reunion-resumen" rows="3" placeholder="Puntos principales tratados durante la sesión..." required></textarea>
          </div>

          <div className="input-group">
            <label>Preguntas y Respuestas de Apoderados</label>
            <div id="contenedor-preguntas">
              <div className="qa-pair">
                <input type="text" className="qa-pregunta" placeholder="Escriba la pregunta del apoderado..." required />
                <textarea className="qa-respuesta" rows="2" placeholder="Escriba la respuesta dada..."></textarea>
              </div>
            </div>
            <button type="button" className="btn-secondary">+ Agregar Pregunta</button>
          </div>

          <div className="input-group">
            <label>Checklist de Asistencia de Apoderados</label>
            <div className="checklist-grid">
              {/* TODO: Mapear apoderados del curso correspondiente desde la base de datos */}
            </div>
          </div>

          <button type="submit" className="btn-submit btn-form">Guardar Acta de Reunión</button>
        </form>
      </section>

      {/* SECCIÓN 4: PREUNIVERSITARIO */}
      <section className={`tab-content ${activeTab === 'preu' ? 'active' : ''}`} style={{ display: activeTab === 'preu' ? 'block' : 'none' }}>
        <div className="info-box">
          ℹ️ <strong>Aviso:</strong> Los alumnos inscritos en esta lista asisten al Preuniversitario del colegio, por lo que cuentan con <strong>permiso de salida autorizado</strong> sin necesidad de completar un formulario de retiro individual.
        </div>

        <div className="table-header-actions">
          <h3>Lista de Alumnos Autorizados (Preu Colegio)</h3>
          <div className="search-box">
            <input type="text" placeholder="🔍 Buscar por Alumno, RUT o Curso..." />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre Alumno</th>
              <th>Curso</th>
              <th>Días de Asistencia</th>
              <th>Estado Permiso</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: Mapear listaPreu obtenida de la base de datos */}
          </tbody>
        </table>
      </section>
    </div>
  );
}