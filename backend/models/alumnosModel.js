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

const obtenerTodosAlumnos = async () => {
    const result = await pool.query(`
        SELECT a.rut, a.nombre_completo, c.numero, c.letra 
        FROM Alumno a
        JOIN Curso c ON a.curso_actual = c.id_curso
        ORDER BY c.numero ASC, c.letra ASC, a.nombre_completo ASC
    `);
    return result.rows;
};

const obtenerDetalleAlumno = async (rut) => {
    const query = `
        SELECT 
            al.*, 
            c.numero, c.letra, 
            ap.nombre_completo AS nombre_apoderado, 
            ap.correo_electronico AS correo_apoderado,
            ap.telefono AS telefono_apoderado
        FROM Alumno al
        JOIN Curso c ON al.curso_actual = c.id_curso
        JOIN Apoderado ap ON al.rut_apoderado = ap.rut
        WHERE al.rut = $1
    `;
    const result = await pool.query(query, [rut]);
    return result.rows[0];
};

const actualizarDatosPersonales = async (rut_alumno, rut_apoderado, datos) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query(`
            UPDATE Alumno 
            SET correo_electronico = $1, direccion_completa = $2 
            WHERE rut = $3
        `, [datos.correo_alumno, datos.direccion_alumno, rut_alumno]);
        
        await client.query(`
            UPDATE Apoderado 
            SET correo_electronico = $1, telefono = $2 
            WHERE rut = $3
        `, [datos.correo_apoderado, datos.telefono_apoderado, rut_apoderado]);
        
        await client.query('COMMIT');
        return true;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

// Exportar ambas funciones
module.exports = { alumnosByCurso, obtenerTodosCursos, obtenerTodosAlumnos, obtenerDetalleAlumno, actualizarDatosPersonales };