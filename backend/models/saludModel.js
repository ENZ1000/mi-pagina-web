const pool = require('../config/db');

const obtenerTodasLicencias = async () => {
    const query = `
        SELECT 
            l.id_licencia,
            l.rut_alumno,
            l.diagnostico,
            l.dias_reposo,
            TO_CHAR(l.fecha_inicio, 'YYYY-MM-DD') AS fecha_inicio,
            l.eximido_fisico,
            l.ruta_archivo,
            a.nombre_completo AS nombre_alumno, 
            c.numero, 
            c.letra 
        FROM LicenciaMedica l
        JOIN Alumno a ON l.rut_alumno = a.rut
        JOIN Curso c ON a.curso_actual = c.id_curso
        ORDER BY l.fecha_inicio DESC;
    `;
    return await pool.query(query);
};

const agregarLicencia = async (rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico, ruta_archivo = null) => {
    const query = `
        INSERT INTO LicenciaMedica (rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico, ruta_archivo)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico, ruta_archivo];
    return await pool.query(query, values);
};

module.exports = {
    obtenerTodasLicencias,
    agregarLicencia
};