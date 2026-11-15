const { 
    atrasosFiltrados, 
    agregarAtraso,
    obtenerSemestresDisponibles
} = require('../models/atrasosModel');

const obtenerAtrasos = async (req, res) => {
    try {
        const filtros = {
            fecha: req.query.fecha || null,
            curso: req.query.curso || null,
            rut_alumno: req.query.rut_alumno || null,
            anio: req.query.anio || null,
            semestre: req.query.semestre || null,
            gravedad: req.query.gravedad || null // NUEVO PARÁMETRO
        };
        const atrasos = await atrasosFiltrados(filtros); 
        res.json(atrasos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener atrasos' });
    }
};

const getSemestres = async (req, res) => {
    try {
        const semestres = await obtenerSemestresDisponibles();
        res.json(semestres);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener semestres' });
    }
};

const nuevoAtraso = async (req, res) => {
    try {
        const { fecha, rut_alumno, hora_llegada } = req.body;
        const result = await agregarAtraso(fecha, rut_alumno, hora_llegada);
        res.status(201).json({ mensaje: 'Atraso registrado con éxito', registro: result });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Ya se registró atraso para este alumno este día, revise bien el alumno' });
        }
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el atraso. Verifica que el alumno exista.' });
    }
};

module.exports = { obtenerAtrasos, nuevoAtraso, getSemestres };