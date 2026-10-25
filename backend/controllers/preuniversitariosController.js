const { getAll, getAlumnosByPreuId } = require('../models/preuniversitariosModel');

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

module.exports = { listarAlumnosPorPreuniversitario, listarPreuniversitarios }