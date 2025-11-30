# Azure Service Bus Lab - Envio de Mensagens

Este projeto demonstra como enviar mensagens para o Azure Service Bus usando Node.js.

## 📋 Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- Uma conta Azure com Service Bus criado
- Connection string do Service Bus
- Uma fila (queue) criada no Service Bus

## 🚀 Como usar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
SERVICE_BUS_CONNECTION_STRING=Endpoint=sb://seu-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=sua-chave
QUEUE_NAME=myqueue
```

### 3. Executar o script

```bash
npm start
```

ou

```bash
node send-message.js
```

## 📦 O que o script faz

1. **Envia uma mensagem individual** com:
   - Nome
   - Timestamp
   - Dados customizados
   - Message ID único

2. **Envia um lote de 5 mensagens** para demonstrar envio em massa

## 🔑 Como obter a Connection String

1. Acesse o Portal do Azure
2. Navegue até seu Service Bus Namespace
3. Vá em **Shared access policies**
4. Selecione **RootManageSharedAccessKey** (ou crie uma nova policy)
5. Copie a **Primary Connection String**

## 📚 Recursos

- [Documentação Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/)
- [SDK do Azure Service Bus para Node.js](https://www.npmjs.com/package/@azure/service-bus)

## 🛠️ Próximos passos

- Criar um script para **receber mensagens** da fila
- Implementar **dead letter queue** handling
- Adicionar **retry policies**
- Trabalhar com **topics e subscriptions**

---

## Passos realizados no Lab

Criação do resource group:
```
az group create --name az204-service-bus --location eastus
```

Criação do servicebus:
```
az servicebus namespace create --resource-group az204-service-bus --name service-bus-sandrolaxx --location eastus
```

Criação da Queue
```
az servicebus queue create --resource-group az204-service-bus --namespace-name service-bus-sandrolaxx --name az204-queue
```

Encontrando connetion string do ServiceBus:

![ConnectionString](https://github.com/user-attachments/assets/4aa63d1c-9c96-4211-a500-c846f6b9b43e)

Após executar a função do script JS temos o seguinte resultado:

![Mensagens no service bus pós execução do script](https://github.com/user-attachments/assets/eb6a6ad8-0174-4ae4-b65b-05f92cfcc5ff)

Executado bloco do código que consome as mensagens no barramento:

![Mensagens consumidas e barramento](https://github.com/user-attachments/assets/4a3084a1-aa65-4a37-aa4e-1b76ad3c7d32)

Excluindo recursos:
```
az group delete --name az204-service-bus --no-wait
```