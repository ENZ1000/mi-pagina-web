const pool = require('./db'); 

const obtenerTodosAlumnos = async () => {
    const result = await pool.query(`
        SELECT id_alumno, nombre_completo, curso_actual FROM Alumno 
        ORDER BY nombre_completo`);
    return result.rows;
};

const obtenerTodosCursos = async () => {
    const result = await pool.query(`
        SELECT id_curso, numero, letra FROM Curso
        ORDER BY numero, letra`);
    return result.rows;
}

module.exports = { obtenerTodosAlumnos, obtenerTodosCursos };