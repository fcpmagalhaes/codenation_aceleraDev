const express = require('express');
const CryptographyController = require('./controllers/CryptographyController');

const routes = express.Router();


routes.get('/cripto', CryptographyController.index);
routes.get('/decrypt', CryptographyController.decrypt);
// // ONGS ROUTES
// routes.post('/ongs', OngController.create);
// routes.get('/ongs', OngController.index);

// // INCIDENTS ROUTES
// routes.post('/incidents', IncidentController.create);
// routes.get('/incidents', IncidentController.index);
// routes.delete('/incidents/:id', IncidentController.delete);
// //LIST INCIDENTS OF ESPECIFIC ONG
// routes.get('/profile', ProfileController.index);


// routes.post('/sessions', SessionController.create);
module.exports = routes;
