require('dotenv').config();
const { EventGridPublisherClient, AzureKeyCredential } = require("@azure/eventgrid");

// Configurações do Event Grid (obtidas das variáveis de ambiente)
const endpoint = process.env.EVENT_GRID_ENDPOINT;
const accessKey = process.env.EVENT_GRID_ACCESS_KEY;

async function publicarEventos() {
    try {
        // Validar configurações
        if (!endpoint || !accessKey) {
            throw new Error('EVENT_GRID_ENDPOINT e EVENT_GRID_ACCESS_KEY devem estar definidos no arquivo .env');
        }

        console.log('Conectando ao Event Grid...');
        console.log(`Endpoint: ${endpoint}`);
        
        // Criar o cliente do Event Grid
        const client = new EventGridPublisherClient(
            endpoint,
            "EventGrid",
            new AzureKeyCredential(accessKey)
        );

        // Criar eventos de exemplo
        const eventos = [
            {
                id: `evento-${Date.now()}-1`,
                subject: "usuario/cadastro",
                dataVersion: "1.0",
                eventType: "Usuario.Cadastrado",
                data: {
                    userId: "user123",
                    nome: "João Silva",
                    email: "joao@example.com",
                    timestamp: new Date().toISOString()
                },
                eventTime: new Date()
            },
            {
                id: `evento-${Date.now()}-2`,
                subject: "pedido/novo",
                dataVersion: "1.0",
                eventType: "Pedido.Criado",
                data: {
                    pedidoId: "PED-456",
                    valor: 150.50,
                    status: "Pendente",
                    timestamp: new Date().toISOString()
                },
                eventTime: new Date()
            },
            {
                id: `evento-${Date.now()}-3`,
                subject: "produto/estoque",
                dataVersion: "1.0",
                eventType: "Produto.EstoqueBaixo",
                data: {
                    produtoId: "PROD-789",
                    nome: "Notebook Dell",
                    quantidadeAtual: 5,
                    quantidadeMinima: 10,
                    timestamp: new Date().toISOString()
                },
                eventTime: new Date()
            }
        ];

        console.log('\n📤 Publicando eventos no Event Grid...');
        console.log(`Total de eventos: ${eventos.length}\n`);

        // Publicar os eventos
        await client.send(eventos);

        console.log('✅ Eventos publicados com sucesso!\n');
        
        // Exibir resumo dos eventos publicados
        eventos.forEach((evento, index) => {
            console.log(`Evento ${index + 1}:`);
            console.log(`  - ID: ${evento.id}`);
            console.log(`  - Tipo: ${evento.eventType}`);
            console.log(`  - Assunto: ${evento.subject}`);
            console.log(`  - Dados:`, JSON.stringify(evento.data, null, 2));
            console.log('');
        });

    } catch (error) {
        console.error('❌ Erro ao publicar eventos:', error.message);
        if (error.details) {
            console.error('Detalhes:', error.details);
        }
        process.exit(1);
    }
}

// Executar função principal
console.log('=== Lab Azure Event Grid ===\n');
publicarEventos();
