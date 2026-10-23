const router = require('express').Router();
const { obtenerAtrasos, nuevoAtraso } = require('../controllers/atrasosController');

router.get('/alumno', obtenerAtrasos);

router.post('/alumno/nuevo-atraso', nuevoAtraso);

module.exports = router;