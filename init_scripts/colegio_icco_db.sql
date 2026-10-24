-- ==========================================
-- 1. TABLAS INDEPENDIENTES (Sin Claves Foráneas)
-- ==========================================

CREATE TABLE Usuario (
    rut VARCHAR(12) PRIMARY KEY,
    correo_institucional VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    cargo VARCHAR(30) NOT NULL
);

CREATE TABLE Funcionario (
    rut VARCHAR(12) PRIMARY KEY,
    nombre_completo VARCHAR(100)
);

CREATE TABLE Profesor (
    rut VARCHAR(12) PRIMARY KEY,
    nombre_completo VARCHAR(100)
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
    rut VARCHAR(12) PRIMARY KEY,
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
    rut_profesor VARCHAR(12), 
    CONSTRAINT fk_curso_profesor 
        FOREIGN KEY (rut_profesor) REFERENCES Profesor(rut)
);

CREATE TABLE Alumno (
    rut VARCHAR(12) PRIMARY KEY, 
    rut_apoderado VARCHAR(12) NOT NULL,    
    nombre_completo VARCHAR(100),
    fecha_nacimiento DATE,
    edad INT,
    etnia VARCHAR(100),
    direccion_completa VARCHAR(100),
    correo_electronico VARCHAR(100),
    curso_anterior INT NOT NULL,
    curso_actual INT NOT NULL, 
    CONSTRAINT fk_alumno_apoderado 
        FOREIGN KEY (rut_apoderado) REFERENCES Apoderado(rut),
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
    rut_funcionario VARCHAR(12) NOT NULL,
    rut_alumno VARCHAR(12) NOT NULL,
    antecedentes_socioeconomicos TEXT,
    antecedente_emocional TEXT,
    antecedente_salud TEXT,
    fecha_ultima_actualizacion DATE,
    estado_acuse_profesor VARCHAR(50),
    fecha_acuse_recibo DATE,
    CONSTRAINT fk_fga_funcionario 
        FOREIGN KEY (rut_funcionario) REFERENCES Funcionario(rut),
    CONSTRAINT fk_fga_alumno 
        FOREIGN KEY (rut_alumno) REFERENCES Alumno(rut)
);

CREATE TABLE Ficha_Psicopedagogico (
    id_expediente SERIAL PRIMARY KEY,
    rut_funcionario VARCHAR(12) NOT NULL,
    rut_alumno VARCHAR(12) NOT NULL,
    necesidad_evaluativa VARCHAR(100),
    evaluacion_diferenciada VARCHAR(50),
    tipo_nee VARCHAR(100),
    estado_plan VARCHAR(50),
    fecha_ingreso DATE,
    CONSTRAINT fk_fp_funcionario 
        FOREIGN KEY (rut_funcionario) REFERENCES Funcionario(rut),
    CONSTRAINT fk_fp_alumno 
        FOREIGN KEY (rut_alumno) REFERENCES Alumno(rut)
);

CREATE TABLE Registro_Convivencia (
    id_registro SERIAL PRIMARY KEY,
    rut_funcionario VARCHAR(12) NOT NULL,
    rut_alumno VARCHAR(12) NOT NULL,
    fecha DATE,
    curso_pre_accidente VARCHAR(50),
    situacion TEXT,
    observacion_textual TEXT,
    CONSTRAINT fk_rc_funcionario 
        FOREIGN KEY (rut_funcionario) REFERENCES Funcionario(rut),
    CONSTRAINT fk_rc_alumno 
        FOREIGN KEY (rut_alumno) REFERENCES Alumno(rut)
);

CREATE TABLE LicenciaMedica (
    id_licencia SERIAL PRIMARY KEY,
    rut_alumno VARCHAR(12) NOT NULL,
    diagnostico VARCHAR(255),
    dias_reposo INT,
    fecha_inicio DATE,      
    eximido_fisico BOOLEAN,  
    CONSTRAINT fk_lm_alumno 
        FOREIGN KEY (rut_alumno) REFERENCES Alumno(rut)
);

CREATE TABLE Retiro (
    id_retiro SERIAL PRIMARY KEY,
    id_curso INT NOT NULL,
    rut_alumno VARCHAR(12) NOT NULL,
    tipo VARCHAR(50), 
    fecha DATE,    
    hora TIME,       
    motivo TEXT,       
    CONSTRAINT fk_retiro_curso 
        FOREIGN KEY (id_curso) REFERENCES Curso(id_curso),
    CONSTRAINT fk_retiro_alumno 
        FOREIGN KEY (rut_alumno) REFERENCES Alumno(rut)
);

CREATE TABLE Atraso (
    fecha DATE NOT NULL,
    rut_alumno VARCHAR(12) NOT NULL, 
    id_atraso INT NOT NULL, 
    hora_llegada TIME NOT NULL,
    PRIMARY KEY (fecha, rut_alumno),
    CONSTRAINT fk_atraso_alumno 
        FOREIGN KEY (rut_alumno) REFERENCES Alumno(rut),
    CONSTRAINT fk_atraso_tipo 
        FOREIGN KEY (id_atraso) REFERENCES Tipo_Atraso(id_atraso)
);


-- ==========================================
-- 4. TABLAS DE NIVEL 4 (Tablas intermedias)
-- ==========================================

CREATE TABLE Asistencia_Preuniversitario (
    rut_alumno VARCHAR(12) NOT NULL,
    id_preu INT NOT NULL,
    PRIMARY KEY (rut_alumno, id_preu),
    CONSTRAINT fk_apreu_alumno 
        FOREIGN KEY (rut_alumno) REFERENCES Alumno(rut),
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
    rut_apoderado VARCHAR(12) NOT NULL,
    id_reunion INT NOT NULL,
    PRIMARY KEY (id_curso, rut_apoderado, id_reunion),
    CONSTRAINT fk_areu_curso 
        FOREIGN KEY (id_curso) REFERENCES Curso(id_curso),
    CONSTRAINT fk_areu_apoderado 
        FOREIGN KEY (rut_apoderado) REFERENCES Apoderado(rut),
    CONSTRAINT fk_areu_reunion 
        FOREIGN KEY (id_reunion) REFERENCES Reunion_Apoderados(id_reunion)
);