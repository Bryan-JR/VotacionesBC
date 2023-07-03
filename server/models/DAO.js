function clear(txt){
    return typeof txt === "string" ? txt.replace(/['"\\(){},;?¡¿!|\/`]/g, '') : txt;
}

const getAll = (tabla) => {
    return 'SELECT * FROM '+clear(tabla);
};

const getId = (id, data) => {
    return `SELECT * FROM ${clear(data.tabla)} WHERE ${clear(data.keyId)} = ${id}`;
};

const setData = (data) =>{
    return (data.tabla=="usuario" || data.tabla=="estudiante") ? 
    `INSERT INTO ${clear(data.tabla)} (${data.keys.map(key => `\`${clear(key)}\``).join(', ')}) VALUES ${data.values.map(row => Object.values(row).map((value, i) => typeof value === 'string' ? `'${clear(value)}'` 
     : 
     `${i == ''  ? '(' : '' }${clear(value)}`).join(', ') ).join('), ')})`
     : `INSERT INTO ${clear(data.tabla)} (${data.keys.map(key => `\`${clear(key)}\``).join(', ')}) VALUES (${Object.values(data.values).map(value => typeof value === 'string' ? `'${clear(value)}'` : clear(value)).join(', ')})`;        
    };

const setUpdate = (id, data) => {
    const values = Object.values(data.values);
    data.keys.splice(0,1);
    values.splice(0,1);
    return `UPDATE ${clear(data.tabla)} SET ${data.keys.map((key, index) => `\`${clear(key)}\` = ${typeof values[index] === 'string' ? `'${clear(values[index])}'` : clear(values[index])}`).join(', ')} WHERE ${clear(data.keyId)} = ${id}`;
};

const getRemove = (id, data) =>{
    return `DELETE FROM ${clear(data.tabla)} WHERE ${clear(data.keyId)} = ${id}`;
};

const getNatural = (tb1, tb2)=>{
    return 'SELECT * FROM '+clear(tb1)+' tb1 NATURAL JOIN '+clear(tb2)+' tb2';
};

const getCandidatos = (idCon, ident) => {
    return `SELECT * FROM (SELECT * FROM (SELECT * FROM Candidato WHERE idConvocatoria = ${idCon})al1 INNER JOIN estudiante WHERE identificacion = ${ident == 1 ? 'al1.idEstudiante1' : 'al1.idEstudiante2'})al2 NATURAL JOIN usuario;`
}

const getCandidatoByEleccion = (id) => {
    return `CALL getCandidatosByEleccion(${id})`;
}


export const DAO = {
    all: getAll,
    forId: getId,
    into: setData,
    update: setUpdate,
    remove: getRemove,
    dosTablas: getNatural,
    candidatos: getCandidatos,
    candidatosByE: getCandidatoByEleccion,
}

