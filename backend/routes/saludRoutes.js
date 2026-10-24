const router = require('express').Router();
const { obtenerLicencias, nuevaLicencia } = require('../controllers/saludController');

router.get('/licencias', obtenerLicencias);
router.post('/nueva-licencia', nuevaLicencia);

module.exports = router;