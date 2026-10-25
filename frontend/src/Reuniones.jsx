import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Reuniones() {
    // Estados para los selectores y listas
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    
    const [reuniones, setReuniones] = useState([]);
    const [reunionSeleccionada, setReunionSeleccionada] = useState('');
    
    const [preguntas, setPreguntas] = useState([]);

    // 1. Cargar la lista de cursos al montar el componente
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/alumnos/cursos');
                setCursos(response.data);
            } catch (error) {
                console.error('Error al cargar cursos:', error);
            }
        };
        fetchCursos();
    }, []);

    // 2. Cargar las reuniones cuando cambia el curso seleccionado
    useEffect(() => {
        if (!cursoSeleccionado) {
            setReuniones([]);
            setReunionSeleccionada('');
            setPreguntas([]);
            return;
        }

        const fetchReuniones = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/reuniones/curso/${cursoSeleccionado}`);
                setReuniones(response.data);
                setReunionSeleccionada(''); // Resetear reunión seleccionada
                setPreguntas([]);
            } catch (error) {
                console.error('Error al cargar reuniones:', error);
            }
        };
        fetchReuniones();
    }, [cursoSeleccionado]);

    // 3. Cargar las preguntas cuando cambia la reunión seleccionada
    useEffect(() => {
        if (!reunionSeleccionada) {
            setPreguntas([]);
            return;
        }

        const fetchPreguntas = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/reuniones/${reunionSeleccionada}/preguntas`);
                setPreguntas(response.data);
            } catch (error) {
                console.error('Error al cargar preguntas:', error);
            }
        };
        fetchPreguntas();
    }, [reunionSeleccionada]);

    const handleReunionSubmit = async (e) => {
        e.preventDefault();
        // Lógica para guardar la nueva reunión (mantén tu estructura actual)
        try {
            const response = await axios.post('http://localhost:3000/api/reuniones/nueva-reunion', {
                // tus datos aquí...
            });
            alert('Reunión guardada con éxito');
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    return (
        <div className="tab-content active">
            <h3>Gestión y Registro de Reuniones</h3>

            {/* SECCIÓN DE FILTRRO / VISUALIZACIÓN */}
            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h4>Consultar Reuniones Anteriores</h4>
                
                {/* Selector de Curso */}
                <div className="input-group" style={{ marginTop: '1rem' }}>
                    <label>Seleccionar Curso</label>
                    <select 
                        value={cursoSeleccionado} 
                        onChange={(e) => setCursoSeleccionado(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    >
                        <option value="">-- Seleccione un curso --</option>
                        {cursos.map((curso) => (
                            <option key={curso.id_curso} value={curso.id_curso}>
                                {curso.numero}° {curso.letra}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Reunión (Se habilita si hay un curso seleccionado) */}
                {cursoSeleccionado && (
                    <div className="input-group" style={{ marginTop: '1rem' }}>
                        <label>Seleccionar Reunión</label>
                        <select 
                            value={reunionSeleccionada} 
                            onChange={(e) => setReunionSeleccionada(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        >
                            <option value="">-- Seleccione una fecha de reunión --</option>
                            {reuniones.map((reunion) => (
                                <option key={reunion.id_reunion} value={reunion.id_reunion}>
                                    Fecha: {reunion.fecha}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Visualización de Preguntas de la Reunión Seleccionada */}
                {reunionSeleccionada && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <h5>Preguntas y Respuestas Registradas:</h5>
                        {preguntas.length === 0 ? (
                            <p style={{ color: 'gray', fontStyle: 'italic' }}>No hay preguntas registradas para esta reunión.</p>
                        ) : (
                            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.5rem' }}>
                                {preguntas.map((p) => (
                                    <li key={p.id_pregunta} style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                        <p><strong>P:</strong> {p.pregunta}</p>
                                        <p style={{ margin: '0.25rem 0 0 0' }}><strong>R:</strong> {p.respuesta || 'Sin respuesta'}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <hr style={{ margin: '2rem 0' }} />

            {/* FORMULARIO DE REGISTRO */}
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
                    <button type="button" className="btn-secondary" style={{ marginTop: '0.5rem' }}>+ Agregar Pregunta</button>
                </div>

                <button type="submit" className="btn-submit btn-form" style={{ marginTop: '1rem' }}>Guardar Acta de Reunión</button>
            </form>
        </div>
    );
}