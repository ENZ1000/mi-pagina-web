const pool = require('../config/db.js');

const obtenerTodosRetiros = async () => {
    const result = await pool.query(`
        SELECT TO_CHAR(r.fecha, 'YYYY-MM-DD') AS fecha, r.hora, r.motivo, al.nombre_completo, c.numero, c.letra FROM Retiro r
        JOIN Alumno al ON r.rut_alumno = al.rut
        JOIN Curso c ON c.id_curso = r.id_curso`);
    return result.rows;
};

const agregarRetiro = async (id_curso, rut_alumno, tipo, fecha, hora, motivo) => {
    const result = await pool.query(`
        INSERT INTO Retiro (id_curso, rut_alumno, tipo, fecha, hora, motivo)
        VALUES ($1, $2, $3, $4, $5, $6)`,
    [id_curso, rut_alumno, tipo, fecha, hora, motivo]);
    return result.rows;
};

module.exports = { obtenerTodosRetiros, agregarRetiro };