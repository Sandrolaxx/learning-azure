import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { v4 as uuidv4 } from "uuid";
import { Movie } from "../types/Movie";

const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "");
const databaseId = process.env.COSMOS_DATABASE_ID || "catalogoDB";
const containerId = process.env.COSMOS_CONTAINER_ID || "movies";

export async function fnPostDataBase(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // Verifica se o método é POST
        if (request.method !== 'POST') {
            return {
                status: 405,
                body: JSON.stringify({ 
                    error: 'Método não permitido. Use POST.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        // Obtém o corpo da requisição
        const body = await request.json() as Movie;

        // Validações
        if (!body.title || typeof body.title !== 'string') {
            return {
                status: 400,
                body: JSON.stringify({ 
                    error: 'Campo "title" é obrigatório e deve ser uma string.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        if (!body.year || typeof body.year !== 'number') {
            return {
                status: 400,
                body: JSON.stringify({ 
                    error: 'Campo "year" é obrigatório e deve ser um número.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        if (!body.videoUrl || typeof body.videoUrl !== 'string') {
            return {
                status: 400,
                body: JSON.stringify({ 
                    error: 'Campo "videoUrl" é obrigatório e deve ser uma string.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        if (!body.thumb || typeof body.thumb !== 'string') {
            return {
                status: 400,
                body: JSON.stringify({ 
                    error: 'Campo "thumb" é obrigatório e deve ser uma string.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        // Gera um UUID para o ID
        const movie: Movie = {
            id: uuidv4(),
            title: body.title,
            year: body.year,
            videoUrl: body.videoUrl,
            thumb: body.thumb
        };

        context.log(`Salvando filme: ${movie.title} (${movie.year}) - ID: ${movie.id}`);

        // Conecta ao Cosmos DB
        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        // Salva o filme no Cosmos DB
        const { resource: createdMovie } = await container.items.create(movie);

        return {
            status: 201,
            body: JSON.stringify({ 
                message: 'Filme salvo com sucesso',
                movie: createdMovie
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (error) {
        context.error('Erro ao salvar filme no banco de dados:', error);
        return {
            status: 500,
            body: JSON.stringify({ 
                error: 'Erro ao salvar filme no banco de dados',
                details: error.message 
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}

app.http('fnPostDataBase', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: fnPostDataBase
});
