import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { Movie } from "../types/Movie";

const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "");
const databaseId = process.env.COSMOS_DATABASE_ID || "catalogoDB";
const containerId = process.env.COSMOS_CONTAINER_ID || "movies";

export async function fnFindAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

        context.log('Buscando todos os filmes');

        // Conecta ao Cosmos DB
        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        // Busca todos os itens
        const querySpec = {
            query: "SELECT * FROM c"
        };

        const { resources: movies } = await container.items
            .query<Movie>(querySpec)
            .fetchAll();

        context.log(`Encontrados ${movies.length} filmes`);

        return {
            status: 200,
            body: JSON.stringify({ 
                count: movies.length,
                movies: movies
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (error) {
        context.error('Erro ao buscar filmes no banco de dados:', error);
        return {
            status: 500,
            body: JSON.stringify({ 
                error: 'Erro ao buscar filmes no banco de dados',
                details: error.message 
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}

app.http('fnFindAll', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'movies',
    handler: fnFindAll
});
