const pool = require('../config/db.js');

const atrasosByRut = async (rut) => {
    const result = await pool.query(
        `SELECT a.fecha, a.hora_llegada, al.nombre_completo, c.numero, c.letra
        FROM Atraso a
        JOIN Alumno al ON a.id_alumno = al.id_alumno
        JOIN Curso c ON al.curso_actual = c.id_curso
        WHERE al.id_alumno = $1
        ORDER BY a.fecha DESC, a.hora_llegada DESC;`,
        [rut]);
    return result.rows;
};

const agregarAtraso = async (fecha, id_alumno, id_atraso, hora_llegada) => {
    const result = await pool.query(
        `INSERT INTO Atraso (fecha, id_alumno, id_atraso, hora_llegada)
        VALUES ($1, $2, $3, $4);`,
        [fecha, id_alumno, id_atraso, hora_llegada]);
    return result.rows;
}

module.exports = { atrasosByRut, agregarAtraso };