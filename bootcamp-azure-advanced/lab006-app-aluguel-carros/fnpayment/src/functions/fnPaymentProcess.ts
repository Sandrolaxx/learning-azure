import { Container, CosmosClient } from "@azure/cosmos";
import { app, InvocationContext } from "@azure/functions";
import { Payment } from "../model/Payment";
import { EnumPaymentStatus, IPaymentRent } from "../utils/types";
import { ServiceBusClient } from "@azure/service-bus";

const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STR);
const database = cosmosClient.database(process.env.COSMOS_DB);
const container: Container = database.container(process.env.COSMOS_CONTAINER);

export async function fnPaymentProcess(message: IPaymentRent, context: InvocationContext): Promise<void> {
    context.log('PAYMENT - Service bus queue function processed message:', message);
    let paymentRecord: Payment;

    try {
        paymentRecord = new Payment(message);

        const { resource: createdItem } = await container.items.upsert(paymentRecord);

        context.log(`Pagamento salvo/atualizado com sucesso! ID do item: ${createdItem.id}`);
    } catch (error) {
        context.error(`Ocorreu um erro ao processar o pagamento: ${error.message}`, error);
        
        throw error;
    }
    
    if (paymentRecord && paymentRecord.status == EnumPaymentStatus[0]) {
        try {
            await sendMessageNotification(paymentRecord);

            context.log("Mensagem aprovação enviada com suceso!");
        } catch (error) {
            context.error(`Ocorreu um erro ao enviar mensagem notificação: ${error.message}`, error);
        }
    }

}

async function sendMessageNotification(message: Payment) {
    const sbClient = new ServiceBusClient(process.env.SB_CONNECTION_STR);
    const sender = sbClient.createSender(process.env.NOTIFICATION_QUEUE);
    const sbMesssage = {
        body: {
            data: message,
            message: "Pagamento Aprovado com sucesso!",
            type: "Notification"
        },
        contentType: "application/json",
        label: "notification-queue"
    }

    await sender.sendMessages(sbMesssage);
    await sender.close();
    await sbClient.close();
}

app.serviceBusQueue('fnPaymentProcess', {
    connection: 'SB_CONNECTION_STR',
    queueName: 'fila-pagamento',
    handler: fnPaymentProcess
});
