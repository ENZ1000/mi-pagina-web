const router = require('express').Router();
const { 
    obtenerAtrasos, 
    nuevoAtraso,
    getSemestres 
} = require('../controllers/atrasosController');

router.get('/semestres', getSemestres);
router.get('/', obtenerAtrasos);
router.post('/nuevo-atraso', nuevoAtraso);

module.exports = router;