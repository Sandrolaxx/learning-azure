## Objtivo do lab

Realizar a criação de uma aplicação de aluguel de carros, onde teremos um front-end como porta de entrada para as informações do cliente, o resto do back-end é extremamente resiliente, onde caso algum serviço fique indisponível, quando ele voltar, o processamento seguirá seu fluxo original normalmente. 

Para isso, vamos utilizar:
* [Container Apps](https://learn.microsoft.com/pt-br/azure/container-apps/overview)
* [Service Bus](https://learn.microsoft.com/pt-br/azure/service-bus-messaging/service-bus-messaging-overview)
* [Azure Postgres](https://learn.microsoft.com/pt-br/azure/postgresql)
* [Azure Cosmos DB](https://learn.microsoft.com/pt-br/azure/cosmos-db)
* [Logic Apps](https://learn.microsoft.com/pt-br/azure/logic-apps/logic-apps-overview)

Abaixo temos o desenho da arquitetura dessa aplicaçãa.

![Image](https://github.com/user-attachments/assets/3b0b46eb-e746-4e41-950e-bf97a13a8680)

#### Criando os recursos

Então vamos realizar a criação de todos os serviços que precisamos.

Primeiramente vamos criar um Container Registry para armazenar as imagens das aplicações do front.

![Image](https://github.com/user-attachments/assets/539d910f-fd64-4322-8915-f4bd3cfe911b)

Então vamos criar um Container App(Aplicativo de Contêiner) que executarão nossas aplicações do front.

![Image](https://github.com/user-attachments/assets/a13e0b2a-5b45-4b3b-9b83-2108a52faecd)

A partir disso vamos criar nossas duas functions, RentProcess e PaymentProcess.

![Image](https://github.com/user-attachments/assets/a00c7fdc-cc00-4727-b218-1694dd8c9627)

Vamos então criar nossa fila com Service Bus.

![Image](https://github.com/user-attachments/assets/1c73a5b2-3a9b-4a31-9f6b-216968bca69c)

Vamos criar nossa base de dados com o Postgres.

![Image](https://github.com/user-attachments/assets/9d855f7d-a4d7-4f64-9f12-f6047febd9be)

Algumas configurações da base.

![Image](https://github.com/user-attachments/assets/5ebd5ebd-20a3-480f-aba4-cc286dc09c5a)

Criação do banco não relacional Cosmos DB.

![Image](https://github.com/user-attachments/assets/f0957d19-7833-48a5-83dd-8018fd8ac6c2)

Criação do Logic App para disparo de e-mail.

![Image](https://github.com/user-attachments/assets/3f30cea6-b8cc-4ec1-b7bd-9cf38125e321)

E por fim criação do Key Vault para armazenamento de segredos da aplicação.

![Image](https://github.com/user-attachments/assets/4b504fc2-f770-4f65-82a6-f7fb32aba55e)

Teremos todos os seguintes recursos em nosso resource group.

![Image](https://github.com/user-attachments/assets/f2687c0b-0461-4452-a7d5-df5675cbf5e1)

---

#### Criando a API(front-end*)

Inicialmente iriamos criar um front, mas vamos simplificar e criar apenas uma API com Node.js.

Libs utilizadas no projeto: `yarn add express cors dotenv @azure/identity @azure/service-bus`

Depois de criar o nosso arquivo da aplicação que se encontra [aqui](./rent-a-car/index.js), vamos então criar um arquivo `dockerfile` para definir como será a criação da imagem do nosso container.

dockerfile:
```
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD [ "node", "index.js" ]
```

Agora vamos realizar um série de comandos para enviar a imagem para o registry:
```
#Gerar o build da imagem
docker build -t rent-car-local .  

#Login Azure
az login

#Login ACR
az acr login --name acrlab007sandrolaxx

#Tag docker
docker tag rent-car-local acrlab007sandrolaxx.azurecr.io/rent-car-local:v1

#Envio da imagem para ACR
docker push acrlab007sandrolaxx.azurecr.io/rent-car-local:v1

#Criar ambiente - cuidar com limite de env por região
az containerapp env create --name rent-car-local-env --resource-group lab007 --location eastus

#Criação da aplicação com image
az containerapp create \
  --name rent-car-api \
  --resource-group lab007 \
  --image acrlab007sandrolaxx.azurecr.io/rent-car-local:v1 \
  --environment rent-car-local-env \
  --cpu 0.5 \
  --memory 1Gi \
  --target-port 3001 \
  --ingress external \
  --registry-server acrlab007sandrolaxx.azurecr.io
```

Após finalizado o processo, podemos buscar no json que retornou no bash pelo campo `latestRevisionFqdn`, com o valor dele já podemos bater na URL, aqui o exemplo `https://rent-car-api--0000001.ambitiousforest-cac6d885.eastus.azurecontainerapps.io/api/car-rental` que foi retornado em meu json, com isso já podemos consumir nosso serviço através de seu domínio.

---

#### Criando Function Consumo fila com Trigger

Nesse ponto criamos a [função](./fnrentprocess/src/index.ts) que utiliza o [arquivo](./fnrentprocess/src/dbConnection.ts) para configurar a conexação com a base de dados. Definições de URL conection string está no `.env` e `local.settings.json`.

Nesse fluxo nos consumimos a mensagem da fila `fila-locacao-auto`, pegamos essa mensagem e persistimos em nosso postgres na Azure, após isso criamos um novo objeto(Pagamento) e enviamos a mensagem para fila `fila-pagamento`.

Podemos abaixo visualiza todo o fluxo realizado.

![Image](https://github.com/user-attachments/assets/e33baddd-c4e9-4850-a2dc-b3d7186952f4)

* Criação da mensagem na fila-locacao-auto
* Consumo na base de dados
* Registro na fila-pagamento.