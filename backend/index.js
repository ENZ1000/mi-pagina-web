const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes.js');
const atrasosRoutes = require('./routes/atrasosRoutes.js');
const alumnosRoutes = require('./routes/alumnosRoutes.js');
const retirosRoutes = require('./routes/retirosRoutes.js');
const saludRoutes = require('./routes/saludRoutes.js');

app.use('/auth', authRoutes);

app.use('/api/alumnos', alumnosRoutes);
app.use('/api/atrasos', atrasosRoutes);
app.use('/api/retiros', retirosRoutes);
app.use('/api/salud', saludRoutes);

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});

/*
app.get('/api/atrasos', async (req, res) => {
  try {
    const query = `
      SELECT a.fecha, a.hora_llegada, al.nombre_completo, c.numero, c.letra
      FROM Atraso a
      JOIN Alumno al ON a.id_alumno = al.id_alumno
      JOIN Curso c ON al.curso_actual = c.id_curso
      ORDER BY a.fecha DESC, a.hora_llegada DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener atrasos' });
  }
});

// 2. RUTA PARA GUARDAR UN ATRASO NUEVO
app.post('/api/atrasos', async (req, res) => {
  const { fecha, id_alumno, id_atraso, hora_llegada } = req.body;
  
  try {
    const query = `
      INSERT INTO Atraso (fecha, id_alumno, id_atraso, hora_llegada)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [fecha, id_alumno, id_atraso, hora_llegada];
    const result = await pool.query(query, values);
    
    res.status(201).json({ mensaje: 'Atraso registrado con éxito', registro: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el atraso. Verifica que el alumno exista.' });
  }
});
*/

/*
// ==========================================
// RUTAS PARA CURSOS Y ALUMNOS
// ==========================================

// Obtener todos los cursos
app.get('/api/cursos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_curso, numero, letra FROM Curso ORDER BY numero, letra');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// Obtener todos los alumnos
app.get('/api/alumnos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_alumno, nombre_completo, curso_actual FROM Alumno ORDER BY nombre_completo');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
});
*/