const { Router } = require('express');
const { listarPreuniversitarios, listarAlumnosPorPreuniversitario, registrarAsistenciaPreu } = require('../controllers/preuniversitariosController');

const router = Router();

router.get('/', listarPreuniversitarios);
router.post('/inscribir', registrarAsistenciaPreu);
router.get('/:id/alumnos', listarAlumnosPorPreuniversitario);

module.exports = router;