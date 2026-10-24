const router = require('express').Router();
const { 
    obtenerAtrasos, 
    nuevoAtraso, 
    obtenerRetiros, 
    nuevoRetiro, 
    nuevaReunion 
} = require('../controllers/atrasosController');

router.get('/atrasos', obtenerAtrasos);
router.post('/nuevo-atraso', nuevoAtraso);

router.get('/retiros', obtenerRetiros);
router.post('/nuevo-retiro', nuevoRetiro);

router.post('/nueva-reunion', nuevaReunion);

module.exports = router;