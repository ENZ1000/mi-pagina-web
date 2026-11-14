import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // O tu sistema de navegación

export default function PreuniversitarioRegistro() {
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [preuniversitarios, setPreuniversitarios] = useState([]);

  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  const [preuSeleccionado, setPreuSeleccionado] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCursos = await axios.get('http://localhost:3000/api/alumnos/cursos');
        setCursos(resCursos.data);

        const resPreus = await axios.get('http://localhost:3000/api/preuniversitarios');
        setPreuniversitarios(resPreus.data);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    fetchData();
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/preuniversitarios/inscribir', {
        rut_alumno: alumnoSeleccionado,
        id_preu: preuSeleccionado
      });
      alert('Alumno inscrito correctamente en el preuniversitario');
      navigate(-1); // Regresar a la vista anterior
    } catch (error) {
      console.error('Error al inscribir alumno:', error);
      alert('Error al registrar la inscripción.');
    }
  };

  return (
    <div>
      <h2>Inscribir Alumno a Preuniversitario</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Seleccione el curso, el alumno y el preuniversitario correspondiente.
      </p>

      <section className="card-section">
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
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
              <label>Preuniversitario</label>
              <select 
                value={preuSeleccionado}
                onChange={(e) => setPreuSeleccionado(e.target.value)}
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <option value="">Seleccione un preuniversitario...</option>
                {preuniversitarios.map((preu) => (
                  <option key={preu.id_preu} value={preu.id_preu}>
                    {preu.nombre_preu} ({preu.entidad})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-submit btn-form">
              Inscribir Alumno
            </button>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>
              Volver
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}