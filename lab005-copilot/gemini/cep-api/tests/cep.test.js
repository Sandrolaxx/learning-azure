const request = require('supertest');
const app = require('../src/app'); // Adjust the path if necessary
const CepService = require('../src/services/cepService');

jest.mock('../src/services/cepService');

let server;

beforeAll((done) => {
    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        done();
    });
});

afterAll((done) => {
    server.close(done);
});

describe('CEP API', () => {
    describe('GET /v1/:cep', () => {
        it('should return 200 and the correct data for a valid CEP', async () => {
            const cep = '01001-000';
            const mockResponse = {
                cep: '01001-000',
                logradouro: 'Praça da Sé',
                complemento: 'lado ímpar',
                bairro: 'Sé',
                localidade: 'São Paulo',
                uf: 'SP',
                ibge: '3550308',
                gia: '1004',
                ddd: '11',
                siafi: '7087'
            };

            CepService.prototype.getCep.mockResolvedValue(mockResponse);

            const response = await request(server).get(`/api/v1/${cep}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('should return 400 for an invalid CEP format', async () => {
            const invalidCep = '12345';
            const response = await request(server).get(`/api/v1/${invalidCep}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid CEP format');
        });

        it('should return 404 if the CEP does not exist', async () => {
            const cep = '99999-999';
            CepService.prototype.getCep.mockRejectedValue({ status: 404, message: 'CEP not found' });

            const response = await request(server).get(`/api/v1/${cep}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'CEP not found');
        });

        it('should return 500 for server errors', async () => {
            const cep = '01001-000';
            CepService.prototype.getCep.mockRejectedValue({ status: 500, message: 'Server error' });

            const response = await request(server).get(`/api/v1/${cep}`);
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Server error');
        });
    });
});