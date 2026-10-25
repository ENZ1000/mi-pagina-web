const { alumnosByCurso, obtenerTodosCursos } = require('../models/alumnosModel')

const obtenerAlumnos = async (req, res) => {
    try{
        const { id_curso } = req.body;
        const alumnos = await alumnosByCurso(id_curso);
        res.json(alumnos);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
};

const obtenerCursos = async (req, res) => {
    try{
        const cursos = await obtenerTodosCursos();
        res.json(cursos);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al obtener cursos' });
    }
}

module.exports = { obtenerAlumnos, obtenerCursos };