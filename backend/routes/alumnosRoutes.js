const router = require('express').Router();

const { obtenerAlumnos, obtenerCursos } = require('../controllers/alumnosController');

router.get('/alumnos', obtenerAlumnos);

router.get('/cursos', obtenerCursos);

module.exports = router;