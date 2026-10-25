const router = require('express').Router();

const { obtenerAlumnos, obtenerCursos } = require('../controllers/alumnosController');

router.post('/', obtenerAlumnos);

router.get('/cursos', obtenerCursos);

module.exports = router;