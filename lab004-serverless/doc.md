## Tutorial serverless Azure

Nesse pequeno tutorial vamos apresentar como criar uma function na Azure que reliza a geração de um boleto e outra function que realiza a validação de um código de barras. Os boletos criados nesse serviço são postados em uma fila utilizando o service bus. Para deixar o exemplo mais rico, criaremos um simples front-end com copilot para consumir as funcionalidades das functions.

### Configurando a fila

Nosso primeiro passo será criar uma fila utilizando o service bus, para isso vamos criar um `Resource Group` e adicionar a ele o recurso do service bus. É possível encontrá-lo com facilidade na busca de recursos do marketplace.

Após criado o recurso, vamos acessar a aba "Políticas de acesso compartilhado", nela vamos copiar a "Cadeia de conexão primária", ela será utilizada na configuração da nossa Function App.

![Image](https://github.com/user-attachments/assets/8baba810-2d97-402e-a1b8-7fef76496616)

O correto é criar uma secret para cada tipo de operação, pois podemos ter problemas com vários serviços que podem criar e gerar mensagens na fila.

![Image](https://github.com/user-attachments/assets/7ee13099-683c-4764-9019-0c981cec781c)

### Criando functions

Estou utilizando o VS Code com a extensão oficial da Microsoft, nela nos conectamos à nossa conta e podemos criar alguns recursos, diretamente pelo editor. Nesse cenário, criei uma nova pasta chamada "function" e abri essa pasta no editor. Vamos crir uma função na pasta raiz. Vou utilizar Node.js para criar as funções. Podemos iniciar a criação da função como no exemplo abaixo.

![Image](https://github.com/user-attachments/assets/3614e238-dd24-48d3-97b2-fc3fce66b725)

Atenção: Vamos criar duas funções, uma chamada `generatebankslip` e outra `validatebankslip`. Após elas criadas vamos alterar a URL de chamada delas adicionando um `-` no nome.

Após criada a função, precisamos adicionar 3 libs ao projeto:
* [bwip-js](https://www.npmjs.com/package/bwip-js#nodejs-request-handler) - Para geração da imagem do código de barras.
* [service-bus](https://www.npmjs.com/package/@azure/service-bus) - SDK da Microsoft para integração com Service Bus.
* [dotenv](https://www.npmjs.com/package/dotenv) - Para utilziar um arquivo .env em nosso projeto para a conection string do service bus.

```
yarn add bwip-js
yarn add @azure/service-bus
yarn add dotenv
```

Então criamos um arquivo `.env` na raiz do projeto e adicionamos a nossa connection string que copiamos no início do tutorial.
```
SERVICE_BUS_CONNECTION_STRING="Endpoint=URL_CONNECTION_STRING"
```

Podemos acessar o todo o arquivo finalizado da primeira função [aqui](./functions/src/functions/fnGenBankslip.ts) e da segunda função [aqui](./functions/src/functions/fnValidateBankslip.ts). Basicamente nesses arquivos temos algumas validações e a regra para receber os dados de um boleto e realizar a criação de um código de barras com uma regra simples e a geração do base64 do mesmo.

Aqui temos um exemplo de imageUrl de geração do código de barras, no site [base64 guru](https://base64.guru/converter/decode/image) podemos ver que ele gerou um código de barras corretamente.

![Image](https://github.com/user-attachments/assets/957bc6cd-aef5-4702-a44e-e6ce9c4d2c79)

Com isso também podemos observar que nossa interação com o service bus está ocorrendo corretamente. O boleto gerado foi postado na fila de boletos gerados.

![Image](https://github.com/user-attachments/assets/e10659db-13bc-4600-b5f3-1d420b7bf5cc)

### Criando front-end

Agora, para deixar o exemplo mais interessante, vamos crir um front para consumir esses serviços. Para isso, vamos utilizar nosso amigo copilot para gerar um front simples de maneira rápida e prática.

Podemos criar um prompt simples como:
```
Crie um front-end para a geração de um boleto utilizando como base curl curl --request POST \   --url https://URL_SEU_SERVICO.azurewebsites.net/api/generate-bankslip \   --header 'Content-Type: application/json' \   --data '{     "dueDate": "2025-06-01",     "amount": 432.47 }', ele recebe os campos valor e data de vencimento do usuário e retorna o response com o campo imageBase64 que contém a imagem do código de barras a ser apresentado na tela, também é retorndo o campo barcode que contém o código de barras criadao, apresente a imagem e o código de barras na tela. Crie uma tela minimalista e intuitiva. Utilize apenas HTML, CSS e javascrip.
```

Pontos interessantes desse prompt, utilizamos o `curl` da API para direcionar o desenvolvimento dele.

![Image](https://github.com/user-attachments/assets/5613b36e-1d45-4e7e-9abf-06ac716669a8)

Também vamos criar a segunda parte, essa segunda parte consome nossa funcionalidade de validação de código de barras. Vamos também utilizar o chat na opção "Copilot Edits" para ele revisar nossos arquivos adicionando a nova funcionalidade.

![Image](https://github.com/user-attachments/assets/6120e248-297f-4814-9456-115e1f9ce079)

> Confeso que nesse ponto ele deixou a desejar e fez algumas alterações não entregando algo funcional e com layout intuitivo. Tive de realizar algumas alterações, os rquivos completos são encontrados em `/front` da pasta dessa documentação.

Veremos que ao tentar utilizar o front-end, teremos um problema de CORS. Para solucionar esse ponto, podemos atualizar na Azure os domínios habilitados a chamar nossa função.

Vamos acessar nosso Function App > API > CORS. Adicionar a URL do nosso front, aqui estava utilizando o live-preview, que sobe a aplicação em `http://127.0.0.1:5500`. Caso esteja utilizando outra ferramenta, adicione a URL de acordo com ela.

![Image](https://github.com/user-attachments/assets/3d197b00-db2b-443b-814c-fb8ae4d3ec57)

Aqui podemos observar o resultado do front-end gerado para realizar a integração com as funções na Azure. 

![Image](https://github.com/user-attachments/assets/93a3b769-253e-4f89-8afd-b1b286aa8de1)

Nesse exemplo executamos as duas funcionalidades via interface.

![Image](https://github.com/user-attachments/assets/0caefec7-07fd-4f04-a187-2e9fdfc2b1ae)

Aqui temos um cenário de erro.

![Image](https://github.com/user-attachments/assets/cef839e0-daf7-465e-8adc-dc005694275a)

Para finalizar, podemos acessar nosso `Resource Group` e visualizar todos os serviços utilizados nesse lab.

![Image](https://github.com/user-attachments/assets/83f4c8b5-3e4d-47f1-aa94-79a24b85dd5d)

---

## Resumo de filas e tópicos

Resumo com os pontos cruciais da documentação do Azure Service Bus.

### Azure Service Bus

É um **mensageiro confiável na nuvem** que desacopla as partes de uma aplicação, permitindo comunicação assíncrona e segura.

#### Fila vs. Tópico (A Diferença Essencial)

* **Fila (Queue): Comunicação 1 para 1**
    * Uma mensagem enviada para uma fila é processada por **apenas um** receptor.
    * **Uso Ideal:** Processar uma tarefa específica (ex: "processe este pedido").

* **Tópico (Topic): Comunicação 1 para Muitos (N)**
    * Uma mensagem enviada para um tópico é distribuída como uma cópia para **múltiplos** receptores (assinantes), cada um reagindo de forma independente.
    * **Uso Ideal:** Notificar sobre um evento (ex: "um pedido foi criado").

#### Planos de Serviço (A Decisão de Confiabilidade)

* **Plano Basic:**
    * **Recursos:** Apenas **Filas**.
    * **Confiabilidade:** Baixa (mensagens podem ser perdidas em caso de falha).
    * **Uso Ideal:** Desenvolvimento, testes e aplicações não críticas.

* **Plano Standard:**
    * **Recursos:** **Filas e Tópicos**.
    * **Confiabilidade:** Alta (entrega de mensagem garantida). Inclui transações e detecção de duplicados.
    * **Uso Ideal:** **Qualquer aplicação de produção**. É o padrão para sistemas robustos.

### Resumo da Decisão

| Se você precisa... | Use... |
| :--- | :--- |
| Executar **uma tarefa** por mensagem | **Fila** |
| Notificar **vários sistemas** sobre um evento | **Tópico** |
| De um ambiente para **aprender ou testar** | **Plano Basic** |
| De uma aplicação **confiável para produção** | **Plano Standard** |