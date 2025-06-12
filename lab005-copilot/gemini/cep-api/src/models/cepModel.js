const mongoose = require('mongoose');

const cepSchema = new mongoose.Schema({
    cep: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{5}-?\d{3}$/.test(v);
            },
            message: props => `${props.value} is not a valid CEP!`
        }
    },
    logradouro: {
        type: String,
        required: true
    },
    complemento: {
        type: String,
        required: false
    },
    bairro: {
        type: String,
        required: true
    },
    localidade: {
        type: String,
        required: true
    },
    uf: {
        type: String,
        required: true
    },
    ibge: {
        type: String,
        required: true
    },
    gia: {
        type: String,
        required: false
    },
    ddd: {
        type: String,
        required: true
    },
    siafi: {
        type: String,
        required: true
    }
});

const CepModel = mongoose.model('Cep', cepSchema);

module.exports = CepModel;