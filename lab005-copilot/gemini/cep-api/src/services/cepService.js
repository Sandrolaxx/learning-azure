class CepService {
    constructor() {
        this.baseUrl = 'https://viacep.com.br/ws/';
    }

    async getCep(cep) {
        const response = await fetch(`${this.baseUrl}${cep}/json/`);
        if (!response.ok) {
            if (response.status === 400) {
                throw { status: 400, message: 'Invalid CEP format' };
            } else if (response.status === 404) {
                throw { status: 404, message: 'CEP not found' };
            } else {
                throw { status: 500, message: 'Error fetching data from ViaCEP API' };
            }
        }
        const data = await response.json();
        if (data.erro) {
            throw { status: 404, message: 'CEP not found' };
        }
        return data;
    }
}

module.exports = CepService;