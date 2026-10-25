const router = require('express').Router();
const { 
    obtenerAtrasos, 
    nuevoAtraso, 
    nuevaReunion 
} = require('../controllers/atrasosController');

router.get('/', obtenerAtrasos);
router.post('/nuevo-atraso', nuevoAtraso);

router.post('/nueva-reunion', nuevaReunion);

module.exports = router;