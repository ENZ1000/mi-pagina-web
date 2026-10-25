const pool = require('../config/db'); 


    const getAll = async () => {
        const result = await pool.query(`SELECT id_preu, nombre_preu, entidad FROM Preuniversitario ORDER BY nombre_preu ASC;`);
        return result.rows;
    };

    const getAlumnosByPreuId = async (idPreu) => {
        const query = `
            SELECT 
                a.rut, 
                a.nombre_completo, 
                CONCAT(c.numero, '° ', c.letra) AS curso,
                a.correo_electronico
            FROM Alumno a
            JOIN Asistencia_Preuniversitario asp ON a.rut = asp.rut_alumno
            JOIN Curso c ON a.curso_actual = c.id_curso
            WHERE asp.id_preu = $1
            ORDER BY a.nombre_completo ASC;
        `;
        const { rows } = await pool.query(query, [idPreu]);
        return rows;
    };

module.exports = { getAll, getAlumnosByPreuId };