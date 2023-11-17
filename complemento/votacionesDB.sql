DROP DATABASE IF EXISTS Votaciones;
CREATE DATABASE Votaciones;
USE Votaciones;

CREATE TABLE Eleccion (
  idEleccion INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(100) NULL,
  descripcion VARCHAR(1000) NULL,
  fecha_ini DATE NULL,
  fecha_fin DATE NULL,
  PRIMARY KEY(idEleccion)
);


CREATE TABLE Usuario (
  identificacion INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NULL,
  apellido1 VARCHAR(100) NULL,
  apellido2 VARCHAR(100) NULL,
  tipo_documento VARCHAR(2) NULL,
  numero_celular VARCHAR(12) NULL,
  correo VARCHAR(200) NULL,
  billetera VARCHAR(200) NULL,
  PRIMARY KEY(identificacion)
);


CREATE TABLE Convocatoria (
  idConvocatoria INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(100) NULL,
  descripcion VARCHAR(2000) NULL,
  fecha_ini DATE NULL,
  fecha_fin DATE NULL,
  nCandidatos INTEGER UNSIGNED NULL,
  PRIMARY KEY(idConvocatoria)
);


CREATE TABLE Administrador (
  idAdministrador INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  identificacion INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(idAdministrador),
  INDEX Administrador_FKIndex1(identificacion),
  FOREIGN KEY(identificacion)
    REFERENCES Usuario(identificacion)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

CREATE TABLE Estudiante (
  idEstudiante INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  identificacion INTEGER UNSIGNED NOT NULL,
  facultad VARCHAR(100) NULL,
  programa VARCHAR(100) NULL,
  sem INTEGER UNSIGNED NULL,
  nota_pga NUMERIC NULL,
  codigopwc VARCHAR(12) NULL,
  creditos_planAc INTEGER UNSIGNED NULL,
  total_creditos_apro INTEGER UNSIGNED NULL,
  creditos_periodo INTEGER UNSIGNED NULL,
  creditos_apro_periodo INTEGER UNSIGNED NULL,
  sanciones INTEGER UNSIGNED NULL,
  PRIMARY KEY(idEstudiante),
  INDEX Estudiante_FKIndex1(identificacion),
  FOREIGN KEY(identificacion)
    REFERENCES Usuario(identificacion)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

CREATE TABLE Candidato (
  idCandidato INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  idEleccion INTEGER UNSIGNED NOT NULL,
  idConvocatoria INTEGER UNSIGNED NOT NULL,
  idEstudiante1 INTEGER UNSIGNED NOT NULL,
  idEstudiante2 INTEGER UNSIGNED NOT NULL,
  propuestas VARCHAR(2000) NULL,
  estado_seleccion VARCHAR(30) NULL,
  terminos BOOL NULL,
  PRIMARY KEY(idCandidato),
  INDEX Candidato_FKIndex1(idEstudiante1),
  INDEX Candidato_FKIndex2(idEstudiante2),
  INDEX Candidato_FKIndex3(idEleccion),
  INDEX Candidato_FKIndex4(idConvocatoria),
  FOREIGN KEY(idEstudiante1)
    REFERENCES Estudiante(identificacion)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY(idEstudiante2)
    REFERENCES Estudiante(identificacion)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY(idEleccion)
    REFERENCES Eleccion(idEleccion)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY(idConvocatoria)
    REFERENCES Convocatoria(idConvocatoria)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

CREATE TABLE Notificacion (
  idNotificacion INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  idEmisor INTEGER UNSIGNED NOT NULL,
  idReceptor INTEGER UNSIGNED NOT NULL,
  idConvocatoria INTEGER UNSIGNED NOT NULL,
  estado VARCHAR(30) NULL,
  leido BOOL NULL,
  hora TIME NULL,
  fecha DATE NULL,
  PRIMARY KEY(idNotificacion),
  INDEX Notificacion_FKIndex1(idReceptor),
  INDEX Notificacion_FKIndex2(idConvocatoria),
  INDEX Notificacion_FKIndex3(idEmisor),
  FOREIGN KEY(idReceptor)
    REFERENCES Usuario(identificacion)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY(idConvocatoria)
    REFERENCES Convocatoria(idConvocatoria)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY(idEmisor)
    REFERENCES Usuario(identificacion)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

CREATE TABLE Voto (
  idVoto INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  idEleccion INTEGER UNSIGNED NOT NULL,
  idCandidato INTEGER UNSIGNED NOT NULL,
  idEstudiante INTEGER UNSIGNED NOT NULL,
  fecha DATE NULL,
  hora TIME NULL,
  PRIMARY KEY(idVoto),
  INDEX Voto_FKIndex1(idEstudiante),
  INDEX Voto_FKIndex2(idEleccion),
  INDEX Voto_FKIndex3(idCandidato),
  FOREIGN KEY(idEstudiante)
    REFERENCES Estudiante(idEstudiante)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY(idEleccion)
    REFERENCES Eleccion(idEleccion)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY(idCandidato)
    REFERENCES Candidato(idCandidato)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

DELIMITER $
CREATE PROCEDURE getCandidatosByEleccion(id INTEGER)
BEGIN
	SELECT * FROM ((SELECT idCandidato, idEstudiante1, idEstudiante2, concat(nombre," ",apellido1," ",apellido2) as nombre1, programa as programa1  FROM (SELECT * FROM (SELECT * FROM Candidato WHERE idEleccion = 2)al1 INNER JOIN estudiante WHERE identificacion = al1.idEstudiante1)al2 NATURAL JOIN usuario)al3
	NATURAL JOIN (SELECT idCandidato, idEstudiante1, idEstudiante2, concat(nombre," ",apellido1," ",apellido2) as nombre2, programa as programa2  FROM (SELECT * FROM (SELECT * FROM Candidato WHERE idEleccion = 2)al1 INNER JOIN estudiante WHERE identificacion = al1.idEstudiante2)al2 NATURAL JOIN usuario)al4);
END $
DELIMITER ;

DELIMITER $
CREATE TRIGGER registraVotoBlanco
AFTER INSERT ON convocatoria
FOR EACH ROW
BEGIN
    -- Insertar una nueva fila en la tabla de postulaciones
    INSERT INTO Candidato(idEleccion, idConvocatoria, idEstudiante1, idEstudiante2, propuestas, estado_seleccion, terminos)
    VALUES (1, NEW.idConvocatoria, 100, 100, 'Es la elección por si no decide elegir uno de los representantes', 'Postulado', true);
END $
DELIMITER ;

INSERT INTO usuario VALUES (1001032253, "BRAYAN STEVEN", "JIMENEZ", "RUIZ", "CC", "324 569 3084", "brayanjiru14@gmail.com", "");
INSERT INTO administrador (identificacion) VALUES (1001032253);
INSERT INTO usuario VALUES (100, "VOTO", "EN", "BLANCO", "", "", "", "");
INSERT INTO estudiante(identificacion)  VALUES (100);
INSERT INTO Eleccion VALUES (1, "Postulantes", "Postulantes", NOW(), NOW());
INSERT INTO convocatoria (titulo, descripcion, fecha_ini, fecha_fin, nCandidatos)  VALUES ("CONVOCATORIA PARA REPRESENTANTE ESTUDIANTIL", "Para hacer parte de la convocatoria debe cumplir con los siguientes requisitos: - - - -", "2023-06-06", "2023-07-06", 20);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Qwe.123';