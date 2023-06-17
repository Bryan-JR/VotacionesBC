import { Model } from "../models/usuarioModel.js";

const data = {
    tabla: "",
    keyId: "",
    keys: [],
    values: []
};

const getAll = async (req, res) => {
    data.tabla = req.params.tabla;
    Model.all(data, (err, resp) => {
        if(err){
            res.send("Error: "+err);
        } else {
            res.send(resp);
        }
    });
};

//falta especificar
const getId = (id) => {
    const query = DAO.forId(id, data.keyId);
    db.query(query, callback);
};

const setData = (data) =>{
    const query = DAO.into(data);
    db.query(query, callback);         
};

const setUpdate = (id, data) => {
    const query = DAO.update(id, data);
    db.query(query, callback);
};

const getRemove = (id, data) =>{
    const query = DAO.remove(id, data);
    db.query(query, callback);
}

export const Controllers = {
    all: getAll,
    forId: getId,
    into: setData,
    update: setUpdate,
    remove: getRemove
}