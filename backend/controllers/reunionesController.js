const { reunionesByCurso, preguntasByReunion } = require('../models/reunionesModel');


const obtenerReuniones = async(req, res) => {
    try{
        const {id_curso} = req.params;
        const result =await reunionesByCurso(id_curso);
        res.json(result);
    } catch(error) {
        res.status(500).json({error: 'Error al obtener las reuniones'});
    }
};

const obtenerPreguntas = async(req, res) => {
    try{
        const {id_reunion} = req.params;
        const result = await preguntasByReunion(id_reunion);
        res.json(result);
    } catch(error) {
        res.status(500).json({error: 'Error al obtener las preguntas'});
    }
};

module.exports = { obtenerReuniones, obtenerPreguntas };