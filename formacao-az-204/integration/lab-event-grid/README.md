# Lab Azure Event Grid

Script simples em Node.js para publicar eventos no Azure Event Grid.

## Pré-requisitos

- Node.js instalado (v14 ou superior)
- Uma conta Azure com um Event Grid Topic criado
- Credenciais do Event Grid (endpoint e access key)

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Copie o arquivo de exemplo e configure suas credenciais:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` e preencha com suas credenciais do Azure:
   - `EVENT_GRID_ENDPOINT`: URL do seu Event Grid Topic
   - `EVENT_GRID_ACCESS_KEY`: Chave de acesso do Topic

## Como obter as credenciais no Azure

1. Acesse o Portal do Azure
2. Navegue até o seu Event Grid Topic
3. No menu lateral, clique em "Access keys"
4. Copie o "Topic Endpoint" e uma das "Keys"

## Execução

Execute o script:
```bash
npm start
```

ou

```bash
node index.js
```

## O que o script faz

O script publica 3 eventos de exemplo no Event Grid:

1. **Usuario.Cadastrado** - Evento de cadastro de usuário
2. **Pedido.Criado** - Evento de criação de pedido
3. **Produto.EstoqueBaixo** - Evento de alerta de estoque baixo

Cada evento contém:
- ID único
- Tipo de evento (eventType)
- Assunto (subject)
- Dados customizados (data)
- Timestamp

## Estrutura de um evento

```javascript
{
  id: "evento-timestamp-1",
  subject: "usuario/cadastro",
  dataVersion: "1.0",
  eventType: "Usuario.Cadastrado",
  data: {
    // Dados customizados do evento
  },
  eventTime: new Date()
}
```

## Personalizando eventos

Edite o array `eventos` no arquivo [index.js](index.js) para criar seus próprios eventos customizados.

---

## Doc do Lab realizado

Primeiro vamos criar o **Web App** que apresenta de maneira visual as mensagens do Event Grid.

![Criando Web App Pt.1](https://github.com/user-attachments/assets/4ea6056d-5078-4b53-9747-8e43d40daec3)

Configurando a imagem do container:
* Imagem: `microsoftlearning/azure-event-grid-viewer:latest`

![Criando Web App Pt.2](https://github.com/user-attachments/assets/ea656950-2ff7-4540-be57-8616640b2cbd)

Ao acessar o link da aplicação do Web App temos esse retorno, uma interface visual:

![Web App Rodando](https://github.com/user-attachments/assets/7f1c87bb-34be-430a-bc5a-62814fe20d00)

Após isso vamos criar um **Event Grid Topic**:

![Criando Event Grid](https://github.com/user-attachments/assets/a0b501c2-544a-41d4-8df6-d8b0b2620b68)

Confirma que ele está como Event Grid Schema

![Confirma o tipo](https://github.com/user-attachments/assets/b25a4fa9-d0a1-481d-a00c-00c6a2d9ce8e)

Criado o recurso, vamos criar um novo Event Subscription, ou seja alguém que será notificado quando novos eventos chegarem ao tópico.

![Criando Event Subscription](https://github.com/user-attachments/assets/f0ee2d0b-4062-4611-85bb-e579b456275b)

Definimos que esse novo inscrito, vai receber as notificações via webhook, com isso definimos a URL do nosso Web App, com a rota `/api/updates`:

![Definindo webhook como sub](https://github.com/user-attachments/assets/ddf43f19-08bc-4329-9d08-92d37ebd54d8)

Após criado ele envia uma mensagem de teste, podemos então copiar o Topic Endpoint e o Access Key do Event Grid, para utilizar em nossa aplicação.

![Topic Endpoint](https://github.com/user-attachments/assets/be9b12b6-288a-4afe-acb7-0a684eaafc88)

![Access Key](https://github.com/user-attachments/assets/8dae3f22-7fc4-4dd7-80a2-0d65fddc1b12)

Abaixo temos um exemplo da execução desse projeto **.js** que está nessa pasta:

![Execução do projeto](https://github.com/user-attachments/assets/3a276544-cb04-4a5b-b968-891dd8692ec0)
