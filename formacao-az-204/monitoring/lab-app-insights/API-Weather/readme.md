# Configuração do Application Insights

## O que foi adicionado

A biblioteca `applicationinsights` foi configurada no projeto para monitoramento e telemetria da aplicação.

## Funcionalidades Habilitadas

- ✅ **Auto Collect Requests**: Rastreamento automático de requisições HTTP
- ✅ **Auto Collect Performance**: Coleta de métricas de performance
- ✅ **Auto Collect Exceptions**: Captura automática de exceções
- ✅ **Auto Collect Dependencies**: Rastreamento de dependências externas (chamadas HTTP, banco de dados)
- ✅ **Auto Collect Console**: Captura de logs do console
- ✅ **Dependency Correlation**: Correlação entre requisições e dependências
- ✅ **Disk Retry Caching**: Cache em disco para tentativas de reenvio
- ✅ **Live Metrics**: Métricas em tempo real
- ✅ **Distributed Tracing**: Rastreamento distribuído (AI e W3C)

## Como Configurar

### 1. Criar um Application Insights no Azure

```bash
# Via Azure CLI
az monitor app-insights component create \
  --app weather-api-insights \
  --location eastus \
  --resource-group <seu-resource-group> \
  --application-type web
```

### 2. Obter a Connection String

No portal Azure:
1. Acesse seu recurso Application Insights
2. Vá em **Overview** ou **Properties**
3. Copie a **Connection String**

Ou via CLI:
```bash
az monitor app-insights component show \
  --app weather-api-insights \
  --resource-group <seu-resource-group> \
  --query connectionString -o tsv
```

### 3. Configurar a Connection String

Edite o arquivo `.env` e adicione a connection string:

```env
PORT=3000
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=xxx;IngestionEndpoint=https://xxx.applicationinsights.azure.com/
```

### 4. Instalar Dependências

```bash
npm install
```

### 5. Executar a Aplicação

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

## Monitoramento no Azure

Após configurar, você poderá ver no Application Insights:

### Requisições HTTP
- Volume de requisições
- Tempo de resposta
- Taxa de sucesso/falha
- Endpoints mais acessados

### Dependências
- Chamadas para API Open-Meteo
- Tempo de resposta das APIs externas
- Taxa de sucesso/falha

### Exceções
- Erros capturados automaticamente
- Stack traces completos
- Frequência de erros

### Performance
- Uso de memória
- CPU
- Latência

### Live Metrics
- Métricas em tempo real
- Requisições por segundo
- Tempo de resposta em tempo real

## Telemetria Customizada (Opcional)

Se precisar adicionar telemetria customizada:

```typescript
import * as appInsights from 'applicationinsights';

// Obter o cliente
const client = appInsights.defaultClient;

// Rastrear evento customizado
client.trackEvent({
  name: 'WeatherRequested',
  properties: {
    city: 'São Paulo',
    source: 'mobile'
  }
});

// Rastrear métrica customizada
client.trackMetric({
  name: 'CitiesRequested',
  value: 1
});

// Rastrear trace/log
client.trackTrace({
  message: 'Processando requisição de clima',
  severity: appInsights.Contracts.SeverityLevel.Information
});
```

## Troubleshooting

### Telemetria não aparece no Azure

1. Verifique se a connection string está correta
2. Aguarde até 5 minutos (pode haver delay)
3. Verifique se há erros no console da aplicação
4. Teste o endpoint de health: `curl http://localhost:3000/health`

### Ambiente de Desenvolvimento

Durante o desenvolvimento local, todas as telemetrias serão enviadas para o Azure. Se preferir desabilitar:

```typescript
// Adicione condição no src/index.ts
if (process.env.NODE_ENV === 'production' && process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    // ... resto da configuração
}
```

## Referências

- [Documentação oficial Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/nodejs)
- [SDK Node.js](https://github.com/microsoft/ApplicationInsights-node.js)

---

# Lab - Configuração e utilização **Application Insights**

Criando o Application Insights:

![Criando Application Insights](https://github.com/user-attachments/assets/2a62572f-c523-4355-bd70-a05b76d0e1ea)

Vamos reutilizar a API de dados de clima e temperatura, vamos criar um Web App para exeutar essa app:

![Criando Web App](https://github.com/user-attachments/assets/b0552262-e199-449b-8f63-30e0c15ad203)

Importante definir o nosso Application Insights definido no primeiro passo:

![Definindo App Insights](https://github.com/user-attachments/assets/a0152e50-4924-4306-ae6b-d12b8e70b7ca)

Algo interessante que podemos fazer também é definir uma métrica para Scale out automático, para isso temos de mudar o nível do nosso plano:

![Aprimorando plano](https://github.com/user-attachments/assets/54ded45c-3692-49f2-a283-e806aaabd18f)

Com isso podemos mudar o Scale Out para rule based:
![Mudando Scale Out](https://github.com/user-attachments/assets/9a238256-c1f6-49d9-87a9-e040b1c1b50f)

Então criamos a métrica:
![Criando a métrica](https://github.com/user-attachments/assets/7e5a25f8-27a8-4d0b-9896-81ba80c8fa09)

Agora podemos voltar a nosso aplicação e definir no **.env** o nosso connection string:
![Connection String](https://github.com/user-attachments/assets/6a0a597f-9e76-4ae1-a4ab-307d8211bbde)

Vamos agora subir nossa app para o Web App.

Na raiz do projeto vamos gerar o **.zip** com todos os arquios, aqui não temos a necessidade de gerar o build do projeto, pois esse processo vai ser realizado pelo serviço da Azure:
```
zip -r deploy.zip . -x "*.git*"
```

Comando para realizar deploy no Web App:
```
az webapp deploy --resource-group az204-application-insights --name appinsights-api-sandrolaxx --src-path ./deploy.zip
```

Podemos fazer uma série de requests e já visualizar ela sendo apresentada no Application Insights:
![Dados já refletindo no App Insights](https://github.com/user-attachments/assets/1331ff3a-523c-4e27-9b5b-4a1d0a108ba7)

Pare ter um controle real-time do que está ocorrendo na App podemos acessar o live metrics e acompanhar request a request:
![Live Metrics](https://github.com/user-attachments/assets/89da2e4c-7451-4468-9d1c-a4e0de7af05e)

Para um troubleshooting dos problemas podemos acessar a aba Failures:
![Failures](https://github.com/user-attachments/assets/676e59d4-1ddf-46f4-b0a4-83989a89aac9)

Claro sempre lembrar de encerrar os recursos:
```
az group delete --name az204-application-insights --no-wait
```