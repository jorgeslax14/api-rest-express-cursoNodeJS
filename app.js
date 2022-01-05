const debug = require('debug')('app:inicio');
const express = require('express');
const app     = express();

const morgan  = require('morgan');
const config  = require('config');

// Rutas usuarios
const usuarios = require('./routes/usuarios.js');

// Middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//  Metodos usuarios
app.use('/api/usuarios', usuarios);

// Configuración de entornos
console.log('Aplicación ' + config.get('nombre'));
console.log('Base de datos Server ' + config.get('configDB.host'));

// Middleware de terceros
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan habilitado...');
}


// Trabajos con la BD
debug('Trabajando con la BD...');

// Peticiones HTTP
app.get('/',(req,res) =>{
    res.status(200).send('GET en express...')
});


const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`Escuchando en el puerto ${port}`);
});