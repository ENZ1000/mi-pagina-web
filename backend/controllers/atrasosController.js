const { 
    atrasosFiltrados, 
    agregarAtraso,
    obtenerSemestresDisponibles,
    obtenerAtrasosParaNotificar
} = require('../models/atrasosModel');

const axios = require('axios'); // importacion que ayudara a comunicarse con brevo

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

const notificarAtrasosMatutinos = async () => {
    try {
        // Obtiene la fecha actual en formato YYYY-MM-DD
        const fechaHoy = new Date().toISOString().split('T')[0];
        const atrasos = await obtenerAtrasosParaNotificar(fechaHoy);

        if (atrasos.length === 0) {
            console.log('No hay atrasos para notificar hoy entre 08:20 y 09:30.');
            return;
        }

        // Iteración individual para cumplir con los correos independientes por alumno sin importar si es el mismo apoderado
        for (const registro of atrasos) {
            const payload = {
                sender: { name: "Inspectoría Colegio", email: "christophercolocolo280@gmail.com" },
                to: [{ email: registro.correo_apoderado }],
                subject: "Notificación de Atraso Escolar",
                htmlContent: `
                  <p>Estimado Apoderado,</p>
                  <p>Le informamos que el estudiante <strong>${registro.nombre_estudiante}</strong> 
                  (RUT: ${registro.rut_estudiante}) ha registrado un ingreso atrasado el día de hoy.</p>
                  <p>Hora exacta de llegada: <strong>${registro.hora_llegada}</strong></p>
                `
            };

            await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json'
                }
            });
        }
        console.log(`Se enviaron con éxito ${atrasos.length} notificaciones de atraso a las 09:30.`);
    } catch (error) {
        console.error('Error al comunicarse con Brevo:', error.message);
    }
};

module.exports = { obtenerAtrasos, nuevoAtraso, getSemestres, notificarAtrasosMatutinos };