const pool = require('../config/db');

const reunionesByCurso = async (id_curso) => {
    const result = await pool.query(`
        SELECT 
            r.id_reunion, 
            r.id_curso, 
            TO_CHAR(r.fecha, 'YYYY-MM-DD') AS fecha, -- Formato Año-Mes-Día
            r.hora 
        FROM Reunion_Apoderados r
        WHERE r.id_curso = $1
        ORDER BY r.fecha DESC;`,
    [id_curso]);
    return result.rows;
};

const preguntasByReunion = async (id_reunion) => {
    const result = await pool.query(`
        SELECT * FROM Registro_Preguntas r
        WHERE r.id_reunion = $1;`,
    [id_reunion]);
    return result.rows;
}

module.exports = {reunionesByCurso, preguntasByReunion};