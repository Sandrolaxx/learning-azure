# Azure Redis Cache - Laboratório Node.js + TypeScript

Aplicação demonstrativa das principais funcionalidades do Azure Redis Cache usando Node.js com TypeScript.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Azure Redis Cache criado no portal Azure
- Credenciais de acesso ao Redis (host, porta, senha)

## 🚀 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
REDIS_HOST=seu-redis.redis.cache.windows.net
REDIS_PORT=6380
REDIS_PASSWORD=sua-chave-de-acesso
```

### 3. Como obter as credenciais do Azure Redis

1. Acesse o portal Azure: https://portal.azure.com
2. Navegue até seu recurso Redis Cache
3. No menu lateral, clique em "Access keys"
4. Copie:
   - **Host name**: será o `REDIS_HOST`
   - **Port**: geralmente `6380` (SSL) ou `6379` (não-SSL)
   - **Primary key** ou **Secondary key**: será o `REDIS_PASSWORD`

## 📦 Estrutura do Projeto

```
lab-redis/
├── src/
│   └── index.ts          # Código principal com todas as demonstrações
├── dist/                 # Código compilado (gerado após build)
├── .env                  # Variáveis de ambiente (não commitado)
├── .env.example          # Exemplo de configuração
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
└── README.md            # Este arquivo
```

## 🎯 Funcionalidades Demonstradas

A aplicação demonstra as seguintes operações do Redis:

### 1. **Strings**
- `SET` / `GET`: Operações básicas de chave-valor
- `SETEX`: Definir valor com expiração
- `INCR` / `DECR`: Incrementar/decrementar contadores
- `MSET` / `MGET`: Operações múltiplas

### 2. **Listas**
- `LPUSH` / `RPUSH`: Adicionar elementos
- `LPOP` / `RPOP`: Remover elementos
- `LRANGE`: Obter range de elementos
- `LLEN`: Tamanho da lista

### 3. **Sets**
- `SADD`: Adicionar membros
- `SMEMBERS`: Listar membros
- `SINTER`: Interseção de sets
- `SUNION`: União de sets
- `SDIFF`: Diferença entre sets

### 4. **Hashes**
- `HSET` / `HGET`: Definir/obter campos
- `HGETALL`: Obter todos os campos
- `HINCRBY`: Incrementar valores numéricos
- `HEXISTS`: Verificar existência de campo

### 5. **Sorted Sets (ZSets)**
- `ZADD`: Adicionar membros com score
- `ZRANGE` / `ZREVRANGE`: Obter ranges ordenados
- `ZRANK`: Obter posição
- `ZINCRBY`: Incrementar score

### 6. **Expiração**
- `EXPIRE`: Definir expiração em segundos
- `TTL`: Verificar tempo restante
- `PERSIST`: Remover expiração

### 7. **Gerenciamento de Chaves**
- `EXISTS`: Verificar existência
- `KEYS`: Listar chaves por padrão
- `TYPE`: Verificar tipo da chave
- `DEL`: Deletar chaves
- `RENAME`: Renomear chaves

### 8. **Transações**
- `MULTI` / `EXEC`: Executar comandos atômicos

## 🏃 Executar a Aplicação

### Modo desenvolvimento (com ts-node)

```bash
npm run dev
```

### Build e execução em produção

```bash
npm run build
npm start
```

### Limpar arquivos compilados

```bash
npm run clean
```

## 📊 Exemplo de Saída

```
✓ Conectado ao Azure Redis Cache

🚀 INICIANDO DEMONSTRAÇÕES DO AZURE REDIS CACHE

=== 1. OPERAÇÕES COM STRINGS ===
✓ SET user:1:name = "João Silva"
✓ GET user:1:name = "João Silva"
✓ SET session:abc123 com expiração de 300 segundos
...

=== 2. OPERAÇÕES COM LISTAS ===
✓ LPUSH 3 tarefas na fila
✓ RPUSH task4
...

✅ TODAS AS DEMONSTRAÇÕES CONCLUÍDAS COM SUCESSO!

✓ Desconectado do Redis
```

## 🔧 Bibliotecas Utilizadas

- **redis**: Cliente oficial Node.js para Redis (v4+)
- **dotenv**: Gerenciamento de variáveis de ambiente
- **typescript**: Suporte a TypeScript
- **ts-node**: Execução direta de TypeScript

## 📝 Casos de Uso Práticos

### Cache de Sessões
```typescript
await client.set('session:user123', JSON.stringify(sessionData), { EX: 3600 });
```

### Rate Limiting
```typescript
const key = `rate:limit:${userId}`;
await client.incr(key);
await client.expire(key, 60); // 60 requisições por minuto
```

### Leaderboards
```typescript
await client.zAdd('leaderboard', { score: points, value: playerId });
const topPlayers = await client.zRange('leaderboard', 0, 9, { REV: true });
```

### Cache de Objetos
```typescript
await client.hSet('product:123', {
  name: 'Produto',
  price: '99.90',
  stock: '50'
});
```

## 🔒 Segurança

- **Sempre use TLS/SSL**: Azure Redis requer conexão segura (porta 6380)
- **Nunca commite o arquivo `.env`**: Está no `.gitignore`
- **Rotacione chaves de acesso**: Periodicamente pelo portal Azure
- **Use Access Control Lists (ACL)**: Para ambientes de produção

## 📚 Recursos Adicionais

- [Documentação Azure Redis Cache](https://learn.microsoft.com/azure/azure-cache-for-redis/)
- [Redis Commands Reference](https://redis.io/commands/)
- [Node Redis Client Docs](https://github.com/redis/node-redis)

## 🤝 Próximos Passos

- Implementar cache em uma API REST
- Adicionar monitoramento e métricas
- Explorar Pub/Sub com Redis
- Implementar cache distribuído
- Testar clustering e alta disponibilidade

## 📄 Licença

Este é um projeto de estudo para aprendizado de Azure Redis Cache.
