//================================================
// Puerto
//================================================
process.env.PORT = process.env.PORT || 3000;

//================================================
// Entorno
//================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//================================================
// Expiracion de token
//================================================
//60 seg * 60 min * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//================================================
// Seed del token 
//================================================
process.env.SEED = process.env.SEED || 'Mi-semilla_de-desarrollo';

//================================================
// Base de datos
//================================================
let urlBD;

if (process.env.NODE_ENV === 'dev') {

    urlBD = 'mongodb://localhost:27017/cafe';

} else {

    urlBD = process.env.MONGO_URI;
}

process.env.URLDB = urlBD;

//================================================
// Google client ID
//================================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1052482652846-3i4294260m84i6cbi290a0q96ed5dnui.apps.googleusercontent.com';