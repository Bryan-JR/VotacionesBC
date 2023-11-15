import { DAO } from "./DAO.js";
import { db, email } from '../conection/db.js';

const getAll = (data, callback) => {
    const query = DAO.all(data.tabla);
    db.query(query, callback);
};

const getId = (id, data, callback) => {
    const query = DAO.forId(id, data);
    db.query(query, callback);
};

const setData = (data, callback) =>{
    const query = DAO.into(data);
    db.query(query, callback);         
};

const setUpdate = (id, data, callback) => {
    const query = DAO.update(id, data);
    db.query(query, callback);
};

const getRemove = (id, data, callback) =>{
    const query = DAO.remove(id, data);
    db.query(query, callback);
};

const getDosTablas = (tb1, tb2, callback) => {
    const query = DAO.dosTablas(tb1, tb2);
    db.query(query, callback);
};

const candidatos = (idCon, ident, callback) => {
    const query = DAO.candidatos(idCon, ident);
    db.query(query, callback);
};

const candidatosByE = (id, callback) => {
    const query = DAO.candidatosByE(id);
    db.query(query, callback);
};

const sendEmail = (destino, asunto, msg) => {
    email.sendMail({
        from: 'bjimenezruiz53@correo.unicordoba.edu.co',
        to: destino,
        subject: asunto,
        html: msg
    }, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Çorreo Enviado: '+ info.response);
    })
};
 
export const Model = {
    all: getAll,
    forId: getId,
    into: setData,
    update: setUpdate,
    remove: getRemove,
    dosTablas: getDosTablas,
    getCandidatos: candidatos,
    getCanByE: candidatosByE,
    sendEmail: sendEmail
}