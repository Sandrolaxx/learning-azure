# Weather API

API simples para consultar dados do clima usando Open-Meteo.

## 🚀 Tecnologias

- Node.js
- Express
- TypeScript
- Axios
- Docker

## 📋 Pré-requisitos

- Node.js 20+
- Docker (opcional)

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` e adicione sua API Key do OpenWeatherMap.

## 🏃 Executando localmente

### Modo desenvolvimento:
```bash
npm run dev
```

### Build e produção:
```bash
npm run build
npm start
```

## 🐳 Docker

### Build da imagem:
```bash
docker build -t weather-api .
```

### Executar container:
```bash
docker run -p 3000:3000 weather-api
```

### Com docker-compose:
```bash
docker-compose up
```

## 📡 Endpoints

### GET /health
Health check da API
```bash
curl http://localhost:3000/health
```

### GET /weather/:city
Consulta o clima atual de uma cidade
```bash
curl http://localhost:3000/weather/Sao%20Paulo
```

### GET /forecast/:city
Consulta a previsão de 5 dias de uma cidade
```bash
curl http://localhost:3000/forecast/Rio%20de%20Janeiro
```

### Query Parameters
- `lang`: Idioma da resposta (padrão: pt_br)