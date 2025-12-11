import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { Movie } from "../types/Movie";

const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "");
const databaseId = process.env.COSMOS_DATABASE_ID || "catalogoDB";
const containerId = process.env.COSMOS_CONTAINER_ID || "movies";

export async function fnFindById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // Verifica se o método é GET
        if (request.method !== 'GET') {
            return {
                status: 405,
                body: JSON.stringify({ 
                    error: 'Método não permitido. Use GET.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        // Obtém o ID da query string ou rota
        const id = request.query.get('id') || request.params.id;

        // Valida se o ID foi fornecido
        if (!id) {
            return {
                status: 400,
                body: JSON.stringify({ 
                    error: 'Parâmetro "id" é obrigatório.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        context.log(`Buscando filme com ID: ${id}`);

        // Conecta ao Cosmos DB
        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        try {
            // Busca o item pelo ID
            const { resource: movie } = await container.item(id, id).read<Movie>();

            if (!movie) {
                return {
                    status: 404,
                    body: JSON.stringify({ 
                        error: 'Filme não encontrado.' 
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
            }

            return {
                status: 200,
                body: JSON.stringify({ 
                    movie: movie
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };

        } catch (error) {
            if (error.code === 404) {
                return {
                    status: 404,
                    body: JSON.stringify({ 
                        error: 'Filme não encontrado.' 
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
            }
            throw error;
        }

    } catch (error) {
        context.error('Erro ao buscar filme no banco de dados:', error);
        return {
            status: 500,
            body: JSON.stringify({ 
                error: 'Erro ao buscar filme no banco de dados',
                details: error.message 
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}

app.http('fnFindById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'movies/{id?}',
    handler: fnFindById
});
