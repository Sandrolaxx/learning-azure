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

---

#### Criando Function Consumo fila payment

O objetivo dessa função é consumir `fila-pagamento`, salvar os dados no CosmosDB e após isso postar a mensagem na `fila-notificacao`, onde a mensagem será consumida por um Logic App que fará o envio do e-mail para o cliente.

Claro antes de tudo criamos a fila chamada `fila-notificacao`.

O fluxo lógico de conexão com os cosmos e postagem da mensagem na fila pode ser encontrado no [arquivo](./fnpayment/src/functions/fnPaymentProcess.ts).

Após criação da base e container do CosmosDB, podemos executar a função e ter o retorno abaixo, permanência dos dados na base:

![Image](https://github.com/user-attachments/assets/097797f3-4d65-484a-9995-160726491808)

Com isso finalizamos a parte de desenvolvimento e iniciamos a criação de nosso Logic App, uma pena que o professor não apresentou a configuração do mesmo na aula, mas fui atrás de entender como o serviço funciona e como considerá-lo.

---

#### Configurando Logic App

Primeiro ele inicia vazio, então adicionamos o primeiro passo que é o componente de "Quando uma mensagem recebida na fila", ou em inglês "When a message in rerceived in a queue (auto-complete)", vamos configurar nossa fila com nossa connection string e definir a fila alvo `fila-notificacao`.

Após isso vamos realiza o processo do parse do json recebido na mensagem da fila. Para isso vamos adicionar outro componente buscando por "Parse JSON". Vamos **utilizar o payload como exemplo**(que está na fila) e cria uma função para fazer o parse no base64 recebido pela fila, pegar apenas o json do conteúdo e extrair os valores que estão no campo `data`.

![Image](https://github.com/user-attachments/assets/3dd5e986-9a95-4e54-99ca-456808f22c0c)

Após isso vamos realizar uma composição para facilitar a montagem do layout do e-mail, vamos adiciona mais um componente buscando por "Compose". Vamos clica na opção "raio" que nos permite acessar valores da etapa anterior e montar o tamplate da mensagem do e-mail.

![Image](https://github.com/user-attachments/assets/4f3ee9b4-3567-49b3-b239-3d07a71166a2)

Agora enfim vamos adicionar o componente de envio de e-mail utilizando o [Sendgrid](https://sendgrid.com/en-us), tentei utilizar os componentes do Outlook e Gmail, porém ambos tive problemas de utilização, no Gmail problema do connector ao utilizar juntamente com service bus e o Outlook problema de credencial.

Para configurar o sendgrid é muito simples, buscamos na barra pelo componenete "Sendgrid" e selecionamos a opção "Enviar email (v4)".

![Image](https://github.com/user-attachments/assets/da0716fd-210b-4bc6-acdf-8a32b341d556)

Então configuramos o componente com nossa secret key do sendgrid. Aqui utilizamos os valores de etapas anteriores, assim como fizemos na montagem do tamplate do e-mail.

![Image](https://github.com/user-attachments/assets/7ee7e567-743d-4619-82a7-2a94607e7549)

Após toda essa configuração podemos executar nosso Logic App clicando na opção "Run", caso tenha mensagens na fila ele já vai consumir e realizar o processo de envio de e-mail, assim como podemos ver no print abaixo.

![Image](https://github.com/user-attachments/assets/b9e37141-36df-4bbf-bd17-1865f2863929)

Com isso finalizamos nosso lab, realizando todo o processo diposto no desenho da nossa arquitetura, tirando a questão do KeyVault que não foi apresentada.

Não se esqueça de excluir o resource group para evitar surpresas em sua fatura do cartão!

![Image](https://github.com/user-attachments/assets/a50030fc-5804-42a3-8f52-2c8f06d8d793)