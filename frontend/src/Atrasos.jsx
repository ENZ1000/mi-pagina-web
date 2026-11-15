import React, { useState, useEffect } from "react";
import axios from "axios";

// Añadimos modoDirector como parámetro (por defecto false)
export default function Atrasos({ modoDirector = false }) {
    // Si estamos en modo director, la vista activa inicial siempre es 'historial'
    const [vistaActiva, setVistaActiva] = useState(modoDirector ? 'historial' : 'ingresar'); 

    const [cursos, setCursos] = useState([]);
    const fechaHoy = new Date().toLocaleDateString('en-CA');
    
    // ESTADOS: INGRESAR
    const [formCurso, setFormCurso] = useState('');
    const [formAlumnos, setFormAlumnos] = useState([]);
    const [formAlumnoSeleccionado, setFormAlumnoSeleccionado] = useState('');
    const [formFecha, setFormFecha] = useState('');
    const [formHora, setFormHora] = useState('');
    const [atrasosHoy, setAtrasosHoy] = useState([]);

    // ESTADOS: HISTORIAL
    const [semestresDisponibles, setSemestresDisponibles] = useState([]);
    const [historialAtrasos, setHistorialAtrasos] = useState([]);
    const [filtroAlumnos, setFiltroAlumnos] = useState([]);
    
    const [filtros, setFiltros] = useState({
        semestreObj: '', 
        curso: '',
        rut_alumno: '',
        fecha: '',
        gravedad: '' 
    });

    useEffect(() => {
        const fetchInicial = async () => {
            try {
                const resCursos = await axios.get('http://localhost:3000/api/alumnos/cursos');
                setCursos(resCursos.data);

                const resSemestres = await axios.get('http://localhost:3000/api/atrasos/semestres');
                setSemestresDisponibles(resSemestres.data);
            } catch (error) {
                console.error('Error cargando datos iniciales:', error);
            }
        };
        fetchInicial();
        
        // Solo cargamos la tabla de hoy si NO estamos en modo director
        if (!modoDirector) {
            fetchAtrasosHoy(); 
        }
        
        fetchHistorial(); 
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAlumnosPorCurso = async (idCurso) => {
        if (!idCurso) return [];
        try {
            const response = await axios.post('http://localhost:3000/api/alumnos', { id_curso: idCurso });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo alumnos:', error);
            return [];
        }
    };

    const fetchAtrasosHoy = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/atrasos', {
                params: { fecha: fechaHoy }
            });
            setAtrasosHoy(response.data);
        } catch (error) {
            console.error('Error al obtener atrasos de hoy:', error);
        }
    };

    const fetchHistorial = async () => {
        try {
            let anio = '', semestre = '';
            if (filtros.semestreObj) {
                [anio, semestre] = filtros.semestreObj.split('-');
            }

            const params = {
                fecha: filtros.fecha || null,
                curso: filtros.curso || null,
                rut_alumno: filtros.rut_alumno || null,
                anio: anio || null,
                semestre: semestre || null,
                gravedad: filtros.gravedad || null
            };

            const response = await axios.get('http://localhost:3000/api/atrasos', { params });
            setHistorialAtrasos(response.data);
        } catch (error) {
            console.error('Error al obtener historial filtrado:', error);
        }
    };

    useEffect(() => {
        fetchHistorial();
    }, [filtros]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFormCursoChange = async (e) => {
        const id = e.target.value;
        setFormCurso(id);
        setFormAlumnoSeleccionado('');
        setFormAlumnos(await fetchAlumnosPorCurso(id));
    };

    const handleFiltroCursoChange = async (e) => {
        const id = e.target.value;
        setFiltros({ ...filtros, curso: id, rut_alumno: '' });
        setFiltroAlumnos(await fetchAlumnosPorCurso(id));
    };

    const limpiarFiltros = () => {
        setFiltros({ semestreObj: '', curso: '', rut_alumno: '', fecha: '', gravedad: '' });
        setFiltroAlumnos([]);
    };

    const handleAtrasoSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/atrasos/nuevo-atraso', { 
                fecha: formFecha,
                rut_alumno: formAlumnoSeleccionado,
                hora_llegada: formHora 
            });

            if (response.status === 201 || response.status === 200) {
                alert('Atraso registrado exitosamente');
                
                setFormHora('');
                setFormAlumnoSeleccionado('');
                setFormCurso('');
                setFormFecha('');
                setFormAlumnos([]);

                const resSemestres = await axios.get('http://localhost:3000/api/atrasos/semestres');
                setSemestresDisponibles(resSemestres.data);
                
                await fetchAtrasosHoy();
                await fetchHistorial();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert('Error al registrar el atraso. Revisa los datos.');
            }
        }
    };

    const getClaseColor = (nombreAtraso) => {
        if (nombreAtraso === 'Grave') return 'atraso-grave';
        if (nombreAtraso === 'Mayor') return 'atraso-leve'; 
        return '';
    };

    return (
        <div>
            {/* Ocultamos las pestañas si estamos en modoDirector */}
            {!modoDirector && (
                <div className="tabs-container" style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border)', marginBottom: '2rem' }}>
                    <button 
                        className={`tab-btn ${vistaActiva === 'ingresar' ? 'active' : ''}`} 
                        onClick={() => setVistaActiva('ingresar')}
                        style={{ padding: '0.75rem', background: 'none', border: 'none', borderBottom: vistaActiva === 'ingresar' ? '3px solid var(--primary)' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Ingresar Registro
                    </button>
                    <button 
                        className={`tab-btn ${vistaActiva === 'historial' ? 'active' : ''}`} 
                        onClick={() => setVistaActiva('historial')}
                        style={{ padding: '0.75rem', background: 'none', border: 'none', borderBottom: vistaActiva === 'historial' ? '3px solid var(--primary)' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Ver Historial Filtrado
                    </button>
                </div>
            )}

            {vistaActiva === 'ingresar' && !modoDirector && (
                <div className="tab-content active">
                    <h3>Ingresar Registro de Atraso</h3>
                    <form onSubmit={handleAtrasoSubmit} style={{ marginTop: '1rem' }}>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Curso</label>
                                <select value={formCurso} onChange={handleFormCursoChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                    <option value="">Seleccione un curso...</option>
                                    {cursos?.map((curso) => (
                                        <option key={curso.id_curso} value={curso.id_curso}>{curso.numero}° Medio {curso.letra}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Nombre del Alumno</label>
                                <select value={formAlumnoSeleccionado} onChange={(e) => setFormAlumnoSeleccionado(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                    <option value="">Seleccione un curso primero...</option>
                                    {formAlumnos?.map((alumno) => (
                                        <option key={alumno.rut} value={alumno.rut}>{alumno.nombre_completo}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Fecha del Atraso</label>
                                <input type="date" value={formFecha} onChange={(e) => setFormFecha(e.target.value)} required />
                            </div>

                            <div className="input-group">
                                <label>Hora de Llegada</label>
                                <input type="time" value={formHora} onChange={(e) => setFormHora(e.target.value)} required />
                            </div>
                        </div>
                        <button type="submit" className="btn-submit btn-form">Registrar Atraso</button>
                    </form>

                    <hr className="divider" />

                    <h3>Historial de Atrasos de Hoy ({new Date().toLocaleDateString('es-CL')})</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora Llegada</th>
                                <th>Gravedad</th>
                                <th>Curso</th>
                                <th>Alumno</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!atrasosHoy || atrasosHoy.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No hay registros de atrasos para hoy.
                                    </td>
                                </tr>
                            ) : (
                                atrasosHoy.map((item, index) => (
                                    <tr key={index} className={getClaseColor(item.nombre_atraso)}>
                                        <td>{item.fecha.split('T')[0]}</td>
                                        <td>{item.hora_llegada}</td>
                                        <td>{item.nombre_atraso}</td>
                                        <td>{item.numero}° Medio {item.letra}</td>
                                        <td>{item.nombre_completo}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {vistaActiva === 'historial' && (
                <div className="tab-content active">
                    {/* Si estamos en modo director, podemos agregar un título específico */}
                    {modoDirector && <h2>Historial General de Atrasos - Dirección</h2>}
                    {!modoDirector && <h3>Filtros de Búsqueda Avanzada</h3>}
                    
                    <div className="form-grid" style={{ marginBottom: '1.5rem', background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div className="input-group">
                            <label>Filtrar por Semestre</label>
                            <select value={filtros.semestreObj} onChange={(e) => setFiltros({...filtros, semestreObj: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <option value="">Todos los semestres...</option>
                                {semestresDisponibles?.map((s, idx) => (
                                    <option key={idx} value={`${s.anio}-${s.semestre}`}>
                                        {s.semestre}° Semestre año {s.anio}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Filtrar por Curso</label>
                            <select value={filtros.curso} onChange={handleFiltroCursoChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <option value="">Todos los cursos...</option>
                                {cursos?.map((curso) => (
                                    <option key={curso.id_curso} value={curso.id_curso}>{curso.numero}° Medio {curso.letra}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Filtrar por Alumno</label>
                            <select value={filtros.rut_alumno} onChange={(e) => setFiltros({...filtros, rut_alumno: e.target.value})} disabled={!filtros.curso} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <option value="">Todos los alumnos...</option>
                                {filtroAlumnos?.map((alumno) => (
                                    <option key={alumno.rut} value={alumno.rut}>{alumno.nombre_completo}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Filtrar por Fecha Exacta</label>
                            <input type="date" value={filtros.fecha} onChange={(e) => setFiltros({...filtros, fecha: e.target.value})} />
                        </div>
                        
                        <div className="input-group">
                            <label>Filtrar por Gravedad</label>
                            <select value={filtros.gravedad} onChange={(e) => setFiltros({...filtros, gravedad: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <option value="">Todas las gravedades...</option>
                                <option value="1">Leve (&lt; 08:15)</option>
                                <option value="2">Mayor (08:15 - 09:00)</option>
                                <option value="3">Grave (&gt; 09:00)</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={limpiarFiltros} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                        Limpiar Filtros
                    </button>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora Llegada</th>
                                <th>Gravedad</th>
                                <th>Curso</th>
                                <th>Alumno</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!historialAtrasos || historialAtrasos.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No se encontraron atrasos para estos filtros.
                                    </td>
                                </tr>
                            ) : (
                                historialAtrasos.map((item, index) => (
                                    <tr key={index} className={getClaseColor(item.nombre_atraso)}>
                                        <td>{item.fecha.split('T')[0]}</td>
                                        <td>{item.hora_llegada}</td>
                                        <td>{item.nombre_atraso}</td>
                                        <td>{item.numero}° Medio {item.letra}</td>
                                        <td>{item.nombre_completo}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}