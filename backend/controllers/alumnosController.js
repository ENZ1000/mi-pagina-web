const { alumnosByCurso, obtenerTodosCursos, obtenerTodosAlumnos } = require('../models/alumnosModel');
const { obtenerDetalleAlumno } = require('../models/alumnosModel'); // importarlo arriba
const { actualizarDatosPersonales } = require('../models/alumnosModel'); // Añadir a la importación superior

const obtenerAlumnos = async (req, res) => {
    try{
        const { id_curso } = req.body;
        const alumnos = await alumnosByCurso(id_curso);
        res.json(alumnos);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
};

const obtenerCursos = async (req, res) => {
    try{
        const cursos = await obtenerTodosCursos();
        res.json(cursos);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al obtener cursos' });
    }
}

const getAllAlumnos = async (req, res) => {
    try {
        const alumnos = await obtenerTodosAlumnos();
        res.json(alumnos);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener todos los alumnos' });
    }
};

const getDetalleAlumno = async (req, res) => {
    try {
        const { rut } = req.params;
        const alumno = await obtenerDetalleAlumno(rut);
        if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
        res.json(alumno);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener detalle del alumno' });
    }
};

const updateAlumno = async (req, res) => {
    try {
        const { rut } = req.params;
        const { rut_apoderado, correo_alumno, direccion_alumno, correo_apoderado, telefono_apoderado } = req.body;
        
        await actualizarDatosPersonales(rut, rut_apoderado, {
            correo_alumno, direccion_alumno, correo_apoderado, telefono_apoderado
        });
        
        res.json({ mensaje: 'Datos actualizados correctamente' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar los datos del alumno' });
    }
};

// Exportar
module.exports = { obtenerAlumnos, obtenerCursos, getAllAlumnos, getDetalleAlumno, updateAlumno };