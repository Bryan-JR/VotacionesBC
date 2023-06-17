import { DAO } from "./DAO.js";
import { db } from '../conection/db.js';

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
}

export const Model = {
    all: getAll,
    forId: getId,
    into: setData,
    update: setUpdate,
    remove: getRemove
}