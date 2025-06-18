import { configDotenv } from "dotenv";
import { Client } from "pg";

configDotenv();

export async function connectToDb(): Promise<Client> {
    try {
        const client = new Client({
            connectionString: process.env.AZURE_PG_CONNECTION_STRING,
        });

        await client.connect();

        console.log('Conectado ao banco de dados PostgreSQL com connection string!');
        
        return client;
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados', err);
    }
}