import { app, InvocationContext } from "@azure/functions";
import { connectToDb } from "../dbConnection";
import { RentCar } from "../utils/types";
import { ServiceBusClient } from "@azure/service-bus";
import { generateRandomNumber } from "../utils/util";

export async function fnRentProcess(message: RentCar, context: InvocationContext): Promise<void> {
    context.log('Service bus queue function processed message (object):', message);

    if (!message) {
        context.error("Erro ao receber mensagem, mensagem nula ou vazia.");
        return;
    }

    if (message.data == null || message.name == null || message.email == null) {
        context.error("Erro ao relizar processamento da mensagem, dados rentcar inválidos");

        return;
    }

    let pgClient;

    try {
        pgClient = await connectToDb();
        const { name, email, vehicle, data } = message;
        const { model, year, rentalTime } = vehicle;

        const rentDate = new Date(data).toISOString().split('T')[0];

        const query = `
            INSERT INTO CAR_RENTAL (name, email, model, year, rental_time, rent_date)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [name, email, model, year, rentalTime, rentDate];

        await pgClient.query(query, values);

        context.log('Dados inseridos no banco de dados com sucesso!');

        await sendMessageToPay(message);
    } catch (error) {
        context.error(`Erro ao conectar ou inserir dados no banco de dados: ${error}`);
        //Msg é enviada para DQL após 2 tentativas - configurada na criação da fila
        return;
    } finally {
        if (pgClient) {
            await pgClient.end();
            context.log('Conexão com o banco de dados fechada.');
        }
    }
}

async function sendMessageToPay(message: RentCar) {
    const queueName = "fila-pagamento";

    const sbClient = new ServiceBusClient(process.env.SERVICE_BUS_CONNECTION_STRING);
    const sender = sbClient.createSender(queueName);
    const messageObject = {
        ...message,
        amount: generateRandomNumber(100, 5000)
    }
    const sbMesssage = {
        body: messageObject,
        contentType: "application/json",
        label: "rent-payment"
    }

    await sender.sendMessages(sbMesssage);
    await sender.close();
    await sbClient.close();
}

app.serviceBusQueue("fnRentProcess", {
    connection: "ServiceBus",
    queueName: "fila-locacao-auto",
    handler: fnRentProcess
});
