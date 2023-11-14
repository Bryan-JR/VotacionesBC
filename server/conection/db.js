import mysql from "mysql"
import dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config({path: "../server/env/.env"});

console.log("Base de datos: "+process.env.DB_NAME);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export const email = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

connection.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos: "+ err.message);
        return;
    } else {
        console.log("Conectado a la base de datos.");
    }
});

export const db = connection;