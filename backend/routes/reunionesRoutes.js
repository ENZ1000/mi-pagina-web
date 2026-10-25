const router = require('express').Router();
const { obtenerReuniones, obtenerPreguntas } = require('../controllers/reunionesController')

router.get('/curso/:id_curso', obtenerReuniones);

router.get('/:id_reunion/preguntas', obtenerPreguntas);

module.exports = router;