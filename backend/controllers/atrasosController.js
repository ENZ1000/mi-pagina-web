const { atrasosByRut, agregarAtraso } = require('../models/atrasosModel');

const obtenerAtrasos = async (req, res) => {
    try{
        const rut = req.body;
        const atrasos = await atrasosByRut(rut);
        res.json(atrasos);
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Error al obtener atrasos' });
    }
};

const nuevoAtraso = async (req, res) => {
    try{
        const { fecha, id_alumno, id_atraso, hora_llegada } = req.body;
        const result = await agregarAtraso(fecha, id_alumno, id_atraso, hora_llegada);
        res.status(201).json({ mensaje: 'Atraso registrado con éxito', registro: result.rows[0] });
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el atraso. Verifica que el alumno exista.' })
    }
};

module.exports = { obtenerAtrasos, nuevoAtraso };