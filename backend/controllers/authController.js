const  pool  = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {

  const { rut, correo_institucional, contrasena, cargo, nombre_completo } = req.body;

  const cliente = await pool.connect();

  try {
    // Inicia  transacción SQL para insertar en multiples tablas de forma segura
    await cliente.query('BEGIN');

    //Encripta contraseña y crea el Usuario base
    const hash = await bcrypt.hash(contrasena, 10);
    await cliente.query(
      'INSERT INTO Usuario (rut, correo_institucional, contrasena, cargo) VALUES ($1, $2, $3, $4)',
      [rut, correo_institucional, hash, cargo]
    );

    if (cargo === 'Orientacion' || cargo === 'Salud' || cargo === 'UTP' || cargo === 'Convivencia') {
      await cliente.query(
        'INSERT INTO Funcionario (rut, nombre_completo) VALUES ($1, $2)',
        [rut, nombre_completo]
      );
    } else {
      await cliente.query(
        'INSERT INTO Profesor (rut, nombre_completo) VALUES ($1, $2)',
        [rut, nombre_completo]
      );
    }

    //Confirma la transacción
    await cliente.query('COMMIT');
    res.status(201).json({ message: 'Usuario registrado exitosamente', rut, correo_institucional, cargo });
  } catch (error) {
    //si algo falla, deshace los cambios para no dejar datos a medias
    await cliente.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario en la base de datos' });
  } finally {
    cliente.release();
  }
};

// Controlador para Iniciar Sesión
const loginUsuario = async (req, res) => {
  const { correo_institucional, contrasena } = req.body;

  try {
    //busca al usuario por su correo electrónico (que es UNIQUE)
    const result = await pool.query('SELECT * FROM Usuario WHERE correo_institucional = $1', [correo_institucional]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    
    //Verifica si la contraseña coincide con el hash guardado
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    //genera el token JWT incluyendo el rut y el rol
    const token = jwt.sign(
      { rut: usuario.rut, cargo: usuario.cargo }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' }
    );

    res.json({ token, usuario: { rut: usuario.rut, correo_institucional: usuario.correo_institucional, cargo: usuario.cargo } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor durante el login' });
  }
};

module.exports = { registrarUsuario, loginUsuario };