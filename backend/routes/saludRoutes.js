const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { obtenerLicencias, nuevaLicencia, descargarLicencia } = require('../controllers/saludController');

// Configuración de Multer para asignar nombre único a cada licencia
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //Observacion: debe estar creada la carpeta "uploads/licencias/" en la raiz del backend
        cb(null, 'uploads/licencias/'); 
    },
    filename: function (req, file, cb) {
        const rut = req.body.rut_alumno || 'sin-rut';
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `${rut}_${timestamp}${extension}`);
    }
});

const upload = multer({ storage: storage });

router.get('/licencias', obtenerLicencias);
router.post('/nueva-licencia', upload.single('archivo_licencia'), nuevaLicencia);
router.get('/licencias/:id/descargar', descargarLicencia);

module.exports = router;