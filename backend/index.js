const express = require('express');
const cors = require('cors');

const cron = require('node-cron');
const { notificarAtrasosMatutinos } = require('./controllers/atrasosController');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes.js');
const atrasosRoutes = require('./routes/atrasosRoutes.js');
const alumnosRoutes = require('./routes/alumnosRoutes.js');
const retirosRoutes = require('./routes/retirosRoutes.js');
const reunionesRoutes = require('./routes/reunionesRoutes.js');
const preuniversitarioRoutes = require('./routes/preuniversitariosRoutes.js');
const saludRoutes = require('./routes/saludRoutes.js');

app.use('/auth', authRoutes);

app.use('/api/alumnos', alumnosRoutes);
app.use('/api/atrasos', atrasosRoutes);
app.use('/api/retiros', retirosRoutes);
app.use('/api/reuniones', reunionesRoutes);
app.use('/api/preuniversitarios', preuniversitarioRoutes);
app.use('/api/salud', saludRoutes);

// Automatización: Ejecutar de Lunes a Viernes (1-5) a las 09:30 AM   //  '30 9 * * 1-5', ()  //cada 1 minuto  : '* * * * *', ()
cron.schedule('01 20 * * 1-7', () => {
  console.log('Ejecutando revisión y notificación de atrasos (09:30 hrs)...');
  notificarAtrasosMatutinos();
}, {
  scheduled: true,
  timezone: "America/Santiago"
});

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});