import React, { useState, useEffect } from 'react';

export default function Salud() {
  const [filtroEstado, setFiltroEstado] = useState('activa');
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [licencias, setLicencias] = useState([]);

  // Estados del formulario para nueva licencia médica
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [rutAlumnoSeleccionado, setRutAlumnoSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaTermino, setFechaTermino] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [eximidoFisico, setEximidoFisico] = useState(false);
  const [archivoLicencia, setArchivoLicencia] = useState(null); // Nuevo estado para el archivo

  // Autogenerar la fecha actual
  const [fechaIngreso, setFechaIngreso] = useState(() => {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    return hoy.toISOString().split('T')[0];
  });

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        // 1. Obtener los cursos
        const resCursos = await fetch('http://localhost:3000/api/alumnos/cursos'); 
        const dataCursos = await resCursos.json();
        setCursos(dataCursos);

        // 2. Obtener el historial de licencias médicas
        const resLicencias = await fetch('http://localhost:3000/api/salud/licencias');
        const dataLicencias = await resLicencias.json();
        setLicencias(dataLicencias);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    cargarDatosIniciales();
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
        setAlumnos(data);
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      }
    }
  };

  const handleLicenciaSubmit = async (e) => {
    e.preventDefault();
    
    // Cálculo matemático de los días de reposo requeridos en el registro
    const inicio = new Date(fechaInicio);
    const termino = new Date(fechaTermino);
    const diasReposo = Math.ceil((termino - inicio) / (1000 * 60 * 60 * 24)) + 1; 
  
    // Configuración del FormData para envío de archivos y texto
    const formData = new FormData();
    formData.append('rut_alumno', rutAlumnoSeleccionado);
    formData.append('diagnostico', diagnostico);
    formData.append('dias_reposo', diasReposo);
    formData.append('fecha_inicio', fechaInicio);
    formData.append('eximido_fisico', eximidoFisico);
    if (archivoLicencia) {
      formData.append('archivo_licencia', archivoLicencia);
    }
  
    try {
      const res = await fetch('http://localhost:3000/api/salud/nueva-licencia', {
        method: 'POST',
        body: formData // El navegador establece automáticamente el Content-Type adecuado para FormData
      });
      
      if (res.ok) {
        alert('Licencia guardada con éxito');
        
        // Refrescar la tabla automáticamente llamando de nuevo al backend
        const resLicencias = await fetch('http://localhost:3000/api/salud/licencias');
        const dataLicencias = await resLicencias.json();
        setLicencias(dataLicencias);
        
        //Limpia el formulario reseteando los estados aquí
        setRutAlumnoSeleccionado('');
        setDiagnostico('');
        setArchivoLicencia(null);
      } else {
        alert('Error al guardar la licencia');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  // Función para abrir la descarga del documento en una nueva pestaña
  const handleDescargar = (id_licencia) => {
    window.open(`http://localhost:3000/api/salud/licencias/${id_licencia}/descargar`, '_blank');
  };

  return (
    <div>
      <h2>Departamento de Salud - Licencias Médicas</h2>
      <p>Gestión y registro de licencias médicas de estudiantes, control de estados y vigencia.</p>

      <section className="card-section">
        <h3>Registrar Nueva Licencia Médica</h3>
        <form onSubmit={handleLicenciaSubmit}>
          <div className="form-grid">
            
            <div className="input-group">
              <label htmlFor="salud-curso">Curso</label>
              <select id="salud-curso" value={cursoSeleccionado} onChange={handleCursoChange} required>
                <option value="">Seleccione un curso...</option>
                {cursos.map(curso => (
                  <option key={curso.id_curso} value={curso.id_curso}>
                    {curso.numero}° {curso.letra}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="salud-alumno">Nombre del Alumno</label>
              <select id="salud-alumno" value={rutAlumnoSeleccionado} onChange={(e) => setRutAlumnoSeleccionado(e.target.value)} required disabled={!cursoSeleccionado || alumnos.length === 0}>
                <option value="">Seleccione un curso primero...</option>
                {alumnos.map(alumno => (
                  <option key={alumno.rut} value={alumno.rut}>
                    {alumno.nombre_completo}
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
              <input type="date" id="salud-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
            </div>

            <div className="input-group">
              <label htmlFor="salud-termino">Licencia Hasta</label>
              <input type="date" id="salud-termino" value={fechaTermino} onChange={(e) => setFechaTermino(e.target.value)} required />
            </div>

            <div className="input-group">
              <label htmlFor="salud-diagnostico">Diagnóstico</label>
              <input type="text" id="salud-diagnostico" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} placeholder="Ej. Cuadro viral respiratorio" required />
            </div>

            {/* Nuevo input de archivo */}
            <div className="input-group">
              <label htmlFor="salud-archivo">Documento (PDF/IMG)</label>
              <input type="file" id="salud-archivo" accept=".pdf, image/*" onChange={(e) => setArchivoLicencia(e.target.files[0])} required />
            </div>

            <div className="input-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <input type="checkbox" id="salud-eximido" checked={eximidoFisico} onChange={(e) => setEximidoFisico(e.target.checked)} />
              <label htmlFor="salud-eximido" style={{ margin: 0 }}>Eximido Educación Física</label>
            </div>

          </div>

          <button type="submit" className="btn-submit btn-form">Guardar Licencia</button>
        </form>
      </section>

      <hr className="divider" />

      <section>
        <div className="table-header-actions">
          <h3>Fichas de Estudiantes con Licencia</h3>
          
          <div className="filter-box">
            <label htmlFor="filtro-estado" style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem' }}>Filtrar:</label>
            <select id="filtro-estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
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
              <th>Diagnóstico</th>
              <th>Estado</th>
              <th>Documento</th>
            </tr>
          </thead>
          <tbody>
            {licencias
              .map(licencia => {
                // Calcular fecha de término
                const inicio = new Date(licencia.fecha_inicio);
                
                // Asegurar formato de fecha local para evitar desfases
                inicio.setMinutes(inicio.getMinutes() - inicio.getTimezoneOffset());
                
                const fin = new Date(inicio);
                // Restar 1 porque el día de inicio cuenta como el primer día de reposo
                fin.setDate(inicio.getDate() + licencia.dias_reposo - 1);
                
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0); // Normalizar hora para comparar solo fechas

                // Determinar el estado en base a la fecha de término
                const estadoLicencia = fin >= hoy ? 'activa' : 'pasada';

                // Retornar objeto combinado con el estado calculado
                return {
                  ...licencia,
                  estadoCalculado: estadoLicencia,
                  fechaFin: fin.toISOString().split('T')[0],
                  fechaInicioFormat: inicio.toISOString().split('T')[0]
                };
              })
              // Aplicar el filtro seleccionado por el usuario en el select
              .filter(licencia => filtroEstado === 'todas' || licencia.estadoCalculado === filtroEstado)
              .map((licencia, index) => (
                <tr key={licencia.id_licencia || index}>
                  <td>{licencia.numero}° {licencia.letra}</td>
                  <td>{licencia.nombre_alumno}</td>
                  <td>{licencia.fecha_inicio ? licencia.fecha_inicio.split('T')[0] : 'N/A'}</td>
                  <td>{licencia.fechaInicioFormat}</td>
                  <td>{licencia.fechaFin}</td>
                  <td>{licencia.diagnostico}</td>
                  <td>
                    <span 
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        backgroundColor: licencia.estadoCalculado === 'activa' ? '#d4edda' : '#f8d7da',
                        color: licencia.estadoCalculado === 'activa' ? '#155724' : '#721c24'
                      }}
                    >
                      {licencia.estadoCalculado === 'activa' ? 'Vigente' : 'Caducada'}
                    </span>
                  </td>
                  <td>
                    {licencia.ruta_archivo ? (
                      <button 
                        onClick={() => handleDescargar(licencia.id_licencia)}
                        style={{ 
                          padding: '6px 10px', 
                          cursor: 'pointer', 
                          backgroundColor: '#003366', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          fontSize: '0.85rem'
                        }}
                        title="Descargar licencia médica"
                      >
                        📥 Descargar
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>No adjunto</span>
                    )}
                  </td>
                </tr>
              ))
            }
            
            {/* Mensaje si la tabla está vacía tras aplicar filtros */}
            {licencias.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>
                  No hay licencias médicas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}