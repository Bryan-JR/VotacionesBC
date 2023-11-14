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
    data.keyId = data.tabla === "usuario" || data.tabla === "estudiante"  ? "identificacion" : `id${data.tabla}`;
    Model.forId(id, data, (err, resp) => {
        if(err){
            res.send(err);
        } else {
            res.send(resp);
        }
    });
};

const getNotificaciones = async (req, res) => {
    const id = req.params.id;
    data.tabla = req.params.tabla;
    const tipo = req.params.tipo;
    data.keyId = tipo === "emisor" ? "idEmisor" : "idReceptor";
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
    const body = await { ...req.body };
    const usuarios = { ...body.usuarios };
    const estudiantes = { ...body.estudiantes };

    if(usuarios.values===undefined||estudiantes.values===undefined) res.send("error");
    else {
        Model.into(usuarios, (err, resp)=>{
            if(err) console.error("error:" +err);
            else console.log("cargado");
        });
        Model.into(estudiantes, (err, resp) => {
            if(err) console.error("error:" +err);
            else res.send("cargado");
        });
    }
};

function generaSerie(){
    const chars = "1Q2W3E4R5T6Y7U8I9O0PAZSXDCFVGBHNJMKL".split('');
    let serie = ''
    for (let i = 0; i < 6; i++) {
        serie += chars[Math.floor(Math.random()*chars.length)];
    }
    return serie;
};

const getLogin = async (req, res) => {
    const id = req.body.id;
    data.tabla = "usuario";
    data.keyId = "identificacion";
    Model.forId(id, data, (err, resp) => {
        if(err){
            res.send(err);
        } else {
            if(resp.length==0){//Comprueba que el usuario existe
                res.send({type: "noExiste"});
            } else {
                //Se comprueba si es administrador quien intenta iniciar sesión
                data.tabla = "administrador";
                let nSerie = generaSerie();
                Model.forId(id, data, (error, respu) => { //Respuesta de la tabla administrador
                    if(error){
                        res.send(error);
                    } else {
                        Model.sendEmail(resp[0].correo, 'Prueba de envio de email', `Hola ${resp[0].nombre} ${resp[0].apellido1}, este es tu código de acceso: <strong>${nSerie}</strong>`);
                        if(respu.length==0){
                            res.send({type: 'inicio', correo: resp[0].correo, cod: nSerie});
                        } else {
                            res.send({type: 'admin', correo: resp[0].correo, cod: nSerie});
                        }
                        console.log(resp[0]);
                    }
                });
            }
            
        }
    });
};

const getDosTablas = async (req, res) => {
    const tb1 = req.params.tab1;
    const tb2 = req.params.tab2;
     Model.dosTablas(tb1, tb2, (err, resp) => {
        if(err){
            res.send("Error: "+err);
        } else {
            res.send(resp);
        }
    });

}

const getCandidatos = async (req, res) => {
    const idCon = req.params.idCon;
    const ident = req.params.ident;
    Model.getCandidatos(idCon, ident, (err, resp) => {
        if(err){
            res.send("Error: "+err);
        } else {
            res.send(resp);
        }
    });
}

const getCanByE = async (req, res) => {
    const id = req.params.id;
    Model.getCanByE(id, (err, resp) => {
        if(err){
            res.send("Error: "+err);
        } else {
            res.send(resp);
        }
    });
}

export const Controllers = {
    all: getAll,
    forId: getId,
    into: setData,
    update: setUpdate,
    remove: getRemove,
    saveCenso: upCenso,
    login: getLogin,
    dosTablas: getDosTablas,
    notificaciones: getNotificaciones,
    candidatos: getCandidatos,
    candidatosByE: getCanByE,
}