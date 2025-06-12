const validateCep = require('../utils/validation');

class CepController {
    constructor(cepService) {
        this.cepService = cepService;
        this.getCep = this.getCep.bind(this); // Bind the getCep method
    }

    async getCep(req, res) {
        const { cep } = req.params;

        if (!validateCep(cep)) {
            return res.status(400).json({ message: 'Invalid CEP format' });
        }

        try {
            const cepData = await this.cepService.getCep(cep);
            return res.status(200).json(cepData);
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message });
        }
    }
}

module.exports = CepController;