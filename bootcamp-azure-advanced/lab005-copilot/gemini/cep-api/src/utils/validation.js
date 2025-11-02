function validateCep(cep) {
    const cepPattern = /^[0-9]{5}-?[0-9]{3}$/; // Matches format 12345-678 or 12345678
    return cepPattern.test(cep);
}

module.exports = validateCep;