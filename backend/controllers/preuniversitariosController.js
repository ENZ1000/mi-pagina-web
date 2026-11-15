const { getAll, getAlumnosByPreuId, inscribirAlumnoPreu } = require('../models/preuniversitariosModel');

const listarPreuniversitarios = async(req, res) => {
    try {
        const preuniversitarios = await getAll();
        return res.status(200).json({
            success: true,
            data: preuniversitarios
        });
    } catch (error) {
        console.error('Error al obtener preuniversitarios:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener los preuniversitarios.'
        });
    }
};

const listarAlumnosPorPreuniversitario = async (req, res) => {
    try {
        const { id } = req.params;
        const alumnos = await getAlumnosByPreuId(id);
        
        return res.status(200).json({
            success: true,
            data: alumnos
        });
    } catch (error) {
        console.error('Error al obtener alumnos del preuniversitario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener la lista de alumnos.'
        });
    }
};

const registrarAsistenciaPreu = async (req, res) => {
    try {
        const { rut_alumno, id_preu } = req.body;
        if (!rut_alumno || !id_preu) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (rut_alumno o id_preu)' });
        }
        const result = await inscribirAlumnoPreu(rut_alumno, id_preu);
        res.status(201).json({ mensaje: 'Alumno inscrito en el preuniversitario con éxito', registro: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al inscribir alumno en el preuniversitario' });
    }
};

module.exports = { listarAlumnosPorPreuniversitario, listarPreuniversitarios, registrarAsistenciaPreu };