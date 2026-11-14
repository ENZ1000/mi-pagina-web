import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Preuniversitarios() {
  const [vista, setVista] = useState('lista'); // 'lista' o 'registro'
  
  const [preuniversitarios, setPreuniversitarios] = useState([]);
  const [preuSeleccionado, setPreuSeleccionado] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Estados para el formulario de registro
  const [cursos, setCursos] = useState([]);
  const [alumnosCurso, setAlumnosCurso] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  const [preuRegistroSeleccionado, setPreuRegistroSeleccionado] = useState('');

  // Cargar lista de preuniversitarios al iniciar
  const fetchPreuniversitarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/preuniversitarios');
      // Extraemos de response.data.data debido a la estructura del backend
      const data = response.data.data || response.data || [];
      setPreuniversitarios(data);
      if (data.length > 0 && !preuSeleccionado) {
        const primerId = data[0].id_preu || data[0].id || data[0].id_preuniversitario;
        setPreuSeleccionado(primerId);
        setPreuRegistroSeleccionado(primerId);
      }
    } catch (error) {
      console.error('Error al cargar preuniversitarios:', error);
      setPreuniversitarios([]);
    }
  };

  useEffect(() => {
    fetchPreuniversitarios();
    axios.get('http://localhost:3000/api/alumnos/cursos')
      .then(res => setCursos(res.data.data || res.data || []))
      .catch(err => console.error('Error al cargar cursos:', err));
  }, []);

  // Cargar alumnos autorizados cuando cambia el preuniversitario seleccionado
  useEffect(() => {
    if (!preuSeleccionado) return;
    const fetchAlumnos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/preuniversitarios/${preuSeleccionado}/alumnos`);
        setAlumnos(response.data.data || response.data || []);
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
        setAlumnos([]);
      }
    };
    fetchAlumnos();
  }, [preuSeleccionado]);

  const handleCursoChange = async (e) => {
    const cursoId = e.target.value;
    setCursoSeleccionado(cursoId);
    setAlumnoSeleccionado('');
    setAlumnosCurso([]);

    if (!cursoId) return;

    try {
      const response = await axios.post('http://localhost:3000/api/alumnos', { id_curso: cursoId });
      setAlumnosCurso(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error al obtener alumnos del curso:', error);
    }
  };

  const handleInscripcionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/preuniversitarios/inscribir', {
        rut_alumno: alumnoSeleccionado,
        id_preu: preuRegistroSeleccionado
      });
      alert('¡Alumno inscrito con éxito en el preuniversitario!');
      setAlumnoSeleccionado('');
      setCursoSeleccionado('');
      setAlumnosCurso([]);
      setVista('lista');
      if (preuSeleccionado) {
        const response = await axios.get(`http://localhost:3000/api/preuniversitarios/${preuSeleccionado}/alumnos`);
        setAlumnos(response.data.data || response.data || []);
      }
    } catch (error) {
      console.error('Error al inscribir alumno:', error);
      alert('Error al registrar la inscripción.');
    }
  };

  const alumnosFiltrados = Array.isArray(alumnos) ? alumnos.filter(alumno => {
    if (!alumno) return false;
    const texto = busqueda.toLowerCase();
    return (
      (alumno.nombre_completo && alumno.nombre_completo.toLowerCase().includes(texto)) ||
      (alumno.curso && alumno.curso.toLowerCase().includes(texto)) ||
      (alumno.correo_electronico && alumno.correo_electronico.toLowerCase().includes(texto))
    );
  }) : [];

  // ================= VISTA 2: FORMULARIO DE REGISTRO =================
  if (vista === 'registro') {
    return (
      <div>
        <h2>Inscribir Alumno a Preuniversitario</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Seleccione el curso, el alumno y el preuniversitario correspondiente.
        </p>

        <section className="card-section">
          <form onSubmit={handleInscripcionSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-grid">
              <div className="input-group">
                <label>Curso</label>
                <select 
                  value={cursoSeleccionado}
                  onChange={handleCursoChange}
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                  <option value="">Seleccione un curso...</option>
                  {cursos.map((curso) => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.numero}° Medio {curso.letra}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Nombre del Alumno</label>
                <select 
                  value={alumnoSeleccionado}
                  onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                  <option value="">{cursoSeleccionado ? 'Seleccione un alumno...' : 'Seleccione un curso primero...'}</option>
                  {alumnosCurso.map((alumno) => (
                    <option key={alumno.rut} value={alumno.rut}>
                      {alumno.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Preuniversitario</label>
                <select 
                  value={preuRegistroSeleccionado}
                  onChange={(e) => setPreuRegistroSeleccionado(e.target.value)}
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                  <option value="">Seleccione un preuniversitario...</option>
                  {preuniversitarios.map((preu, idx) => {
                    const id = preu.id_preu || preu.id || preu.id_preuniversitario || idx;
                    const nombre = preu.nombre_preu || preu.nombre || preu.descripcion || 'Preuniversitario';
                    const entidad = preu.entidad || preu.institucion || '';
                    return (
                      <option key={id} value={id}>
                        {nombre} {entidad ? `(${entidad})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn-submit btn-form">
                Guardar Inscripción
              </button>
              <button 
                type="button" 
                onClick={() => setVista('lista')} 
                style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
              >
                Volver
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  // ================= VISTA 1: LISTA PRINCIPAL =================
  return (
    <div>
      {/* Aviso superior */}
      <div style={{ background: '#e7f1ff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #0d6efd', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span>ℹ️</span>
        <span style={{ fontSize: '0.9rem', color: '#084298' }}>
          <strong>Aviso:</strong> Los alumnos inscritos en esta lista asisten al Preuniversitario del colegio con permiso autorizado.
        </span>
      </div>

      {/* CONTENEDOR SUPERIOR: SELECTOR Y BOTÓN SIMÉTRICO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Izquierda: Selector de Preuniversitario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <label style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>Seleccione Preuniversitario:</label>
          <select 
            value={preuSeleccionado}
            onChange={(e) => setPreuSeleccionado(e.target.value)}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
          >
            {preuniversitarios.map((preu, idx) => {
              const id = preu.id_preu || preu.id || preu.id_preuniversitario || idx;
              const nombre = preu.nombre_preu || preu.nombre || preu.descripcion || 'Preuniversitario';
              const entidad = preu.entidad || preu.institucion || '';
              return (
                <option key={id} value={id}>
                  {nombre} {entidad ? `(${entidad})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Derecha: Botón simétrico para ir a registrar alumno */}
        <div style={{ minWidth: '200px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setVista('registro')} 
            className="btn-submit"
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '500',
              width: '100%',
              textAlign: 'center'
            }}
          >
            + Registrar Alumno
          </button>
        </div>
      </div>

      {/* SECCIÓN DE LISTA DE ALUMNOS */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>Lista de Alumnos Autorizados</h3>
        
        <input 
          type="text" 
          placeholder="🔍 Buscar por Alumno o Curso..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', width: '280px' }}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre Alumno</th>
            <th>Curso</th>
            <th>Correo Electrónico</th>
            <th>Estado Permiso</th>
          </tr>
        </thead>
        <tbody>
          {alumnosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                No hay alumnos autorizados inscritos en este preuniversitario.
              </td>
            </tr>
          ) : (
            alumnosFiltrados.map((alumno, index) => (
              <tr key={index}>
                <td>{alumno.nombre_completo}</td>
                <td>{alumno.curso}</td>
                <td>{alumno.correo_electronico || 'Sin correo'}</td>
                <td>
                  <span style={{ color: '#198754', fontWeight: '500', background: '#d1e7dd', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                    Autorizado
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}