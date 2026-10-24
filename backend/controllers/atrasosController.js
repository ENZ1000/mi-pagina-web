const { 
    atrasosByRut, 
    agregarAtraso, 
    obtenerTodosRetiros, 
    agregarRetiro, 
    agregarReunionConPreguntas 
} = require('../models/atrasosModel');

const obtenerAtrasos = async (req, res) => {
    try {
        const atrasos = await atrasosByRut(req.query.rut); 
        res.json(atrasos.rows || atrasos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener atrasos' });
    }
};

const nuevoAtraso = async (req, res) => {
    try {
        const { fecha, rut_alumno, id_atraso, hora_llegada } = req.body;
        const result = await agregarAtraso(fecha, rut_alumno, id_atraso, hora_llegada);
        res.status(201).json({ mensaje: 'Atraso registrado con éxito', registro: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el atraso. Verifica que el alumno exista.' });
    }
};

const obtenerRetiros = async (req, res) => {
    try {
        const retiros = await obtenerTodosRetiros();
        res.json(retiros.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener retiros' });
    }
};

const nuevoRetiro = async (req, res) => {
    try {
        const { id_curso, rut_alumno, tipo, fecha, hora, motivo } = req.body;
        const result = await agregarRetiro(id_curso, rut_alumno, tipo, fecha, hora, motivo);
        res.status(201).json({ mensaje: 'Retiro registrado con éxito', registro: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar el retiro.' });
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
    obtenerRetiros, 
    nuevoRetiro, 
    nuevaReunion 
};