const pool = require('../config/db.js');

const agregarAtraso = async (fecha, rut_alumno, hora_llegada) => {
    // 1=Leve (>08:00), 2=Mayor (>08:15), 3=Grave (>09:00)
    let id_atraso = 1;
    if (hora_llegada > '09:00') id_atraso = 3;
    else if (hora_llegada > '08:15') id_atraso = 2;

    const query = `
        INSERT INTO Atraso (fecha, rut_alumno, id_atraso, hora_llegada)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const result = await pool.query(query, [fecha, rut_alumno, id_atraso, hora_llegada]);
    return result.rows[0];
};

const obtenerSemestresDisponibles = async () => {
    const query = `
        SELECT DISTINCT 
            EXTRACT(YEAR FROM fecha) as anio, 
            CASE WHEN EXTRACT(MONTH FROM fecha) <= 7 THEN 1 ELSE 2 END as semestre
        FROM Atraso
        ORDER BY anio DESC, semestre DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

const atrasosFiltrados = async (filtros) => {
    let query = `
        SELECT a.fecha, a.hora_llegada, al.nombre_completo, c.numero, c.letra, t.nombre_atraso
        FROM Atraso a
        JOIN Alumno al ON a.rut_alumno = al.rut
        JOIN Curso c ON al.curso_actual = c.id_curso
        JOIN Tipo_Atraso t ON a.id_atraso = t.id_atraso
        WHERE 1=1
    `;
    const values = [];
    let contador = 1;

    if (filtros.fecha) {
        query += ` AND a.fecha = $${contador}`;
        values.push(filtros.fecha);
        contador++;
    }
    if (filtros.curso) {
        query += ` AND c.id_curso = $${contador}`;
        values.push(filtros.curso);
        contador++;
    }
    if (filtros.rut_alumno) {
        query += ` AND a.rut_alumno = $${contador}`;
        values.push(filtros.rut_alumno);
        contador++;
    }
    // NUEVO FILTRO DE GRAVEDAD
    if (filtros.gravedad) {
        query += ` AND a.id_atraso = $${contador}`;
        values.push(filtros.gravedad);
        contador++;
    }
    if (filtros.anio && filtros.semestre) {
        query += ` AND EXTRACT(YEAR FROM a.fecha) = $${contador}`;
        values.push(filtros.anio);
        contador++;
        
        if (filtros.semestre === '1') {
            query += ` AND EXTRACT(MONTH FROM a.fecha) BETWEEN 1 AND 7`;
        } else {
            query += ` AND EXTRACT(MONTH FROM a.fecha) BETWEEN 8 AND 12`;
        }
    }

    query += ` ORDER BY a.fecha DESC, a.hora_llegada DESC;`;
    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = { agregarAtraso, obtenerSemestresDisponibles, atrasosFiltrados };