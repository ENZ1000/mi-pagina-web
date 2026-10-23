-- ==========================================
-- 1. TABLAS INDEPENDIENTES (Sin Claves ForÃ¡neas)
-- ==========================================

CREATE TABLE Funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100),
    correo_institucional VARCHAR(100),
    cargo VARCHAR(20)
);

CREATE TABLE Profesor (
    id_profesor SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100),
    correo_institucional VARCHAR(100),
    asignatura VARCHAR(100)
);

CREATE TABLE Tipo_Atraso (
    id_atraso SERIAL PRIMARY KEY,
    nombre_atraso VARCHAR(20)
);

CREATE TABLE Preuniversitario (
    id_preu SERIAL PRIMARY KEY,
    nombre_preu VARCHAR(100),
    entidad VARCHAR(100)
);

CREATE TABLE Apoderado (
    id_apoderado SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100),
    correo_electronico VARCHAR(100),
    fecha_nacimiento DATE,
    direccion_completa VARCHAR(100)
);


-- ==========================================
-- 2. TABLAS DE NIVEL 2 (Dependen de Nivel 1)
-- ==========================================

CREATE TABLE Curso (
    id_curso SERIAL PRIMARY KEY,
    numero INT, 
    letra VARCHAR(5), 
    id_profesor INT UNIQUE, 
    CONSTRAINT fk_curso_profesor 
        FOREIGN KEY (id_profesor) REFERENCES Profesor(id_profesor)
);

CREATE TABLE Alumno (
    id_alumno SERIAL PRIMARY KEY, 
    id_apoderado INT NOT NULL,     
    nombre_completo VARCHAR(100),
    fecha_nacimiento DATE,
    edad INT,
    etnia VARCHAR(100),
    direccion_completa VARCHAR(100),
    correo_electronico VARCHAR(100),
    curso_anterior INT NOT NULL,
    curso_actual INT NOT NULL, 
    CONSTRAINT fk_alumno_apoderado 
        FOREIGN KEY (id_apoderado) REFERENCES Apoderado(id_apoderado),
    CONSTRAINT fk_alumno_curso_actual 
        FOREIGN KEY (curso_actual) REFERENCES Curso(id_curso),
    CONSTRAINT fk_alumno_curso_anterior
        FOREIGN KEY (curso_anterior) REFERENCES Curso(id_curso)
);


-- ==========================================
-- 3. TABLAS DE NIVEL 3 (Dependen de Curso/Alumno)
-- ==========================================

CREATE TABLE Reunion_Apoderados (
    id_reunion SERIAL PRIMARY KEY,
    id_curso INT NOT NULL, 
    fecha DATE,
    hora TIME,
    CONSTRAINT fk_reunion_curso 
        FOREIGN KEY (id_curso) REFERENCES Curso(id_curso)
);

CREATE TABLE Ficha_General_Alumno (
    id_ficha SERIAL PRIMARY KEY,
    id_funcionario INT NOT NULL,
    id_alumno INT UNIQUE NOT NULL, 
    antecedentes_socioeconomicos TEXT,
    antecedente_emocional TEXT,
    antecedente_salud TEXT,
    fecha_ultima_actualizacion DATE,
    estado_acuse_profesor VARCHAR(50),
    fecha_acuse_recibo DATE,
    CONSTRAINT fk_fga_funcionario 
        FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario),
    CONSTRAINT fk_fga_alumno 
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

CREATE TABLE Ficha_Psicopedagogico (
    id_expediente SERIAL PRIMARY KEY,
    id_funcionario INT NOT NULL,
    id_alumno INT UNIQUE NOT NULL, 
    necesidad_evaluativa VARCHAR(100),
    evaluacion_diferenciada VARCHAR(50),
    tipo_nee VARCHAR(100),
    estado_plan VARCHAR(50),
    fecha_ingreso DATE,
    CONSTRAINT fk_fp_funcionario 
        FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario),
    CONSTRAINT fk_fp_alumno 
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

CREATE TABLE Registro_Convivencia (
    id_registro SERIAL PRIMARY KEY,
    id_funcionario INT NOT NULL,
    id_alumno INT NOT NULL,
    fecha DATE,
    curso_pre_accidente VARCHAR(50),
    situacion TEXT,
    observacion_textual TEXT,
    CONSTRAINT fk_rc_funcionario 
        FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario),
    CONSTRAINT fk_rc_alumno 
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

CREATE TABLE LicenciaMedica (
    id_licencia SERIAL PRIMARY KEY,
    id_alumno INT NOT NULL,
    diagnostico VARCHAR(255),
    dias_reposo INT,
    fecha_inicio DATE,      
    eximido_fisico BOOLEAN,  
    CONSTRAINT fk_lm_alumno 
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

CREATE TABLE Retiro (
    id_retiro SERIAL PRIMARY KEY,
    id_curso INT NOT NULL,
    id_alumno INT NOT NULL,
    tipo VARCHAR(50), 
    fecha DATE,    
    hora TIME,       
    motivo TEXT,       
    CONSTRAINT fk_retiro_curso 
        FOREIGN KEY (id_curso) REFERENCES Curso(id_curso),
    CONSTRAINT fk_retiro_alumno 
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

CREATE TABLE Atraso (
    fecha DATE NOT NULL,
    id_alumno INT NOT NULL, 
    id_atraso INT NOT NULL, 
    hora_llegada TIME NOT NULL,
    PRIMARY KEY (fecha, id_alumno),
    CONSTRAINT fk_atraso_alumno 
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno),
    CONSTRAINT fk_atraso_tipo 
        FOREIGN KEY (id_atraso) REFERENCES Tipo_Atraso(id_atraso)
);


-- ==========================================
-- 4. TABLAS DE NIVEL 4 (Tablas intermedias)
-- ==========================================

CREATE TABLE Asistencia_Preuniversitario (
    id_alumno INT NOT NULL,
    id_preu INT NOT NULL,
    PRIMARY KEY (id_alumno, id_preu),
    CONSTRAINT fk_apreu_alumno 
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno),
    CONSTRAINT fk_apreu_preu 
        FOREIGN KEY (id_preu) REFERENCES Preuniversitario(id_preu)
);

CREATE TABLE Registro_Preguntas (
    id_pregunta SERIAL PRIMARY KEY,
    id_reunion INT NOT NULL,
    pregunta TEXT, 
    respuesta TEXT,
    CONSTRAINT fk_rp_reunion 
        FOREIGN KEY (id_reunion) REFERENCES Reunion_Apoderados(id_reunion)
);

CREATE TABLE Asistencia_Reunion (
    id_curso INT NOT NULL,
    id_apoderado INT NOT NULL,
    id_reunion INT NOT NULL,
    PRIMARY KEY (id_curso, id_apoderado, id_reunion),
    CONSTRAINT fk_areu_curso 
        FOREIGN KEY (id_curso) REFERENCES Curso(id_curso),
    CONSTRAINT fk_areu_apoderado 
        FOREIGN KEY (id_apoderado) REFERENCES Apoderado(id_apoderado),
    CONSTRAINT fk_areu_reunion 
        FOREIGN KEY (id_reunion) REFERENCES Reunion_Apoderados(id_reunion)
);













-- ==========================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- ==========================================

-- ==========================================
-- 1. TABLAS INDEPENDIENTES
-- ==========================================

INSERT INTO Funcionario (id_funcionario, nombre_completo, correo_institucional, cargo) VALUES
(1, 'Patricia Cubillos', 'pcubillos@colegio.cl', 'Orientacion'),
(2, 'Ana Maria', 'amaria@colegio.cl', 'Salud'),
(3, 'Inspector Max', 'max@colegio.cl', 'Inspectoria'),
(4, 'Genoveva', 'genoveva@colegio.cl', 'Convivencia'),
(5, 'Maria Jose', 'mariajose@colegio.cl', 'Area CH y TP'),
(6, 'Muriel', 'muriel@colegio.cl', 'Area CH y TP');

INSERT INTO Profesor (id_profesor, nombre_completo, correo_institucional, asignatura) VALUES
(1, 'Mauricio Olivares', 'molivares@colegio.cl', 'Informatica y Sociedad'),
(2, 'Camila Rojas', 'crojas@colegio.cl', 'Lenguaje'),
(3, 'Diego Silva', 'dsilva@colegio.cl', 'Matematicas'),
(4, 'Fernanda Soto', 'fsoto@colegio.cl', 'Ciencias');

INSERT INTO Tipo_Atraso (id_atraso, nombre_atraso) VALUES
(1, 'Leve'),
(2, 'Mayor'),
(3, 'Grave');

INSERT INTO Preuniversitario (id_preu, nombre_preu, entidad) VALUES
(1, 'Preuniversitario Solidario USM', 'Universitaria'),
(2, 'Pedro de Valdivia', 'Privada'),
(3, 'Cpech', 'Privada');

INSERT INTO Apoderado (id_apoderado, nombre_completo, correo_electronico, fecha_nacimiento, direccion_completa) VALUES
(1, 'Marta Díaz', 'marta.diaz@gmail.com', '1980-05-14', 'San Pablo 123, Pudahuel'),
(2, 'Roberto Muñoz', 'roberto.m@hotmail.com', '1975-10-22', 'Teniente Cruz 456, Pudahuel'),
(3, 'Carmen Gloria', 'cgloria@gmail.com', '1982-03-09', 'La Estrella 789, Pudahuel');

-- ==========================================
-- 2. TABLAS DE NIVEL 2
-- ==========================================

INSERT INTO Curso (id_curso, numero, letra, id_profesor) VALUES
(1, 1, 'A', 1),
(2, 2, 'B', 2),
(3, 3, 'A', 3),
(4, 4, 'A', 4);

INSERT INTO Alumno (id_alumno, id_apoderado, nombre_completo, fecha_nacimiento, edad, etnia, direccion_completa, correo_electronico, curso_anterior, curso_actual) VALUES
(1, 1, 'Javier Muñoz Díaz', '2008-04-12', 15, 'Ninguna', 'San Pablo 123, Pudahuel', 'javier.m@alumno.cl', 1, 3),
(2, 2, 'Sofia Muñoz', '2009-08-20', 14, 'Ninguna', 'Teniente Cruz 456, Pudahuel', 'sofia.m@alumno.cl', 1, 2),
(3, 3, 'Felipe Castro Gloria', '2010-02-15', 13, 'Mapuche', 'La Estrella 789, Pudahuel', 'felipe.c@alumno.cl', 1, 1),
(4, 1, 'Valentina Muñoz Díaz', '2006-11-05', 17, 'Ninguna', 'San Pablo 123, Pudahuel', 'valentina.m@alumno.cl', 3, 4);

-- ==========================================
-- 3. TABLAS DE NIVEL 3
-- ==========================================

INSERT INTO Reunion_Apoderados (id_reunion, id_curso, fecha, hora) VALUES
(1, 1, '2026-04-15', '18:00:00'),
(2, 3, '2026-04-16', '18:30:00'),
(3, 4, '2026-04-17', '19:00:00');

INSERT INTO Ficha_General_Alumno (id_ficha, id_funcionario, id_alumno, antecedentes_socioeconomicos, antecedente_emocional, antecedente_salud, fecha_ultima_actualizacion, estado_acuse_profesor, fecha_acuse_recibo) VALUES
(1, 4, 1, 'Quintil 3', 'Sin observaciones', 'Asma leve', '2026-03-01', 'Recibido', '2026-03-05'),
(2, 4, 2, 'Quintil 2', 'Ansiedad', 'Sano', '2026-03-01', 'Pendiente', NULL),
(3, 4, 3, 'Quintil 1', 'Sin observaciones', 'Alergia estacional', '2026-03-02', 'Recibido', '2026-03-06');

INSERT INTO Ficha_Psicopedagogico (id_expediente, id_funcionario, id_alumno, necesidad_evaluativa, evaluacion_diferenciada, tipo_nee, estado_plan, fecha_ingreso) VALUES
(1, 5, 2, 'Déficit Atencional', 'Sí', 'Transitoria', 'En progreso', '2025-05-10'),
(2, 6, 3, 'Dificultad de Aprendizaje', 'Sí', 'Permanente', 'Dado de alta', '2024-04-12');

INSERT INTO Registro_Convivencia (id_registro, id_funcionario, id_alumno, fecha, curso_pre_accidente, situacion, observacion_textual) VALUES
(1, 4, 1, '2026-04-10', '3A', 'Pelea en recreo', 'El alumno empujó a un compañero durante el recreo. Se conversó con él.'),
(2, 4, 2, '2026-05-15', '2B', 'Falta de respeto', 'Interrupción constante en clases.');

INSERT INTO LicenciaMedica (id_licencia, id_alumno, diagnostico, dias_reposo, fecha_inicio, eximido_fisico) VALUES
(1, 1, 'Bronquitis obstructiva', 5, '2026-05-01', FALSE),
(2, 4, 'Esguince de tobillo', 15, '2026-06-15', TRUE);

INSERT INTO Retiro (id_retiro, id_curso, id_alumno, tipo, fecha, hora, motivo) VALUES
(1, 3, 1, 'Eventual', '2026-04-20', '11:00:00', 'Cita médica'),
(2, 4, 4, 'Permanente', '2026-08-01', '09:00:00', 'Cambio de ciudad y colegio');

INSERT INTO Atraso (fecha, id_alumno, id_atraso, hora_llegada) VALUES
('2026-04-10', 1, 1, '08:05:00'),
('2026-04-11', 1, 2, '08:15:00'),
('2026-05-02', 2, 3, '10:05:00'),
('2026-05-05', 3, 1, '08:02:00');

-- ==========================================
-- 4. TABLAS DE NIVEL 4
-- ==========================================

INSERT INTO Asistencia_Preuniversitario (id_alumno, id_preu) VALUES
(4, 1),
(1, 2),
(2, 3);

INSERT INTO Registro_Preguntas (id_pregunta, id_reunion, pregunta, respuesta) VALUES
(1, 1, '¿Cuándo son las pruebas de síntesis?', 'La primera semana de julio.'),
(2, 2, '¿Hay talleres extracurriculares este semestre?', 'Sí, comienzan en mayo.'),
(3, 3, '¿Cómo funciona la eximición de educación física?', 'Con certificado médico validado en inspectoría.');

INSERT INTO Asistencia_Reunion (id_curso, id_apoderado, id_reunion) VALUES
(1, 3, 1),
(3, 1, 2),
(4, 1, 3);

-- Fin del script