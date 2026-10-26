const path = require('path');
const fs = require('fs');
const { obtenerTodasLicencias, agregarLicencia,obtenerRutaLicencia } = require('../models/saludModel');

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
        
        // Obtiene la ruta física del archivo subido por Multer
        const ruta_archivo = req.file ? req.file.path : null; 
        
        // FormData convierte los valores a texto, necesitamos castear el booleano
        const isEximido = eximido_fisico === 'true';

        const result = await agregarLicencia(
            rut_alumno, 
            diagnostico, 
            parseInt(dias_reposo), 
            fecha_inicio, 
            isEximido, 
            ruta_archivo
        );
        
        res.status(201).json({ mensaje: 'Licencia médica registrada con éxito', registro: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar la licencia médica.' });
    }
};

const descargarLicencia = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await obtenerRutaLicencia(id);

        if (result.rows.length === 0 || !result.rows[0].ruta_archivo) {
            return res.status(404).json({ error: 'El archivo no existe o no fue adjuntado.' });
        }

        const rutaRelativa = result.rows[0].ruta_archivo;
        // Construye la ruta absoluta para que el servidor ubique el documento en el disco
        const rutaAbsoluta = path.resolve(rutaRelativa);

        // Verifica si el archivo físico realmente sigue existiendo en el servidor
        if (fs.existsSync(rutaAbsoluta)) {
            res.download(rutaAbsoluta);
        } else {
            res.status(404).json({ error: 'El archivo físico fue movido o eliminado del servidor.' });
        }
    } catch (err) {
        console.error('Error al descargar:', err);
        res.status(500).json({ error: 'Error interno al procesar la descarga.' });
    }
};

module.exports = { obtenerLicencias, nuevaLicencia, descargarLicencia };