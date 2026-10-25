import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Atrasos() {
    const [cursos, setCursos] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
    const [horaLlegada, setHoraLlegada] = useState('');
    const [historialAtrasos, setHistorialAtrasos] = useState([]);

    const fechaHoy = new Date().toLocaleDateString('en-CA');

    // 1. Cargar todos los cursos al montar el componente
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                // Reemplaza esta URL con la ruta real de tu backend para obtener cursos
                const response = await axios.get('http://localhost:3000/api/alumnos/cursos');
                setCursos(response.data);
            } catch (error) {
                console.error('Error al obtener cursos:', error);
            }
        };
        const fetchHistorialHoy = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/atrasos', {
                    params: { fecha: fechaHoy }
                });
                setHistorialAtrasos(response.data);
            } catch (error) {
                console.error('Error al obtener el historial:', error);
            }
        };
        fetchCursos();
        fetchHistorialHoy();
    }, []);


    // 2. Buscar alumnos cada vez que cambia la selección del curso
    const handleCursoChange = async (e) => {
        const cursoId = e.target.value;
        setCursoSeleccionado(cursoId);
        setAlumnoSeleccionado('');
        setAlumnos([]);

        if (!cursoId) return;

        try {
            const response = await axios.post('http://localhost:3000/api/alumnos', { id_curso: cursoId });
            
            const dataAlumnos = response.data;
            setAlumnos(dataAlumnos);
        } catch (error) {
            console.error('Error al obtener alumnos del curso:', error);
            setAlumnos([]);
        }
    };

    const handleAtrasoSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await axios.post('http://localhost:3000/api/atrasos/nuevo-atraso', { 
                    fecha: fechaHoy,
                    rut_alumno: alumnoSeleccionado,
                    hora_llegada: horaLlegada 
                });

                if (response.status === 201 || response.status === 200) {
                    alert('Atraso registrado exitosamente');
                    
                    setHoraLlegada('');
                    setAlumnoSeleccionado('');

                    await fetchHistorialHoy();
                }
            } catch (error) {
                console.error('Error al registrar:', error);
                alert('Error al registrar el atraso. Revisa los datos.');
            }
        };

    return (
        <div className="tab-content active">
            <h3>Ingresar Registro de Atraso (Llegada &gt; 8:10 AM)</h3>
            <form onSubmit={handleAtrasoSubmit} style={{ marginTop: '1rem' }}>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="atraso-curso">Curso</label>
                        <select 
                            id="atraso-curso" 
                            value={cursoSeleccionado}
                            onChange={handleCursoChange}
                            required 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                        >
                            <option value="">Seleccione un curso...</option>
                            {cursos?.map((curso) => (
                                <option key={curso.id_curso} value={curso.id_curso}>
                                    {curso.numero}° Medio {curso.letra}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="atraso-alumno">Nombre del Alumno</label>
                        <select 
                            id="atraso-alumno" 
                            value={alumnoSeleccionado}
                            onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                            required 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                        >
                            <option value="">Seleccione un curso primero...</option>
                            {alumnos?.map((alumno) => (
                                <option key={alumno} value={alumno.rut}>
                                    {alumno.nombre_completo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="atraso-fecha">Fecha (Hoy)</label>
                        <input 
                            type="date" 
                            id="atraso-fecha" 
                            defaultValue={new Date().toLocaleDateString('en-CA')} 
                            required 
                            readOnly 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="atraso-hora">Hora de Llegada</label>
                        <input 
                            type="time" 
                            id="atraso-hora" 
                            value={horaLlegada}
                            onChange={(e) => setHoraLlegada(e.target.value)}
                            required 
                        />
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
                    {!historialAtrasos || historialAtrasos.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                No hay registros de atrasos para hoy.
                            </td>
                        </tr>
                    ) : (
                        historialAtrasos.map((item, index) => (
                            <tr key={index} className={item.tipo}>
                                <td>{item.fecha}</td>
                                <td>{item.hora_llegada}</td>
                                <td>{item.numero}° Medio {item.letra}</td>
                                <td>{item.nombre_completo}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}