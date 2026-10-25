const { Router } = require('express');
const { listarPreuniversitarios, listarAlumnosPorPreuniversitario } = require('../controllers/preuniversitariosController');

const router = Router();


router.get('/', listarPreuniversitarios);


router.get('/:id/alumnos', listarAlumnosPorPreuniversitario);

module.exports = router;