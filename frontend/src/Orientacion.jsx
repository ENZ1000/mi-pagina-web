import React, { useState } from 'react';

export default function Orientacion() {
  const [activeTab, setActiveTab] = useState('atrasos');

  // Datos de ejemplo para historial (puedes conectarlos a tu backend)
  const [historialAtrasos] = useState([
    { fecha: '2026-05-05', hora: '08:02 hrs', curso: '1° Medio A', alumno: 'Felipe Castro Gloria', tipo: '' },
    { fecha: '2026-05-02', hora: '10:05 hrs', curso: '2° Medio B', alumno: 'Sofia Muñoz', tipo: 'atraso-grave' },
    { fecha: '2026-04-11', hora: '08:15 hrs', curso: '3° Medio A', alumno: 'Javier Muñoz Díaz', tipo: 'atraso-leve' },
    { fecha: '2026-04-10', hora: '08:05 hrs', curso: '3° Medio A', alumno: 'Javier Muñoz Díaz', tipo: '' }
  ]);

  const [historialRetiros] = useState([]);
  const [listaPreu] = useState([]);

  const handleAtrasoSubmit = (e) => { e.preventDefault(); };
  const handleRetiroSubmit = (e) => { e.preventDefault(); };
  const handleReunionSubmit = (e) => { e.preventDefault(); };

  return (
    <div>
      <h2>Departamento de Orientación</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Gestión de atrasos, retiros, actas de reuniones y control de asistencia a preuniversitario.
      </p>

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
      <div className={`tab-content ${activeTab === 'atrasos' ? 'active' : ''}`}>
        <h3>Ingresar Registro de Atraso (Llegada &gt; 8:10 AM)</h3>
        <form onSubmit={handleAtrasoSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="atraso-curso">Curso</label>
              <select id="atraso-curso" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <option value="">Seleccione un curso...</option>
                <option value="1">1° Medio A</option>
                <option value="2">2° Medio B</option>
                <option value="3">3° Medio A</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="atraso-alumno">Nombre del Alumno</label>
              <select id="atraso-alumno" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <option value="">Seleccione un curso primero...</option>
                <option value="1">Javier Muñoz Díaz</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="atraso-fecha">Fecha (Hoy)</label>
              <input type="date" id="atraso-fecha" defaultValue="2026-10-12" required readOnly />
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
            {historialAtrasos.map((item, index) => (
              <tr key={index} className={item.tipo}>
                <td>{item.fecha}</td>
                <td>{item.hora}</td>
                <td>{item.curso}</td>
                <td>{item.alumno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECCIÓN 2: RETIROS */}
      <div className={`tab-content ${activeTab === 'retiros' ? 'active' : ''}`}>
        <h3>Registrar Retiro de Alumno</h3>
        <form onSubmit={handleRetiroSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-grid">
            <div className="input-group">
              <label>Curso</label>
              <select required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <option value="">Seleccione un curso...</option>
                <option value="1">1° Medio A</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Nombre del Alumno</label>
              <select required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <option value="">Seleccione un curso primero...</option>
              </select>
            </div>

            <div className="input-group">
              <label>Fecha (Hoy)</label>
              <input type="date" defaultValue="2026-10-12" required readOnly />
            </div>

            <div className="input-group">
              <label>Motivo del Retiro</label>
              <input type="text" placeholder="ej. Cita médica" required />
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
            {/* Mapeo de retiros */}
          </tbody>
        </table>
      </div>

      {/* SECCIÓN 3: REUNIONES */}
      <div className={`tab-content ${activeTab === 'reuniones' ? 'active' : ''}`}>
        <h3>Registro de Reunión con Apoderados</h3>
        <form onSubmit={handleReunionSubmit} style={{ marginTop: '1rem' }}>
          <div className="input-group">
            <label>Resumen de la Reunión</label>
            <textarea rows="3" placeholder="Puntos principales tratados..." required></textarea>
          </div>

          <div className="input-group">
            <label>Preguntas y Respuestas de Apoderados</label>
            <div className="qa-pair">
              <input type="text" className="qa-pregunta" placeholder="Escriba la pregunta..." required />
              <textarea rows="2" placeholder="Escriba la respuesta..." style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '0.5rem' }}></textarea>
            </div>
            <button type="button" className="btn-secondary">+ Agregar Pregunta</button>
          </div>

          <button type="submit" className="btn-submit btn-form">Guardar Acta de Reunión</button>
        </form>
      </div>

      {/* SECCIÓN 4: PREUNIVERSITARIO */}
      <div className={`tab-content ${activeTab === 'preu' ? 'active' : ''}`}>
        <div className="info-box">
          ℹ️ <strong>Aviso:</strong> Los alumnos inscritos en esta lista asisten al Preuniversitario del colegio con permiso autorizado.
        </div>

        <div className="table-header-actions">
          <h3>Lista de Alumnos Autorizados</h3>
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
            {/* Mapeo preuniversitario */}
          </tbody>
        </table>
      </div>
    </div>
  );
}