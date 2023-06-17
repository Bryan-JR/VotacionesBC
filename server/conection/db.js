import mysql from "mysql"
import dotenv from "dotenv"

dotenv.config({path: "../server/env/.env"});

console.log("Base de datos: "+process.env.DB_NAME);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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