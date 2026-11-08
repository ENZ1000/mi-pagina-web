import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function BuscarAlumno() {
    const [alumnos, setAlumnos] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/alumnos/todos');
                setAlumnos(response.data);
            } catch (error) {
                console.error('Error al obtener los alumnos:', error);
            }
        };
        fetchAlumnos();
    }, []);

    // Filtro dinámico: busca por coincidencia en el nombre o RUT
    const alumnosFiltrados = alumnos.filter(al => 
        al.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) || 
        al.rut.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="tab-content active">
            <h2>Directorio General de Alumnos</h2>
            
            <div className="input-group" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                <input 
                    type="text" 
                    placeholder="🔍 Buscar por nombre o RUT..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>RUT</th>
                        <th>Nombre Completo</th>
                        <th>Curso Actual</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnosFiltrados.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                No se encontraron alumnos.
                            </td>
                        </tr>
                    ) : (
                        alumnosFiltrados.map((alumno) => (
                            <tr key={alumno.rut}>
                                <td>{alumno.rut}</td>
                                <td>{alumno.nombre_completo}</td>
                                <td>{alumno.numero}° Medio {alumno.letra}</td>
                                <td>
                                    <Link 
                                        to={`/director/alumno/${alumno.rut}`} 
                                        className="btn-submit" 
                                        style={{ textDecoration: 'none', padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'inline-block' }}
                                    >
                                        Ver Detalle
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}