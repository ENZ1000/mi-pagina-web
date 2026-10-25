const { 
    atrasosByFecha, 
    agregarAtraso, 
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

module.exports = { 
    obtenerAtrasos, 
    nuevoAtraso
};