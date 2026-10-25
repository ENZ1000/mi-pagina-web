import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Preuniversitario() {
    const [preuniversitarios, setPreuniversitarios] = useState([]);
    const [selectedPreuId, setSelectedPreuId] = useState('');
    const [alumnos, setAlumnos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Cargar la lista de preuniversitarios desde la API al montar el componente
    useEffect(() => {
        axios.get('http://localhost:3000/api/preuniversitarios')
            .then(response => {
                // Axios guarda la respuesta en `response.data`
                const res = response.data;
                if (res.success && res.data.length > 0) {
                    setPreuniversitarios(res.data);
                    // Seleccionar el primer preuniversitario por defecto
                    setSelectedPreuId(res.data[0].id_preu);
                }
            })
            .catch(err => console.error('Error al cargar preuniversitarios:', err));
    }, []);

    // 2. Cargar los alumnos cada vez que cambie el preuniversitario seleccionado
    useEffect(() => {
        if (!selectedPreuId) return;

        setLoading(true);
        axios.get(`http://localhost:3000/api/preuniversitarios/${selectedPreuId}/alumnos`)
            .then(response => {
                const res = response.data;
                if (res.success) {
                    setAlumnos(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error al cargar alumnos:', err);
                setLoading(false);
            });
    }, [selectedPreuId]);

    // Filtrar alumnos según el texto ingresado en la barra de búsqueda
    const alumnosFiltrados = alumnos.filter(alumno => 
        alumno.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
        alumno.rut.includes(busqueda) ||
        alumno.curso.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="tab-content active">
            <div className="info-box">
                ℹ️ <strong>Aviso:</strong> Los alumnos inscritos en esta lista asisten al Preuniversitario del colegio con permiso autorizado.
            </div>

            {/* Selector dinámico de Preuniversitario */}
            <div className="filter-container" style={{ marginBottom: '20px' }}>
                <label htmlFor="select-preu" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                    Seleccione Preuniversitario:
                </label>
                <select 
                    id="select-preu"
                    value={selectedPreuId} 
                    onChange={(e) => setSelectedPreuId(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    {preuniversitarios.map((preu) => (
                        <option key={preu.id_preu} value={preu.id_preu}>
                            {preu.nombre_preu} ({preu.entidad})
                        </option>
                    ))}
                </select>
            </div>

            <div className="table-header-actions">
                <h3>Lista de Alumnos Autorizados</h3>
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="🔍 Buscar por Alumno, RUT o Curso..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>RUT</th>
                        <th>Nombre Alumno</th>
                        <th>Curso</th>
                        <th>Correo Electrónico</th>
                        <th>Estado Permiso</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                Cargando alumnos...
                            </td>
                        </tr>
                    ) : alumnosFiltrados.length > 0 ? (
                        alumnosFiltrados.map((alumno) => (
                            <tr key={alumno.rut}>
                                <td>{alumno.rut}</td>
                                <td>{alumno.nombre_completo}</td>
                                <td>{alumno.curso}</td>
                                <td>{alumno.correo_electronico}</td>
                                <td>
                                    <span className="badge-success">Autorizado</span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                No hay alumnos registrados para este preuniversitario.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}