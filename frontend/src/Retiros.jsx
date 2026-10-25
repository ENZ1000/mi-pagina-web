import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Retiros() {
    const [cursos, setCursos] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
    const [motivo, setMotivo] = useState('');
    const [tipo, setTipo] = useState('retiro'); // O el valor por defecto que requiera tu BD
    const [historialRetiros, setHistorialRetiros] = useState([]);

    // Fecha actual estandarizada
    const fechaHoy = new Date().toLocaleDateString('en-CA');
    // Hora actual en formato HH:MM:SS para cumplir con el backend
    const horaActual = new Date().toTimeString().split(' ')[0];

    const fetchHistorialHoy = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/retiros');
            setHistorialRetiros(response.data);
        } catch (error) {
            console.error('Error al obtener el historial de retiros:', error);
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
        fetchHistorialHoy();
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

    const handleRetiroSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/retiros/nuevo-retiro', { 
                id_curso: cursoSeleccionado,
                rut_alumno: alumnoSeleccionado,
                tipo: tipo,
                fecha: fechaHoy,
                hora: horaActual,
                motivo: motivo 
            });

            if (response.status === 201 || response.status === 200) {
                alert('Retiro registrado con éxito');
                
                setMotivo('');
                setAlumnoSeleccionado('');
                setCursoSeleccionado('');
                setAlumnos([]);
                
            }
        } catch (error) {
            console.error('Error al registrar el retiro:', error);
            alert('Error al registrar el retiro.');
        }

        try {
            await fetchHistorialHoy();
        } catch (error) {
            console.error('El retiro se guardó, pero hubo un error al recargar la tabla:', error);
        }
    };

    return (
        <div className="tab-content active">
            <h3>Registrar Retiro de Alumno</h3>
            <form onSubmit={handleRetiroSubmit} style={{ marginTop: '1rem' }}>
                <div className="form-grid">
                    
                    {/* Selector de Curso */}
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
                    
                    {/* Selector de Alumno */}
                    <div className="input-group">
                        <label>Nombre del Alumno</label>
                        <select 
                            value={alumnoSeleccionado}
                            onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                            required 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                        >
                            <option value="">
                                {cursoSeleccionado ? 'Seleccione un alumno...' : 'Seleccione un curso primero...'}
                            </option>
                            {alumnos.map((alumno) => (
                                <option key={alumno.rut} value={alumno.rut}>
                                    {alumno.nombre_completo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha */}
                    <div className="input-group">
                        <label>Fecha (Hoy)</label>
                        <input type="date" value={fechaHoy} required readOnly />
                    </div>

                    {/* Motivo del Retiro */}
                    <div className="input-group">
                        <label>Motivo del Retiro</label>
                        <input 
                            type="text" 
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="ej. Cita médica" 
                            required 
                        />
                    </div>
                </div>

                <button type="submit" className="btn-submit btn-form" style={{ marginTop: '1rem' }}>
                    Registrar Retiro
                </button>
            </form>

            <hr className="divider" />

            <h3>Historial de Retiros</h3>
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
                    {!historialRetiros || historialRetiros.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                No hay registros de retiros.
                            </td>
                        </tr>
                    ) : (
                        historialRetiros.map((item, index) => (
                            <tr key={index}>
                                <td>{item.fecha}</td>
                                <td>{item.numero}° Medio {item.letra}</td>
                                <td>{item.nombre_completo}</td>
                                <td>{item.motivo}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};