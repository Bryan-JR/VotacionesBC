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

const getLogin = async (req, res) => {
    const id = req.body.id;
    const pass = req.body.pass;
    data.tabla = "usuario";
    data.keyId = "identificacion";
    Model.forId(id, data, (err, resp) => {
        if(err){
            res.send(err);
        } else {
            if(resp.length==0){//Comprueba que el usuario existe
                res.send("noExiste");
            } else {
                if(resp[0].contraseña===pass){ //Se comparan las contraseñas para ver si concuerdan
                    //Se comprueba si es administrador quien intenta iniciar sesión
                    data.tabla = "administrador";
                    Model.forId(id, data, (error, respu) => { //Respuesta de la tabla administrador
                        if(error){
                            res.send(error);
                        } else {
                            if(respu.length==0){
                                res.send('inicio');
                            } else {
                                res.send('admin');
                            }
                        }
                    });
                } else {
                    res.send("incorrecta");
                }
            }
            
        }
    });
};

export const Controllers = {
    all: getAll,
    forId: getId,
    into: setData,
    update: setUpdate,
    remove: getRemove,
    saveCenso: upCenso,
    login: getLogin
}