import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function DetalleAlumno() {
    const { rut } = useParams();
    const [tabActiva, setTabActiva] = useState('datos'); 
    
    const [alumno, setAlumno] = useState(null);
    const [atrasos, setAtrasos] = useState([]);
    const [licencias, setLicencias] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Estados para edición
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formDatos, setFormDatos] = useState({
        correo_alumno: '',
        direccion_alumno: '',
        correo_apoderado: '',
        telefono_apoderado: ''
    });

    const [filtroAtrasoSem, setFiltroAtrasoSem] = useState('todos');
    const [filtroLicenciaSem, setFiltroLicenciaSem] = useState('todos');
    const [filtroLicenciaEstado, setFiltroLicenciaEstado] = useState('todas');

    const getAnioSemestre = (fechaStr) => {
        if (!fechaStr) return null;
        const partes = String(fechaStr).split('T')[0].split('-');
        if (partes.length < 2) return null;
        const anio = partes[0];
        const mes = Number(partes[1]);
        const semestre = mes <= 7 ? 1 : 2;
        return `${anio}-${semestre}`;
    };

    const fetchDetalles = async () => {
        try {
            const resAlumno = await axios.get(`http://localhost:3000/api/alumnos/detalle/${rut}`);
            setAlumno(resAlumno.data);
            
            setFormDatos({
                correo_alumno: resAlumno.data.correo_electronico || '',
                direccion_alumno: resAlumno.data.direccion_completa || '',
                correo_apoderado: resAlumno.data.correo_apoderado || '',
                telefono_apoderado: resAlumno.data.telefono_apoderado || ''
            });

            const resAtrasos = await axios.get('http://localhost:3000/api/atrasos', { params: { rut_alumno: rut } });
            setAtrasos(resAtrasos.data || []);

            const resLicencias = await axios.get(`http://localhost:3000/api/salud/alumno/${rut}`);
            setLicencias(Array.isArray(resLicencias.data) ? resLicencias.data : []);
        } catch (error) {
            console.error('Error al cargar los detalles:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (rut) fetchDetalles();
    }, [rut]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleGuardarCambios = async () => {
        try {
            await axios.put(`http://localhost:3000/api/alumnos/detalle/${rut}`, {
                rut_apoderado: alumno.rut_apoderado,
                ...formDatos
            });
            alert('Datos actualizados exitosamente');
            setModoEdicion(false);
            await fetchDetalles(); 
        } catch (error) {
            console.error('Error al actualizar:', error);
            alert('Error al guardar los cambios.');
        }
    };

    const handleCancelar = () => {
        setModoEdicion(false);
        setFormDatos({
            correo_alumno: alumno.correo_electronico || '',
            direccion_alumno: alumno.direccion_completa || '',
            correo_apoderado: alumno.correo_apoderado || '',
            telefono_apoderado: alumno.telefono_apoderado || ''
        });
    };

    const hoy = new Date();
    const anioActual = hoy.getFullYear().toString();
    const semestreActual = (hoy.getMonth() + 1) <= 7 ? 1 : 2;
    const anioSemActual = `${anioActual}-${semestreActual}`;

    const semestresAtrasos = [...new Set(atrasos.map(a => getAnioSemestre(a.fecha)).filter(Boolean))].sort().reverse();
    const atrasosEsteAnio = atrasos.filter(a => getAnioSemestre(a.fecha)?.startsWith(anioActual));
    const atrasosEsteSemestre = atrasos.filter(a => getAnioSemestre(a.fecha) === anioSemActual);

    const contarGravedad = (lista) => ({
        graves: lista.filter(a => a.nombre_atraso === 'Grave').length,
        mayores: lista.filter(a => a.nombre_atraso === 'Mayor').length,
        leves: lista.filter(a => a.nombre_atraso === 'Leve').length
    });

    const statsAnio = contarGravedad(atrasosEsteAnio);
    const statsSem = contarGravedad(atrasosEsteSemestre);
    const atrasosFiltrados = atrasos.filter(a => filtroAtrasoSem === 'todos' || getAnioSemestre(a.fecha) === filtroAtrasoSem);

    const getClaseColorAtraso = (nombre) => {
        if (nombre === 'Grave') return 'atraso-grave';
        if (nombre === 'Mayor') return 'atraso-mayor'; 
        return 'atraso-leve';
    };

    const parsearFechaSegura = (fechaStr, diasDuracion = 1) => {
        if (!fechaStr) return { inicio: 'N/A', fin: 'N/A', estado: 'pasada', anioSem: null };
        const partes = String(fechaStr).split('T')[0].split('-');
        if (partes.length !== 3) return { inicio: 'N/A', fin: 'N/A', estado: 'pasada', anioSem: null };

        const [anio, mes, dia] = partes.map(Number);
        const fechaObjInicio = new Date(anio, mes - 1, dia);
        const inicioFmt = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        
        const dias = Number(diasDuracion) || 1;
        const fechaObjFin = new Date(fechaObjInicio);
        fechaObjFin.setDate(fechaObjFin.getDate() + dias - 1);
        const finFmt = `${fechaObjFin.getFullYear()}-${String(fechaObjFin.getMonth() + 1).padStart(2, '0')}-${String(fechaObjFin.getDate()).padStart(2, '0')}`;

        const hoyDate = new Date();
        hoyDate.setHours(0, 0, 0, 0);
        return { 
            inicio: inicioFmt, 
            fin: finFmt, 
            estado: fechaObjFin >= hoyDate ? 'activa' : 'pasada', 
            anioSem: `${anio}-${mes <= 7 ? 1 : 2}` 
        };
    };

    const licenciasProcesadas = licencias.map(lic => {
        const calculo = parsearFechaSegura(lic.fecha_inicio, lic.dias_reposo);
        return { ...lic, fechaInicioFmt: calculo.inicio, fechaFinFmt: calculo.fin, estadoCalculado: calculo.estado, anioSem: calculo.anioSem };
    });

    const semestresLicencias = [...new Set(licenciasProcesadas.map(l => l.anioSem).filter(Boolean))].sort().reverse();
    const licenciasFiltradas = licenciasProcesadas
        .filter(lic => filtroLicenciaEstado === 'todas' || lic.estadoCalculado === filtroLicenciaEstado)
        .filter(lic => filtroLicenciaSem === 'todos' || lic.anioSem === filtroLicenciaSem);

    const handleDescargar = (id_licencia) => {
        window.open(`http://localhost:3000/api/salud/licencias/${id_licencia}/descargar`, '_blank');
    };

    if (cargando) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando ficha del alumno...</div>;
    if (!alumno) return <div style={{ padding: '2rem', textAlign: 'center' }}>Alumno no encontrado.</div>;

    return (
        <div className="tab-content active" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* CABECERA CON BOTONES */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Ficha del Alumno: {alumno.nombre_completo}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {tabActiva === 'datos' && !modoEdicion && (
                        <button onClick={() => setModoEdicion(true)} className="btn-secondary" style={{ padding: '0.5rem 1rem', display: 'inline-block', margin: 0, border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                            ✏️ Editar Contacto
                        </button>
                    )}
                    <Link to="/director/buscar-alumno" className="btn-submit" style={{ textDecoration: 'none', padding: '0.5rem 1rem', display: 'inline-block', width: 'fit-content' }}>
                        Volver a Búsqueda
                    </Link>
                </div>
            </div>

            <div className="tabs-container" style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border)', marginBottom: '2rem' }}>
                <button className={`tab-btn ${tabActiva === 'datos' ? 'active' : ''}`} onClick={() => setTabActiva('datos')} style={{ padding: '0.75rem', background: 'none', border: 'none', borderBottom: tabActiva === 'datos' ? '3px solid var(--primary)' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}>
                    👤 Datos Personales
                </button>
                <button className={`tab-btn ${tabActiva === 'atrasos' ? 'active' : ''}`} onClick={() => setTabActiva('atrasos')} style={{ padding: '0.75rem', background: 'none', border: 'none', borderBottom: tabActiva === 'atrasos' ? '3px solid var(--primary)' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}>
                    ⏰ Historial Atrasos ({atrasos.length})
                </button>
                <button className={`tab-btn ${tabActiva === 'medica' ? 'active' : ''}`} onClick={() => setTabActiva('medica')} style={{ padding: '0.75rem', background: 'none', border: 'none', borderBottom: tabActiva === 'medica' ? '3px solid var(--primary)' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}>
                    ⚕️ Ficha Médica / Licencias ({licencias.length})
                </button>
            </div>

            {/* PESTAÑA: DATOS PERSONALES */}
            {tabActiva === 'datos' && (
                <div className="form-grid" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    
                    <div className="input-group"><label>RUT Alumno</label><input type="text" value={alumno.rut} disabled /></div>
                    <div className="input-group"><label>Nombre Completo</label><input type="text" value={alumno.nombre_completo} disabled /></div>
                    <div className="input-group"><label>Curso Actual</label><input type="text" value={`${alumno.numero}° Medio ${alumno.letra}`} disabled /></div>
                    
                    <div className="input-group">
                        <label>Email Alumno</label>
                        <input type="text" value={modoEdicion ? formDatos.correo_alumno : (alumno.correo_electronico || 'No registrado')} 
                               onChange={(e) => setFormDatos({...formDatos, correo_alumno: e.target.value})} 
                               disabled={!modoEdicion} style={modoEdicion ? { border: '1px solid var(--primary)' } : {}}/>
                    </div>
                    <div className="input-group">
                        <label>Dirección Alumno</label>
                        <input type="text" value={modoEdicion ? formDatos.direccion_alumno : (alumno.direccion_completa || 'No registrado')} 
                               onChange={(e) => setFormDatos({...formDatos, direccion_alumno: e.target.value})} 
                               disabled={!modoEdicion} style={modoEdicion ? { border: '1px solid var(--primary)' } : {}}/>
                    </div>

                    <h3 style={{ gridColumn: '1 / -1', marginTop: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Datos del Apoderado</h3>
                    <div className="input-group"><label>RUT Apoderado</label><input type="text" value={alumno.rut_apoderado} disabled /></div>
                    <div className="input-group"><label>Nombre Apoderado</label><input type="text" value={alumno.nombre_apoderado} disabled /></div>
                    
                    <div className="input-group">
                        <label>Email Apoderado</label>
                        <input type="text" value={modoEdicion ? formDatos.correo_apoderado : (alumno.correo_apoderado || 'No registrado')} 
                               onChange={(e) => setFormDatos({...formDatos, correo_apoderado: e.target.value})} 
                               disabled={!modoEdicion} style={modoEdicion ? { border: '1px solid var(--primary)' } : {}}/>
                    </div>
                    <div className="input-group">
                        <label>Teléfono Apoderado</label>
                        <input type="text" value={modoEdicion ? formDatos.telefono_apoderado : (alumno.telefono_apoderado || 'No registrado')} 
                               onChange={(e) => setFormDatos({...formDatos, telefono_apoderado: e.target.value})} 
                               disabled={!modoEdicion} style={modoEdicion ? { border: '1px solid var(--primary)' } : {}}/>
                    </div>

                    {/* BOTONES DE GUARDAR Y CANCELAR AL FONDO */}
                    {modoEdicion && (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                            <button onClick={handleCancelar} className="btn-secondary" style={{ padding: '0.5rem 1.5rem', margin: 0 }}>
                                Cancelar
                            </button>
                            <button onClick={handleGuardarCambios} className="btn-submit" style={{ padding: '0.5rem 1.5rem', margin: 0 }}>
                                Guardar Cambios
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* PESTAÑA: ATRASOS */}
            {tabActiva === 'atrasos' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)' }}>Atrasos este Semestre</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div><strong style={{ fontSize: '1.2rem', color: '#e74c3c' }}>{statsSem.graves}</strong><br/><small>Graves</small></div>
                                <div><strong style={{ fontSize: '1.2rem', color: '#f39c12' }}>{statsSem.mayores}</strong><br/><small>Mayores</small></div>
                                <div><strong style={{ fontSize: '1.2rem', color: '#27ae60' }}>{statsSem.leves}</strong><br/><small>Leves</small></div>
                            </div>
                        </div>
                        <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)' }}>Atrasos este Año</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div><strong style={{ fontSize: '1.2rem', color: '#e74c3c' }}>{statsAnio.graves}</strong><br/><small>Graves</small></div>
                                <div><strong style={{ fontSize: '1.2rem', color: '#f39c12' }}>{statsAnio.mayores}</strong><br/><small>Mayores</small></div>
                                <div><strong style={{ fontSize: '1.2rem', color: '#27ae60' }}>{statsAnio.leves}</strong><br/><small>Leves</small></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Historial Detallado</h3>
                        <select value={filtroAtrasoSem} onChange={(e) => setFiltroAtrasoSem(e.target.value)} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <option value="todos">Todos los tiempos</option>
                            {semestresAtrasos.map(sem => {
                                const [a, s] = sem.split('-');
                                return <option key={sem} value={sem}>{s}° Semestre {a}</option>;
                            })}
                        </select>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora Llegada</th>
                                <th>Gravedad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {atrasosFiltrados.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Sin atrasos registrados.</td></tr>
                            ) : (
                                atrasosFiltrados.map((a, i) => (
                                    <tr key={i} className={getClaseColorAtraso(a.nombre_atraso)}>
                                        <td>{a.fecha.split('T')[0]}</td>
                                        <td>{a.hora_llegada}</td>
                                        <td>{a.nombre_atraso}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* PESTAÑA: FICHA MÉDICA */}
            {tabActiva === 'medica' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Historial de Licencias Médicas</h3>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <select value={filtroLicenciaSem} onChange={(e) => setFiltroLicenciaSem(e.target.value)} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <option value="todos">Todos los tiempos</option>
                                {semestresLicencias.map(sem => {
                                    const [a, s] = sem.split('-');
                                    return <option key={sem} value={sem}>{s}° Semestre {a}</option>;
                                })}
                            </select>
                            <select value={filtroLicenciaEstado} onChange={(e) => setFiltroLicenciaEstado(e.target.value)} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <option value="todas">Cualquier Estado</option>
                                <option value="activa">Vigentes</option>
                                <option value="pasada">Caducadas</option>
                            </select>
                        </div>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Desde</th>
                                <th>Días</th>
                                <th>Hasta</th>
                                <th>Diagnóstico</th>
                                <th>Estado</th>
                                <th>Documento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenciasFiltradas.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No se encontraron licencias médicas.</td></tr>
                            ) : (
                                licenciasFiltradas.map((item, index) => (
                                    <tr key={item.id_licencia || index}>
                                        <td>{item.fechaInicioFmt}</td>
                                        <td>{item.dias_reposo}</td>
                                        <td>{item.fechaFinFmt}</td>
                                        <td>{item.diagnostico}</td>
                                        <td>
                                            <span className={`badge ${item.estadoCalculado === 'activa' ? 'badge-success' : 'badge-secondary'}`}>
                                                {item.estadoCalculado === 'activa' ? 'Vigente' : 'Caducada'}
                                            </span>
                                        </td>
                                        <td>
                                            {item.ruta_archivo ? (
                                                <button onClick={() => handleDescargar(item.id_licencia)} className="btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', margin: 0 }}>
                                                    Descargar
                                                </button>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin archivo</span>
                                            )}
                                        </td>
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