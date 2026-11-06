import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HistorialSalud() {
  const [filtroEstado, setFiltroEstado] = useState('activa');
  const [licencias, setLicencias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarLicencias = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/salud/licencias');
        const data = await res.json();
        setLicencias(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar historial:', error);
        setLicencias([]);
      } finally {
        setCargando(false);
      }
    };
    cargarLicencias();
  }, []);

  const handleDescargar = (id_licencia) => {
    window.open(`http://localhost:3000/api/salud/licencias/${id_licencia}/descargar`, '_blank');
  };

  const parsearFechaSegura = (fechaStr, diasDuracion = 1) => {
    if (!fechaStr) return { inicio: 'N/A', fin: 'N/A', estado: 'pasada' };

    const partes = String(fechaStr).split('T')[0].split('-');
    if (partes.length !== 3) return { inicio: 'N/A', fin: 'N/A', estado: 'pasada' };

    const [anio, mes, dia] = partes.map(Number);
    const fechaObjInicio = new Date(anio, mes - 1, dia);

    const inicioFmt = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    const dias = Number(diasDuracion) || 1;
    const fechaObjFin = new Date(fechaObjInicio);
    fechaObjFin.setDate(fechaObjFin.getDate() + dias - 1);

    const finFmt = `${fechaObjFin.getFullYear()}-${String(fechaObjFin.getMonth() + 1).padStart(2, '0')}-${String(fechaObjFin.getDate()).padStart(2, '0')}`;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const estado = fechaObjFin >= hoy ? 'activa' : 'pasada';

    return { inicio: inicioFmt, fin: finFmt, estado };
  };

  const licenciasProcesadas = licencias
    .map((lic) => {
      const calculo = parsearFechaSegura(lic.fecha_inicio, lic.dias_reposo);
      return {
        ...lic,
        fechaInicioFmt: calculo.inicio,
        fechaFinFmt: calculo.fin,
        estadoCalculado: calculo.estado
      };
    })
    .filter((lic) => filtroEstado === 'todas' || lic.estadoCalculado === filtroEstado)
    .filter((lic) => {
      if (!busqueda.trim()) return true;
      const busq = busqueda.toLowerCase();
      const nombre = (lic.nombre_alumno || '').toLowerCase();
      const diag = (lic.diagnostico || '').toLowerCase();
      return nombre.includes(busq) || diag.includes(busq);
    });

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/home">← Volver al Inicio</Link>
      </div>

      <div className="table-header-actions">
        <div>
          <h2>Historial de Licencias Médicas</h2>
          <p style={{ color: 'var(--text-muted)' }}>Registro acumulado de reposos médicos del alumnado.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por alumno o diagnóstico..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}
          >
            <option value="todas">Todas</option>
            <option value="activa">Vigentes</option>
            <option value="pasada">Caducadas</option>
          </select>
        </div>
      </div>

      {cargando ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Cargando registros...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Alumno</th>
              <th>Desde</th>
              <th>Días</th>
              <th>Hasta</th>
              <th>Diagnóstico</th>
              <th>Estado</th>
              <th>Documento</th>
            </tr>
          </thead>
          <tbody>
            {licenciasProcesadas.map((item, index) => (
              <tr key={item.id_licencia || index}>
                <td>{item.numero ? `${item.numero}° ${item.letra}` : '-'}</td>
                <td><strong>{item.nombre_alumno}</strong></td>
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
                    <button
                      onClick={() => handleDescargar(item.id_licencia)}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', margin: 0 }}
                    >
                      Descargar
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin archivo</span>
                  )}
                </td>
              </tr>
            ))}

            {licenciasProcesadas.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No se encontraron licencias médicas registradas con este criterio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}