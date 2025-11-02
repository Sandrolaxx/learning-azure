const express = require('express');
const CepController = require('../controllers/cepController');
const CepService = require('../services/cepService');

const setCepRoutes = (app) => {
    const router = express.Router();
    const cepController = new CepController(new CepService());

    router.get('/v1/:cep', cepController.getCep);

    app.use('/api', router);
};

module.exports = setCepRoutes;