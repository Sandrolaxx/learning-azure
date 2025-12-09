# Azure Cache for Redis (AZ-204)

## Visão Geral e Arquitetura

O Azure Cache for Redis é um armazenamento de dados na memória (in-memory) totalmente gerenciado, baseado no software open-source Redis.

* **Principal Objetivo:** Melhorar o desempenho e a escalabilidade de aplicativos que usam intensamente armazenamentos de dados de back-end (SQL, Cosmos DB).
* **Como funciona:** Ele mantém os dados acessados com frequência na memória RAM (latência de sub-milissegundos), evitando leituras caras em disco.

---

## Níveis de Serviço (SKUs) ⚠️ *Crítico para a Prova*

A Microsoft cobra que você saiba escolher o nível certo baseado em **SLA**, **Persistência** e **Segurança de Rede**.

| Tier (Nível) | Descrição | SLA | Recursos Exclusivos (Decore!) | Cenário de Uso |
| --- | --- | --- | --- | --- |
| **Basic** | Nó único (sem replicação). | **Nenhum** | Nenhum. Se o nó cair, você perde dados. | Desenvolvimento/Teste. |
| **Standard** | Dois nós (Primário + Réplica). | **Sim** (99.9%+) | Replicação automática. Se o primário cai, a réplica assume. | Produção de uso geral. |
| **Premium** | Hardware mais potente. | **Sim** (99.9%+) | **Persistência de Dados (RDB/AOF)**, **Clustering (Sharding)**, **VNET Integration** (Rede Privada). | Produção crítica, alta segurança, Disaster Recovery. |
| **Enterprise** | Redis Enterprise (Redis Labs). | **Sim** (99.99%) | **Active Geo-Replication**, Módulos Redis (Search, JSON, Bloom). | Aplicações globais e requisitos avançados. |

> **💡 Nota de Prova:**
> * Precisa colocar o Redis dentro de uma **VNET** privada? Resposta: **Premium**.
> * Precisa garantir que os dados **sobrevivam a um reboot** total? Resposta: **Premium (Data Persistence)**.

---

## Padrões de Design (Design Patterns)

Na prova, você precisará identificar ou escrever a lógica para usar o cache corretamente. O padrão dominante é o **Cache-Aside**.

### O Padrão Cache-Aside (Cache-Aside Pattern)

O aplicativo (não o banco de dados) é responsável por gerenciar o ciclo de vida dos dados no cache.

**Fluxo Lógico:**

1. O App verifica se a chave existe no Redis (`KeyExists`).
2. **Hit (Acerto):** Se existir, retorna o dado do cache.
3. **Miss (Erro):** Se não existir:
* O App consulta o Banco de Dados (SQL).
* O App salva o resultado no Redis com um tempo de expiração (**TTL**).
* O App retorna o dado ao usuário.

**Código Exemplo (C#):**

```csharp
public async Task<string> GetUserProfileAsync(string userId)
{
    var cacheKey = $"user:{userId}";
    
    // 1. Tenta ler do Cache
    string cachedData = await _database.StringGetAsync(cacheKey);
    if (!string.IsNullOrEmpty(cachedData))
    {
        return cachedData; // Cache Hit
    }

    // 2. Cache Miss: Lê do Banco de Dados real
    var userProfile = await _repo.GetUserFromSqlAsync(userId);

    // 3. Salva no Cache com expiração (TTL)
    // Importante: Sempre defina um TTL para evitar dados velhos eternos
    await _database.StringSetAsync(cacheKey, userProfile, TimeSpan.FromMinutes(10));

    return userProfile;
}

```

---

## Desenvolvimento e Conexão (StackExchange.Redis)

A biblioteca cliente recomendada para .NET é a `StackExchange.Redis`.

### Boas Práticas de Conexão (Top 1 Erro em Performance)

A classe `ConnectionMultiplexer` é pesada para criar.

* **Errado:** Criar uma nova conexão (`using var conn = ...`) a cada requisição. Isso esgota as portas do servidor.
* **Correto (Prova):** Usar o padrão **Singleton**. Crie uma única instância do `ConnectionMultiplexer` e reutilize-a durante toda a vida da aplicação.

```csharp
// Exemplo de Singleton (Lazy Loading)
private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
{
    return ConnectionMultiplexer.Connect("meu-redis.redis.cache.windows.net:6380,password=...,ssl=True,abortConnect=False");
});

public static ConnectionMultiplexer Connection => lazyConnection.Value;

```

---

## Gerenciamento de Dados e Expiração

### TTL (Time-to-Live)

Nenhum dado deve viver para sempre no cache (a menos que seja estático).

* Você define o TTL no momento da escrita (`StringSet`).
* O Redis apaga automaticamente a chave após o tempo expirar.

### Políticas de Despejo (Eviction Policies)

O que acontece quando a memória RAM do Redis enche (ex: atingiu 13GB num plano de 13GB)? O Redis precisa apagar algo para gravar novos dados. Você configura isso no portal.

1. **volatile-lru (Padrão e Recomendado):** Remove as chaves menos usadas recentemente (LRU) **que possuem um TTL definido**.
2. **allkeys-lru:** Remove as chaves menos usadas, **mesmo que não tenham TTL**. (Perigoso se você usa o Redis para persistir dados de sessão que não deveriam sumir).
3. **noeviction:** Retorna erro quando a memória enche. (Não recomendado).

---

## Recursos Avançados (Premium Tiers)

### A. Persistência de Dados (Data Persistence)

Permite salvar o estado da memória em disco (Azure Storage Account). Útil para Disaster Recovery.

* **RDB (Redis Database):** Tira "fotos" (snapshots) periódicas (ex: a cada hora). Mais performático, mas pode perder dados da última hora.
* **AOF (Append Only File):** Salva cada operação de escrita num log. Mais seguro, mas pode impactar performance.

### B. Clustering (Sharding)

Se você precisa de mais de 120GB de memória ou mais CPU do que um único nó aguenta.

* O Redis divide os dados em **Shards** (fragmentos).
* Exemplo: Um cluster com 3 shards de 13GB = 39GB de capacidade total e 3x mais vazão de processamento.

### C. Geo-Replicação (Geo-replication)

* **Passiva (Premium):** Você tem um Cache Primário (EUA) e um Secundário (Brasil). O Secundário é *Read-Only* (somente leitura). Se o Primário cair, você deve fazer o failover manual.
* **Ativa (Enterprise):** Você pode escrever e ler em ambas as regiões ao mesmo tempo. A sincronização é bidirecional (Conflict Resolution via CRDTs).

---

## Criptografia e Segurança

* **SSL/TLS:** O Azure habilita por padrão. O acesso ocorre pela porta **6380**.
* Se você tentar conectar pela porta 6379 (não-SSL) sem configurar explicitamente para permitir, a conexão falhará.

* **Access Keys:** Existem duas chaves (Primary e Secondary).
* *Rotação de Chaves:* Você muda a aplicação para usar a Secundária, regenera a Primária, muda o app para usar a Primária nova, regenera a Secundária. Isso garante zero downtime.

* **Firewall Rules:** Você pode restringir quais IPs podem acessar o Redis (nível básico de segurança).

---

## ASP.NET Core Session State

Cenário clássico de prova: **Web Farm**.
Você tem um site rodando em 5 instâncias do App Service. Onde você guarda a sessão do usuário (carrinho de compras)?

* **In-Proc (Memória do Servidor):** ❌ Errado. Se o Load Balancer jogar o usuário para outro servidor, ele perde o carrinho.
* **SQL Server:** ⚠️ Funciona, mas é lento e caro para dados voláteis.
* **Redis Session State Provider:** ✅ **Correto.** Rápido, centralizado e acessível por todas as instâncias.

**Como configurar:**
Instale o pacote `Microsoft.Extensions.Caching.StackExchangeRedis` e configure no `Program.cs`:

```csharp
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("MyRedisConStr");
});

```

---

## Resumo para "Cheat Sheet" AZ-204

1. **VNET? Persistência? Cluster?** -> Use Tier **Premium**.
2. **Dev/Test barato?** -> Use Tier **Basic** (mas saiba que não tem SLA).
3. **Pattern?** -> **Cache-Aside** (App gerencia: Check -> Get -> Set).
4. **Connection Class?** -> `ConnectionMultiplexer` como **Singleton**.
5. **Memória Cheia?** -> Ocorre **Eviction** (baseado em LRU).
6. **Segurança?** -> Use porta **6380 (SSL)** e rote o Access Key sem downtime.

---

## Simulado Final

Sessão Perdida Você migrou uma aplicação PHP para o Azure App Service e configurou o Autoscale para variar entre 2 e 10 instâncias. Usuários reclamam que precisam fazer login repetidamente durante a navegação. Qual a solução mais eficiente?

A) Configurar a Afinidade de Sessão (ARR Affinity) no App Service.

B) Configurar o Azure CDN para cachear os cookies de sessão.

C) Implementar o Azure Cache for Redis e configurar o app PHP para salvar sessões nele.

D) Aumentar o tamanho da instância (Scale Up) e fixar em 1 instância.

(Resposta)

.

.

.

.

.

.

.

**Resposta C (Redis Session Store)**. ARR Affinity (A) funciona, mas cria desbalanceamento de carga (um servidor fica cheio e outros vazios). A solução correta para nuvem ("Stateless") é externalizar a sessão para o Redis.

---

## Lab utilizando Redis

Podemos encontrar mais informações sobre o lab mão na massa [aqui](./lab-redis/lab-redis.md).