const router = require('express').Router();
const { loginUsuario, registrarUsuario } = require('../controllers/authController');

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

module.exports = router;