const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.AZURE_PG_CONNECTION_STRING,
});

async function connectToDb() {
  try {
    const connnection = await client.connect();
    console.log('Conectado ao banco de dados PostgreSQL com connection string!');
    return connnection;
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados', err);
  }
}