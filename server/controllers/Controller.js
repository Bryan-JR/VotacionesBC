import { Model } from "../models/Model.js";

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

const getId = async (req, res) => {
    const id = req.params.id;
    data.tabla = req.params.tabla;
    data.keyId = data.tabla === "usuario" ? "identificacion" : `id${data.tabla}`;
    Model.forId(id, data, (err, resp) => {
        if(err){
            res.send(err);
        } else {
            res.send(resp);
        }
    });
};

const setData = async (req, res) =>{
    data.tabla = req.body.tabla;
    data.keys = req.body.keys;
    data.values = req.body.values;
    Model.into(data, (err, resp) => {
        if(err){
            res.send(err);
        } else {
            res.send(resp);
        }
    });        
};

const setUpdate = (req, res) => {
    const id = req.params.id;
    data.tabla = req.body.tabla;
    data.keys = req.body.keys;
    data.keyId = data.keys[0];
    data.values = req.body.values;
    Model.update(id, data, (err, resp) => {
        if(err){
            res.send(err);
        } else {
            res.send(resp);
        }
    }); 
};

const getRemove = async (req, res) =>{
    const id = req.params.id;
    data.tabla = req.params.tabla;
    data.keyId = data.tabla === "usuario" ? "identificacion" : `id${data.tabla}`;
    Model.remove(id, data, (err, resp) => {
        if(err){
            res.send(err);
        } else {
            res.send(resp);
        }
    });
};

const upCenso = async (req, res) => {
    const usuarios = req.body.usuarios;
    const estudiantes = req.body.estudiantes;
    Model.into(usuarios, (err, resp)=>{
        if(err) res.send(err);
        else Model.into(estudiantes, (err2, resp2) => {
            if(err2) res.send(err2);
            else res.send("Censo cargado.");
        });
    });
};

export const Controllers = {
    all: getAll,
    forId: getId,
    into: setData,
    update: setUpdate,
    remove: getRemove,
    saveCenso: upCenso
}