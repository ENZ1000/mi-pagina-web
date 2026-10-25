const pool = require('../config/db.js');

const alumnosByCurso = async (id_curso) => {
    const result = await pool.query(`
        SELECT rut, nombre_completo, curso_actual FROM Alumno
        JOIN Curso ON Curso.id_curso = Alumno.curso_actual
        WHERE Curso.id_curso = $1
        ORDER BY nombre_completo`,
        [id_curso]);
    return result.rows;
};

const obtenerTodosCursos = async () => {
    const result = await pool.query(`
        SELECT id_curso, numero, letra FROM Curso
        ORDER BY numero, letra`);
    return result.rows;
}

module.exports = { alumnosByCurso, obtenerTodosCursos };