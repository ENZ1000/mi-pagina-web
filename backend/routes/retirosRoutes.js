const router = require('express').Router();

const {obtenerRetiros, nuevoRetiro } = require('../controllers/retirosController');

router.get('/', obtenerRetiros);
router.post('/nuevo-retiro', nuevoRetiro);

module.exports = router;
    