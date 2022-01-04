const debug = require('debug')('app:inicio');
const usuario = require('./modelos/usuarios');
const express = require('express');
const app     = express();
const joi     = require('joi');
const morgan  = require('morgan');
const config  = require('config');

//const loging  = require('./middleware/logger.js')

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Configuración de enternos
console.log('Aplicación ' + config.get('nombre'));
console.log('Base de datos Server ' + config.get('configDB.host'));

// Middleware de terceros
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan habilitado...');
    //console.log('Morgan habilitado...') 
}

// Trabajos con la BD
debug('Trabajando con la BD...');

//app.use(loging.logger);

/*app.use((req,res,next)=>{
    console.log('Autenticando...');
    next();
});*/


// Peticiones HTTP
app.get('/',(req,res) =>{
    res.status(200).send('GET en express...')
});

app.get('/api/usuarios',(req,res) =>{
    res.status(200).send(usuario.usuarios);     
});

app.get('/api/usuarios/:id', (req,res)=>{
    //res.send(req.params.id);    
    //res.send(req.query);
    let usu = usuario.usuarios.find((u) => u.id === parseInt(req.params.id));
    if(!usu) res.status(404).send('El ID no existe');
    res.status(200).send(usu);
});

app.post('/api/usuarios',(req,res) =>{

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

app.put('/api/usuarios/:id', (req,res)=>{
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

app.delete('/api/usuarios/:id', (req,res) =>{
    let usu = usuario.usuarios.find((u) => u.id === parseInt(req.params.id));
    if(!usu) res.status(404).send('El ID no existe');

    const index = usuario.usuarios.indexOf(usu);
//    console.log(index);
    usuario.usuarios.splice(index, 1);
    res.send(usu);
})

const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`Escuchando en el puerto ${port}`);
})

//app.post();
//app.put();
//app.delete();