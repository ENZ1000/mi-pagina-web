const { obtenerTodasLicencias, agregarLicencia } = require('../models/saludModel');

const obtenerLicencias = async (req, res) => {
    try {
        const licencias = await obtenerTodasLicencias();
        res.json(licencias.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener licencias médicas' });
    }
};

const nuevaLicencia = async (req, res) => {
    try {
        const { rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico } = req.body;
        const result = await agregarLicencia(rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico);
        res.status(201).json({ mensaje: 'Licencia médica registrada con éxito', registro: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar la licencia médica.' });
    }
};

module.exports = { obtenerLicencias, nuevaLicencia };