const express = require('express');
const joi     = require('joi');
const ruta    = express.Router();

const usuario = require('../modelos/usuarios.js');

// Todos los usuarios
ruta.get('/',(req,res) =>{
    res.status(200).send(usuario.usuarios);     
});


// un usuario en particular
ruta.get('/:id', (req,res)=>{
    //res.send(req.params.id);    
    //res.send(req.query);
    let usu = usuario.usuarios.find((u) => u.id === parseInt(req.params.id));
    if(!usu) res.status(404).send('El ID no existe');
    res.status(200).send(usu);
});

// Crear usuario
ruta.post('/',(req,res) =>{

    const schema = joi.object({
        nombre: joi.string()            
            .min(3)
            .max(30)
            .required(),            

        edad: joi.number()
            .integer()
            .required()
            
    });

    const {error,value} = schema.validate({ nombre: req.body.nombre, edad: req.body.edad });
   if(!error){
        let usuarioNuevo = {
            id: usuario.usuarios.length + 1,
            nombre: value.nombre,
            edad: value.edad
        }
        usuario.usuarios.push(usuarioNuevo);

        //console.log(usuario.usuarios);
    
        res.send(usuario.usuarios);
    }else{
        //console.log(error);
        res.status(400).send(error.details[0].message);
    }

});

// Modificar usuario por ID
ruta.put('/:id', (req,res)=>{
    let usu = usuario.usuarios.find((u) => u.id === parseInt(req.params.id));
    if(!usu) res.status(404).send('El ID no existe');

    const schema = joi.object({
        nombre: joi.string()            
            .min(3)
            .max(30)
            .required()         
    });

    const {error,value} = schema.validate({ nombre: req.body.nombre });
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    usu.nombre = value.nombre;
    res.send(usu);

});

// Eliminar usuario por ID
ruta.delete('/:id', (req,res) =>{
    let usu = usuario.usuarios.find((u) => u.id === parseInt(req.params.id));
    if(!usu) res.status(404).send('El ID no existe');

    const index = usuario.usuarios.indexOf(usu);
//    console.log(index);
    usuario.usuarios.splice(index, 1);
    res.send(usu);
});

module.exports = ruta;

