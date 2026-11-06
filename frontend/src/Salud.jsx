import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Salud() {
  const { user } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);

  // Estados del formulario
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [rutAlumnoSeleccionado, setRutAlumnoSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [diasReposo, setDiasReposo] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [eximidoFisico, setEximidoFisico] = useState(false);
  const [archivoLicencia, setArchivoLicencia] = useState(null);

  const [fechaIngreso] = useState(() => {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    return hoy.toISOString().split('T')[0];
  });

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/alumnos/cursos');
        const data = await res.json();
        setCursos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      }
    };
    cargarCursos();
  }, []);

  const handleCursoChange = async (e) => {
    const idCurso = e.target.value;
    setCursoSeleccionado(idCurso);
    setRutAlumnoSeleccionado('');
    setAlumnos([]);

    if (idCurso) {
      try {
        const res = await fetch('http://localhost:3000/api/alumnos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_curso: idCurso })
        });
        const data = await res.json();
        setAlumnos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      }
    }
  };

  const handleLicenciaSubmit = async (e) => {
    e.preventDefault();

    if (!diasReposo || parseInt(diasReposo, 10) <= 0) {
      alert('Por favor ingrese una cantidad válida de días de reposo.');
      return;
    }

    const formData = new FormData();
    formData.append('rut_alumno', rutAlumnoSeleccionado);
    formData.append('diagnostico', diagnostico);
    formData.append('dias_reposo', parseInt(diasReposo, 10));
    formData.append('fecha_inicio', fechaInicio);
    formData.append('eximido_fisico', eximidoFisico);
    if (archivoLicencia) {
      formData.append('archivo_licencia', archivoLicencia);
    }

    try {
      const res = await fetch('http://localhost:3000/api/salud/nueva-licencia', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('Licencia médica registrada con éxito.');
        setRutAlumnoSeleccionado('');
        setFechaInicio('');
        setDiasReposo('');
        setDiagnostico('');
        setEximidoFisico(false);
        setArchivoLicencia(null);
        const fileInput = document.getElementById('salud-archivo');
        if (fileInput) fileInput.value = '';
      } else {
        alert('Error al guardar la licencia.');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/home">← Volver al Inicio</Link>
      </div>

      <div className="table-header-actions">
        <div>
          <h2>Departamento de Salud</h2>
          <p style={{ color: 'var(--text-muted)' }}>Registro de licencias médicas de estudiantes.</p>
        </div>

        {['Salud', 'Director'].includes(user?.cargo) && (
          <Link to="/salud/historial" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Ver Historial de Licencias
          </Link>
        )}
      </div>

      <form onSubmit={handleLicenciaSubmit} style={{ marginTop: '1.5rem' }}>
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="salud-curso">Curso</label>
            <select
              id="salud-curso"
              value={cursoSeleccionado}
              onChange={handleCursoChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            >
              <option value="">Seleccione un curso...</option>
              {cursos.map((c) => (
                <option key={c.id_curso} value={c.id_curso}>
                  {c.numero}° {c.letra}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="salud-alumno">Nombre del Alumno</label>
            <select
              id="salud-alumno"
              value={rutAlumnoSeleccionado}
              onChange={(e) => setRutAlumnoSeleccionado(e.target.value)}
              required
              disabled={!cursoSeleccionado || alumnos.length === 0}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            >
              <option value="">Seleccione un alumno...</option>
              {alumnos.map((a) => (
                <option key={a.rut} value={a.rut}>
                  {a.nombre_completo}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="salud-fecha-ingreso">Fecha de Ingreso (Hoy)</label>
            <input type="date" id="salud-fecha-ingreso" value={fechaIngreso} required readOnly />
          </div>

          <div className="input-group">
            <label htmlFor="salud-inicio">Licencia Desde</label>
            <input
              type="date"
              id="salud-inicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="salud-duracion">Duración (Días)</label>
            <input
              type="number"
              id="salud-duracion"
              min="1"
              placeholder="Ej. 3"
              value={diasReposo}
              onChange={(e) => setDiasReposo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="salud-diagnostico">Diagnóstico</label>
            <input
              type="text"
              id="salud-diagnostico"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              placeholder="Ej. Cuadro viral respiratorio"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="salud-archivo">Documento (PDF/IMG)</label>
            <input
              type="file"
              id="salud-archivo"
              accept=".pdf, image/*"
              onChange={(e) => setArchivoLicencia(e.target.files[0])}
              required
            />
          </div>

          <div className="checkbox-container" style={{ marginTop: '1.8rem' }}>
            <label htmlFor="salud-eximido">
              <input
                type="checkbox"
                id="salud-eximido"
                checked={eximidoFisico}
                onChange={(e) => setEximidoFisico(e.target.checked)}
              />
              Eximido Educación Física
            </label>
          </div>
        </div>

        <button type="submit" className="btn-submit btn-form">
          Guardar Licencia
        </button>
      </form>
    </div>
  );
}