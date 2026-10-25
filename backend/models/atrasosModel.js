const pool = require('../config/db.js');

const atrasosByFecha = async (fecha) => {
    const result = await pool.query(
        `SELECT 
            TO_CHAR(a.fecha, 'YYYY-MM-DD') AS fecha, 
            a.hora_llegada, 
            al.nombre_completo, 
            c.numero, 
            c.letra,
            a.id_atraso,
            CASE 
                WHEN a.id_atraso = 1 THEN 'atraso-leve'
                WHEN a.id_atraso = 2 THEN 'atraso-mayor'
                WHEN a.id_atraso = 3 THEN 'atraso-grave'
                ELSE 'atraso-leve'
            END AS tipo
        FROM Atraso a
        JOIN Alumno al ON a.rut_alumno = al.rut
        JOIN Curso c ON al.curso_actual = c.id_curso
        WHERE a.fecha = $1
        ORDER BY a.fecha DESC, a.hora_llegada DESC;`,
        [fecha]);
    return result.rows;
};

const agregarAtraso = async (fecha, rut_alumno, hora_llegada) => {
    const result = await pool.query(
        `INSERT INTO Atraso (fecha, rut_alumno, id_atraso, hora_llegada)
        VALUES ($1, $2, 
            CASE 
                WHEN ($3::TIME) > '08:00:00' AND ($3::TIME) <= '08:10:00' THEN 1
                WHEN ($3::TIME) > '08:10:00' AND ($3::TIME) <= '10:00:00' THEN 2
                ELSE 3
            END, 
            $3::TIME
        )`,
        [fecha, rut_alumno, hora_llegada]);
    return result.rows;
}

module.exports = { atrasosByFecha, agregarAtraso };