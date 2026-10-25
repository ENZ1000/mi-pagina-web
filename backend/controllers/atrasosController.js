const { 
    atrasosByFecha, 
    agregarAtraso, 
    agregarReunionConPreguntas 
} = require('../models/atrasosModel');

const obtenerAtrasos = async (req, res) => {
    try {
        const atrasos = await atrasosByFecha(req.query.fecha); 
        res.json(atrasos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener atrasos' });
    }
};

const nuevoAtraso = async (req, res) => {
    try {
        const { fecha, rut_alumno, hora_llegada } = req.body;
        const result = await agregarAtraso(fecha, rut_alumno, hora_llegada);
        res.status(201).json({ mensaje: 'Atraso registrado con éxito', registro: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el atraso. Verifica que el alumno exista.' });
    }
};

const nuevaReunion = async (req, res) => {
    try {
        const { id_curso, fecha, hora, resumen, preguntas, asistentes } = req.body;
        const result = await agregarReunionConPreguntas(id_curso, fecha, hora, resumen, preguntas, asistentes);
        res.status(201).json({ mensaje: 'Reunión y actas guardadas con éxito' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar la reunión.' });
    }
};

module.exports = { 
    obtenerAtrasos, 
    nuevoAtraso, 
    nuevaReunion 
};