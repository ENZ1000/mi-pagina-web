const router = require('express').Router();
const { 
    obtenerAtrasos, 
    nuevoAtraso, 
} = require('../controllers/atrasosController');

router.get('/', obtenerAtrasos);
router.post('/nuevo-atraso', nuevoAtraso);

module.exports = router;