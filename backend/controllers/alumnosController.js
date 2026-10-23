const { obtenerAlumnos, obtenerTodosCursos } = require('../models/alumnosModel')

const obtenerAlumnos = async (req, res) => {
    try{
        const alumnos = await obtenerTodosAlumnos();
        res.json(alumnos.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
};

const obtenerCursos = async (req, res) => {
    try{
        const cursos = await obtenerTodosCursos();
        res.json(cursos.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al obtener cursos' });
    }
}

module.exports = { obtenerAlumnos, obtenerCursos };