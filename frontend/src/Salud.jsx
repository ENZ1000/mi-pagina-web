import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Salud() {
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  
  const [diagnostico, setDiagnostico] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [diasReposo, setDiasReposo] = useState('');
  const [eximidoFisico, setEximidoFisico] = useState(false);

  const [licencias, setLicencias] = useState([]);
  
  // Estados para filtros del historial general
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');

  // Fecha actual en formato YYYY-MM-DD (local)
  const fechaHoy = new Date().toLocaleDateString('en-CA');

  const fetchLicencias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/salud/licencias');
      setLicencias(response.data);
    } catch (error) {
      console.error('Error al obtener licencias médicas:', error);
    }
  };

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/alumnos/cursos');
        setCursos(response.data);
      } catch (error) {
        console.error('Error al obtener cursos:', error);
      }
    };
    fetchCursos();
    fetchLicencias();
  }, []);

  const handleCursoChange = async (e) => {
    const cursoId = e.target.value;
    setCursoSeleccionado(cursoId);
    setAlumnoSeleccionado('');
    setAlumnos([]);

    if (!cursoId) return;

    try {
      const response = await axios.post('http://localhost:3000/api/alumnos', { id_curso: cursoId });
      setAlumnos(response.data);
    } catch (error) {
      console.error('Error al obtener alumnos del curso:', error);
      setAlumnos([]);
    }
  };

  const handleLicenciaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/salud/nueva-licencia', {
        rut_alumno: alumnoSeleccionado,
        diagnostico: diagnostico,
        dias_reposo: parseInt(diasReposo) || 1,
        fecha_inicio: fechaInicio || fechaHoy,
        eximido_fisico: eximidoFisico
      });

      if (response.status === 201 || response.status === 200) {
        alert('Licencia médica registrada con éxito');
        setDiagnostico('');
        setFechaInicio('');
        setDiasReposo('');
        setEximidoFisico(false);
        setAlumnoSeleccionado('');
        setCursoSeleccionado('');
        setAlumnos([]);
        await fetchLicencias();
      }
    } catch (error) {
      console.error('Error al registrar licencia:', error);
      alert('Error al registrar la licencia médica.');
    }
  };

  const calcularFechaFinalStr = (fechaInicioStr, dias) => {
    if (!fechaInicioStr) return '';
    const partes = fechaInicioStr.split('-');
    if (partes.length < 3) return fechaInicioStr;
    const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
    fecha.setDate(fecha.getDate() + (parseInt(dias) || 1) - 1);
    return fecha.toISOString().split('T')[0];
  };

  const esLicenciaActiva = (item) => {
    const inicio = item.fecha_inicio;
    const fin = calcularFechaFinalStr(item.fecha_inicio, item.dias_reposo);
    return fechaHoy >= inicio && fechaHoy <= fin;
  };

  const separarNombreApellido = (nombreCompleto) => {
    if (!nombreCompleto) return { apellido: '', nombre: '' };
    const partes = nombreCompleto.trim().split(' ');
    if (partes.length === 1) return { apellido: partes[0], nombre: '' };
    const nombre = partes[0];
    const apellido = partes.slice(1).join(' ');
    return { apellido, nombre };
  };

  // Licencias Activas (para la tabla superior)
  const licenciasActivas = licencias.filter(item => esLicenciaActiva(item));

  // Licencias para el Historial General (con filtros aplicados)
  const licenciasFiltradas = licencias.filter(item => {
    const { apellido, nombre } = separarNombreApellido(item.nombre_alumno);
    const textoMatch = 
      apellido.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      (item.diagnostico && item.diagnostico.toLowerCase().includes(filtroTexto.toLowerCase()));
    
    const fechaMatch = filtroFecha ? item.fecha_inicio === filtroFecha : true;
    const cursoStr = `${item.numero}° Medio ${item.letra}`;
    const cursoMatch = filtroCurso ? cursoStr.toLowerCase().includes(filtroCurso.toLowerCase()) : true;

    return textoMatch && fechaMatch && cursoMatch;
  });

  return (
    <div>
      <h2>Departamento de Salud - Licencias Médicas</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Gestión y registro de licencias médicas de estudiantes, historiales y controles de vigencia.
      </p>

      {/* FORMULARIO DE REGISTRO DE LICENCIA */}
      <section className="card-section" style={{ marginBottom: '2.5rem' }}>
        <h3>Registrar Nueva Licencia Médica</h3>
        <form onSubmit={handleLicenciaSubmit} style={{ marginTop: '1rem' }}>
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
                {alumnos.map((alumno) => (
                  <option key={alumno.rut} value={alumno.rut}>
                    {alumno.nombre_completo}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Motivo / Diagnóstico</label>
              <input 
                type="text" 
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="ej. Bronquitis obstructiva" 
                required 
              />
            </div>

            <div className="input-group">
              <label>Fecha de Inicio</label>
              <input 
                type="date" 
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <label>Días de Reposo</label>
              <input 
                type="number" 
                min="1"
                value={diasReposo}
                onChange={(e) => setDiasReposo(e.target.value)}
                placeholder="ej. 5" 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-submit btn-form" style={{ marginTop: '1rem' }}>
            Guardar Licencia
          </button>
        </form>
      </section>

      <hr className="divider" />

      {/* 1. SECCIÓN SUPERIOR: LICENCIAS MÉDICAS VIGENTES / ACTIVAS */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Licencias Médicas Activas (Vigentes)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Motivo</th>
              <th>Fecha inicio</th>
              <th>Fecha final</th>
              <th>Archivo</th>
            </tr>
          </thead>
          <tbody>
            {licenciasActivas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                  No hay licencias médicas activas en este momento.
                </td>
              </tr>
            ) : (
              licenciasActivas.map((item, index) => {
                const { apellido, nombre } = separarNombreApellido(item.nombre_alumno);
                const fechaFin = calcularFechaFinalStr(item.fecha_inicio, item.dias_reposo);
                const cursoNombre = `${item.numero}° Medio ${item.letra}`;
                return (
                  <tr key={index}>
                    <td>{apellido}</td>
                    <td>{nombre}</td>
                    <td>{cursoNombre}</td>
                    <td>{item.diagnostico || '-'}</td>
                    <td>{item.fecha_inicio}</td>
                    <td>{fechaFin}</td>
                    <td>{item.ruta_archivo ? <a href={item.ruta_archivo} target="_blank" rel="noreferrer">Ver Archivo</a> : 'Sin archivo'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <hr className="divider" />

      {/* 2. SECCIÓN INFERIOR: HISTORIAL GENERAL CON FILTROS Y RESALTADO AMARILLO */}
      <section>
        <div className="table-header-actions" style={{ marginBottom: '1rem' }}>
          <h3>Historial General de Licencias Médicas</h3>
        </div>

        {/* CONTENEDOR DE FILTROS */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', background: 'var(--bg-page)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div className="input-group" style={{ flex: 1, minWidth: '200px', margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Filtrar por Nombre / Apellido / Motivo</label>
            <input 
              type="text" 
              placeholder="🔍 Buscar..." 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>

          <div className="input-group" style={{ width: '160px', margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Filtrar por Fecha</label>
            <input 
              type="date" 
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>

          <div className="input-group" style={{ width: '160px', margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Filtrar por Curso</label>
            <input 
              type="text" 
              placeholder="ej. 1° Medio A" 
              value={filtroCurso}
              onChange={(e) => setFiltroCurso(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Motivo</th>
              <th>Fecha inicio</th>
              <th>Fecha final</th>
              <th>Archivo</th>
            </tr>
          </thead>
          <tbody>
            {licenciasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                  No se encontraron registros en el historial.
                </td>
              </tr>
            ) : (
              licenciasFiltradas.map((item, index) => {
                const { apellido, nombre } = separarNombreApellido(item.nombre_alumno);
                const fechaFin = calcularFechaFinalStr(item.fecha_inicio, item.dias_reposo);
                const cursoNombre = `${item.numero}° Medio ${item.letra}`;
                const activa = esLicenciaActiva(item);

                return (
                  <tr 
                    key={index} 
                    style={{ 
                      backgroundColor: activa ? '#fff9db' : 'transparent' // Amarillo suave si está activa
                    }}
                  >
                    <td>{apellido}</td>
                    <td>{nombre}</td>
                    <td>{cursoNombre}</td>
                    <td>{item.diagnostico || '-'}</td>
                    <td>{item.fecha_inicio}</td>
                    <td>{fechaFin}</td>
                    <td>{item.ruta_archivo ? <a href={item.ruta_archivo} target="_blank" rel="noreferrer">Ver Archivo</a> : 'Sin archivo'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}