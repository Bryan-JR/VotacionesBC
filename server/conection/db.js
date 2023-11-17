// Importación de módulos necesarios
import mysql from "mysql";  // Importa el módulo de MySQL para la conexión a la base de datos
import dotenv from "dotenv";  // Importa el módulo dotenv para cargar variables de entorno desde un archivo .env
import nodemailer from "nodemailer";  // Importa el módulo nodemailer para enviar correos electrónicos

// Configuración de variables de entorno usando dotenv
dotenv.config({path: "../server/env/.env"});

// Imprime el nombre de la base de datos desde las variables de entorno
console.log("Base de datos: "+process.env.DB_NAME);

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Configuración del transporte de correo electrónico con nodemailer
export const email = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Conexión a la base de datos MySQL
connection.connect((err) => {
    if (err) {
        // Manejo de errores en caso de fallo en la conexión
        console.error("Error al conectar a la base de datos: "+ err.message);
        return;
    } else {
        // Mensaje de éxito cuando la conexión es exitosa
        console.log("Conectado a la base de datos.");
    }
});

// Exporta la conexión a la base de datos para su uso en otros módulos
export const db = connection;
