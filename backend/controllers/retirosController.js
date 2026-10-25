const { obtenerTodosRetiros, agregarRetiro } = require('../models/retirosModel')

const obtenerRetiros = async (req, res) => {
    try {
        const retiros = await obtenerTodosRetiros();
        res.json(retiros);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener retiros' });
    }
};

const nuevoRetiro = async (req, res) => {
    try {
        const { id_curso, rut_alumno, tipo, fecha, hora, motivo } = req.body;
        const result = await agregarRetiro(id_curso, rut_alumno, tipo, fecha, hora, motivo);
        res.status(201).json({ mensaje: 'Retiro registrado con éxito', registro: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar el retiro.' });
    }
};

module.exports = {obtenerRetiros, nuevoRetiro}