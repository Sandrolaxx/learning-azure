require('dotenv').config();
const { ServiceBusClient } = require('@azure/service-bus');

// Configuração do Service Bus
const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME || 'myqueue';

async function sendMessage() {
    // Validar se a connection string está configurada
    if (!connectionString) {
        console.error('❌ Erro: SERVICE_BUS_CONNECTION_STRING não está configurada!');
        console.log('Configure a variável de ambiente no arquivo .env');
        process.exit(1);
    }

    // Criar o cliente do Service Bus
    const sbClient = new ServiceBusClient(connectionString);

    // Criar um sender para a fila
    const sender = sbClient.createSender(queueName);

    try {
        console.log(`📨 Enviando mensagens para a fila: ${queueName}`);

        // Enviar uma única mensagem
        const message = {
            body: {
                name: "Mensagem de Teste",
                timestamp: new Date().toISOString(),
                data: "Esta é uma mensagem enviada para o Azure Service Bus"
            },
            contentType: "application/json",
            label: "teste",
            messageId: `msg-${Date.now()}`
        };

        await sender.sendMessages(message);
        console.log('✅ Mensagem enviada com sucesso!');
        console.log('📋 Detalhes:', JSON.stringify(message.body, null, 2));

        // Enviar um lote de mensagens
        console.log('\n📦 Enviando lote de mensagens...');
        const messages = [];
        for (let i = 1; i <= 5; i++) {
            messages.push({
                body: {
                    id: i,
                    message: `Mensagem em lote ${i}`,
                    timestamp: new Date().toISOString()
                },
                contentType: "application/json",
                messageId: `batch-msg-${Date.now()}-${i}`
            });
        }

        await sender.sendMessages(messages);
        console.log(`✅ Lote de ${messages.length} mensagens enviado com sucesso!`);

    } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error.message);
        throw error;
    } finally {
        // Fechar as conexões
        await sender.close();
        await sbClient.close();
        console.log('\n🔒 Conexões fechadas.');
    }

}

async function processMessages() {
    // Validar se a connection string está configurada
    if (!connectionString) {
        console.error('❌ Erro: SERVICE_BUS_CONNECTION_STRING não está configurada!');
        console.log('Configure a variável de ambiente no arquivo .env');
        process.exit(1);
    }

    // Criar o cliente do Service Bus
    const sbClient = new ServiceBusClient(connectionString);
    const receiver = sbClient.createReceiver(queueName);

    try {
        console.log(`📥 Recebendo mensagens da fila: ${queueName}`);

        const messages = await receiver.receiveMessages(10, { maxWaitTimeInMs: 5000 });
        for (const message of messages) {
            console.log('📋 Mensagem recebida:', message.body);
            await receiver.completeMessage(message);
        }

        if (messages.length === 0) {
            console.log('ℹ️ Nenhuma mensagem disponível na fila.');
        }

    } catch (error) {
        console.error('❌ Erro ao processar mensagens:', error.message);
        throw error;
    } finally {
        // Fechar as conexões
        await receiver.close();
        await sbClient.close();
        console.log('\n🔒 Conexões fechadas.');
    }
}

// Comentar caso queira executar apenas o envio ou o recebimento
sendMessage()
    .then(() => {
        console.log('✅ Processo concluído com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });

processMessages()
    .then(() => {
        console.log('✅ Processo de recebimento concluído com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Erro fatal no recebimento:', error);
        process.exit(1);
    });