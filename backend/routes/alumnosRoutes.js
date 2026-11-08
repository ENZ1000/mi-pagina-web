const express = require('express');
const router = express.Router();
const { obtenerAlumnos, obtenerCursos, getAllAlumnos } = require('../controllers/alumnosController');
const { getDetalleAlumno } = require('../controllers/alumnosController'); 
const { updateAlumno } = require('../controllers/alumnosController'); 


router.post('/', obtenerAlumnos);

router.get('/cursos', obtenerCursos);

router.get('/todos', getAllAlumnos);

router.get('/detalle/:rut', getDetalleAlumno);

router.put('/detalle/:rut', updateAlumno);

module.exports = router;