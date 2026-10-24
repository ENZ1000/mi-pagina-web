-- ==========================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- ==========================================

-- ==========================================
-- 1. TABLAS INDEPENDIENTES
-- ==========================================

INSERT INTO Usuario (rut, correo_institucional, contrasena, cargo) VALUES
('11111111-1', 'pcubillos@colegio.cl', 'hashed_password', 'Orientacion'),
('22222222-2', 'amaria@colegio.cl', 'hashed_password', 'Salud'),
('33333333-3', 'max@colegio.cl', 'hashed_password', 'Inspectoria'),
('44444444-4', 'genoveva@colegio.cl', 'hashed_password', 'Convivencia'),
('55555555-5', 'mariajose@colegio.cl', 'hashed_password', 'Area CH y TP'),
('66666666-6', 'muriel@colegio.cl', 'hashed_password', 'Area CH y TP');

INSERT INTO Funcionario (rut, nombre_completo) VALUES
('11111111-1', 'Patricia Cubillos'),
('22222222-2', 'Ana Maria'),
('33333333-3', 'Inspector Max'),
('44444444-4', 'Genoveva'),
('55555555-5', 'Maria Jose'),
('66666666-6', 'Muriel');

INSERT INTO Profesor (rut, nombre_completo) VALUES
('77777777-7', 'Mauricio Olivares'),
('88888888-8', 'Camila Rojas'),
('99999999-9', 'Diego Silva'),
('10101010-1', 'Fernanda Soto');

INSERT INTO Tipo_Atraso (id_atraso, nombre_atraso) VALUES
(1, 'Leve'),
(2, 'Mayor'),
(3, 'Grave');

INSERT INTO Preuniversitario (id_preu, nombre_preu, entidad) VALUES
(1, 'Preuniversitario Solidario USM', 'Universitaria'),
(2, 'Pedro de Valdivia', 'Privada'),
(3, 'Cpech', 'Privada');

INSERT INTO Apoderado (rut, nombre_completo, correo_electronico, fecha_nacimiento, direccion_completa) VALUES
('12345678-5', 'Marta Díaz', 'marta.diaz@gmail.com', '1980-05-14', 'San Pablo 123, Pudahuel'),
('87654321-K', 'Roberto Muñoz', 'roberto.m@hotmail.com', '1975-10-22', 'Teniente Cruz 456, Pudahuel'),
('11223344-9', 'Carmen Gloria', 'cgloria@gmail.com', '1982-03-09', 'La Estrella 789, Pudahuel');


-- ==========================================
-- 2. TABLAS DE NIVEL 2
-- ==========================================

INSERT INTO Curso (id_curso, numero, letra, rut_profesor) VALUES
(1, 1, 'A', '77777777-7'),
(2, 2, 'B', '88888888-8'),
(3, 3, 'A', '99999999-9'),
(4, 4, 'A', '10101010-1');

INSERT INTO Alumno (rut, rut_apoderado, nombre_completo, fecha_nacimiento, edad, etnia, direccion_completa, correo_electronico, curso_anterior, curso_actual) VALUES
('20000001-1', '12345678-5', 'Javier Muñoz Díaz', '2008-04-12', 15, 'Ninguna', 'San Pablo 123, Pudahuel', 'javier.m@alumno.cl', 1, 3),
('20000002-2', '87654321-K', 'Sofia Muñoz', '2009-08-20', 14, 'Ninguna', 'Teniente Cruz 456, Pudahuel', 'sofia.m@alumno.cl', 1, 2),
('20000003-3', '11223344-9', 'Felipe Castro Gloria', '2010-02-15', 13, 'Mapuche', 'La Estrella 789, Pudahuel', 'felipe.c@alumno.cl', 1, 1),
('20000004-4', '12345678-5', 'Valentina Muñoz Díaz', '2006-11-05', 17, 'Ninguna', 'San Pablo 123, Pudahuel', 'valentina.m@alumno.cl', 3, 4);


-- ==========================================
-- 3. TABLAS DE NIVEL 3
-- ==========================================

INSERT INTO Reunion_Apoderados (id_reunion, id_curso, fecha, hora) VALUES
(1, 1, '2026-04-15', '18:00:00'),
(2, 3, '2026-04-16', '18:30:00'),
(3, 4, '2026-04-17', '19:00:00');

INSERT INTO Ficha_General_Alumno (id_ficha, rut_funcionario, rut_alumno, antecedentes_socioeconomicos, antecedente_emocional, antecedente_salud, fecha_ultima_actualizacion, estado_acuse_profesor, fecha_acuse_recibo) VALUES
(1, '44444444-4', '20000001-1', 'Quintil 3', 'Sin observaciones', 'Asma leve', '2026-03-01', 'Recibido', '2026-03-05'),
(2, '44444444-4', '20000002-2', 'Quintil 2', 'Ansiedad', 'Sano', '2026-03-01', 'Pendiente', NULL),
(3, '44444444-4', '20000003-3', 'Quintil 1', 'Sin observaciones', 'Alergia estacional', '2026-03-02', 'Recibido', '2026-03-06');

INSERT INTO Ficha_Psicopedagogico (id_expediente, rut_funcionario, rut_alumno, necesidad_evaluativa, evaluacion_diferenciada, tipo_nee, estado_plan, fecha_ingreso) VALUES
(1, '55555555-5', '20000002-2', 'Déficit Atencional', 'Sí', 'Transitoria', 'En progreso', '2025-05-10'),
(2, '66666666-6', '20000003-3', 'Dificultad de Aprendizaje', 'Sí', 'Permanente', 'Dado de alta', '2024-04-12');

INSERT INTO Registro_Convivencia (id_registro, rut_funcionario, rut_alumno, fecha, curso_pre_accidente, situacion, observacion_textual) VALUES
(1, '44444444-4', '20000001-1', '2026-04-10', '3A', 'Pelea en recreo', 'El alumno empujó a un compañero durante el recreo. Se conversó con él.'),
(2, '44444444-4', '20000002-2', '2026-05-15', '2B', 'Falta de respeto', 'Interrupción constante en clases.');

INSERT INTO LicenciaMedica (id_licencia, rut_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico) VALUES
(1, '20000001-1', 'Bronquitis obstructiva', 5, '2026-05-01', FALSE),
(2, '20000004-4', 'Esguince de tobillo', 15, '2026-06-15', TRUE);

INSERT INTO Retiro (id_retiro, id_curso, rut_alumno, tipo, fecha, hora, motivo) VALUES
(1, 3, '20000001-1', 'Eventual', '2026-04-20', '11:00:00', 'Cita médica'),
(2, 4, '20000004-4', 'Permanente', '2026-08-01', '09:00:00', 'Cambio de ciudad y colegio');

INSERT INTO Atraso (fecha, rut_alumno, id_atraso, hora_llegada) VALUES
('2026-04-10', '20000001-1', 1, '08:05:00'),
('2026-04-11', '20000001-1', 2, '08:15:00'),
('2026-05-02', '20000002-2', 3, '10:05:00'),
('2026-05-05', '20000003-3', 1, '08:02:00');


-- ==========================================
-- 4. TABLAS DE NIVEL 4
-- ==========================================

INSERT INTO Asistencia_Preuniversitario (rut_alumno, id_preu) VALUES
('20000004-4', 1),
('20000001-1', 2),
('20000002-2', 3);

INSERT INTO Registro_Preguntas (id_pregunta, id_reunion, pregunta, respuesta) VALUES
(1, 1, '¿Cuándo son las pruebas de síntesis?', 'La primera semana de julio.'),
(2, 2, '¿Hay talleres extracurriculares este semestre?', 'Sí, comienzan en mayo.'),
(3, 3, '¿Cómo funciona la eximición de educación física?', 'Con certificado médico validado en inspectoría.');

INSERT INTO Asistencia_Reunion (id_curso, rut_apoderado, id_reunion) VALUES
(1, '11223344-9', 1),
(3, '12345678-5', 2),
(4, '12345678-5', 3);

-- Fin del script