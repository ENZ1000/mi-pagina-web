const pool = require('../config/db');

const obtenerTodasLicencias = async () => {
    const query = `
        SELECT l.*, a.nombre_completo as nombre_alumno, c.numero, c.letra 
        FROM LicenciaMedica l
        JOIN Alumno a ON l.rut_alumno = a.rut
        JOIN Curso c ON a.curso_actual = c.id_curso
        ORDER BY l.fecha_inicio DESC;
    `;
    return await pool.query(query);
};

const agregarLicencia = async (rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico, ruta_archivo) => {
    const query = `
        INSERT INTO LicenciaMedica (rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico, ruta_archivo)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico, ruta_archivo];
    return await pool.query(query, values);
};

const obtenerRutaLicencia = async (id_licencia) => {
    const query = `SELECT ruta_archivo FROM LicenciaMedica WHERE id_licencia = $1`;
    return await pool.query(query, [id_licencia]);
};

module.exports = {
    obtenerTodasLicencias,
    agregarLicencia,
    obtenerRutaLicencia
};