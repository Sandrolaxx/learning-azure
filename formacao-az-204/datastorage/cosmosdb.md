# Cosmos DB

É um banco de dados NoSQL totalmente gerenciado, projetado para forneecer baixa latência e escalabilidade elástca da taxa de transferência. Semântica bem definida para consistência de dados e alta disponibilidade.

Para a certificação AZ-204, a prova foca menos em "como criar o banco" e mais em **design de partição**, **níveis de consistência** e **desenvolvimento (SDK)**.

---

### Visão Geral e APIs

O Cosmos DB é globalmente distribuído e multi-modelo. Na hora de criar a conta, você deve escolher a **API**.

* **NoSQL (Antiga Core/SQL):** A padrão. Armazena JSON e consulta usando sintaxe SQL (`SELECT * FROM c`). **Foque 90% do seu estudo aqui.**
* **MongoDB, Cassandra, Gremlin (Graph), Table:** Usadas principalmente para migrar aplicações existentes (Lift and shift) sem reescrever o código de acesso a dados.

---

### Particionamento (O Tópico #1 da Prova) ⚠️

Se você errar a estratégia de particionamento, o banco fica lento e caro. A prova vai te dar um cenário e pedir a melhor **Partition Key** (Chave de Partição).

* **Partition Key (PK):** É a propriedade do seu JSON que o Azure usa para distribuir os dados entre servidores físicos.
* Uma vez definida, **não pode ser alterada**.
* **Requisito de Ouro:** A chave deve ter **alta cardinalidade** (muitos valores únicos) e distribuir o acesso (RUs) uniformemente.
* *Exemplo Bom:* `UserID`, `DeviceID` (espalha bem os dados).
* *Exemplo Ruim:* `Estado` (se 90% dos usuários são de SP, você cria uma "Hot Partition" em SP e o banco gargala).


* **Chaves Sintéticas (Synthetic Keys):**
* Cenário: Você não tem uma coluna com cardinalidade boa.
* Solução: Concatenar propriedades. Ex: `Estado_Data` (`SP_2023-10-01`). Isso espalha melhor os dados que apenas `Estado`.


* **Logical vs Physical:**
* Você gerencia as partições lógicas (via PK).
* O Azure gerencia as físicas (juntando várias lógicas numa máquina). Limite de 20GB por partição lógica.



---

### Níveis de Consistência (Decorar a Tabela)

O Cosmos DB oferece 5 níveis. É um "slider" entre **Performance** (Velocidade) e **Precisão** (Dados atualizados).

| Nível | Comportamento | Latência | Custo (RUs) | Cenário de Prova |
| --- | --- | --- | --- | --- |
| **Strong** (Forte) | Leitura garante o dado mais recente. Escrita só confirma quando replica para todas as regiões. | Alta (Lento) 🐢 | Alto (Dobro) 💰 | Sistemas financeiros, inventário crítico. Zero perda de dados. |
| **Bounded Staleness** | Permite atraso configurável (ex: 5 min ou 100 versões). Ordem garantida. | Média | Alto | Apps globais que toleram *pouco* atraso (ex: placar de bolsa de valores). |
| **Session** (Padrão) | **"Read your own writes"**. Garante consistência para a sessão do usuário. Outros usuários podem ver atrasado. | Baixa ⚡ | Médio | **90% dos casos.** E-commerce (carrinho), Redes Sociais. |
| **Consistent Prefix** | Garante ordem, mas pode ter atraso. Nunca vê escritas fora de ordem (ex: vê comentário A, depois B). | Baixa ⚡ | Baixo | Likes, comentários em feeds. |
| **Eventual** | "Um dia chega". Sem garantia de ordem ou tempo. | Mínima 🚀 | Mínimo 📉 | Contagem de views no Youtube, Reviews. |

> **Dica AZ-204:** Se a questão não especificar, assuma **Session** (é o default). Se pedir o menor custo possível, é **Eventual**.

---

### Throughput e Request Units (RUs)

Você não paga por CPU, paga por **RUs** (Unidades de Requisição).

* 1 RU = Custo de ler 1KB de item via GET (Point Read).
* Escrever, buscar (query) e deletar custa mais RUs.

**Modos de Capacidade:**

1. **Manual/Provisioned:** Você define "Quero 400 RUs". Se passar, toma erro. Bom para cargas previsíveis.
2. **Autoscale:** Define o máximo (ex: 4000). O Azure escala sozinho entre 10% (400) e 100% (4000). Bom para cargas variáveis.
3. **Serverless:** Paga por requisição. Bom para tráfego esporádico (idle na maior parte do tempo).

**Erro 429 (Too Many Requests):**

* Significa que você estourou as RUs.
* **Solução na Prova:** Implementar lógica de **Retry** (tentar de novo) com **Exponential Backoff** no cliente/SDK. Não aumente RUs imediatamente sem analisar.

---

### Programação Server-Side (JS)

Diferente do SQL Server (T-SQL), no Cosmos DB as rotinas internas são escritas em **JavaScript**.

* **Stored Procedures (Procs):** A única forma de garantir **transações ACID** (tudo ou nada) em múltiplos documentos *dentro da mesma partição lógica*.
* **Triggers:**
* *Pre-trigger:* Roda antes de salvar (validação, adicionar timestamp).
* *Post-trigger:* Roda depois de salvar (atualizar um contador agregado).
* **Atenção:** Triggers não disparam automaticamente! Você deve dizer no código: `RequestOptions { PreTriggerInclude = ... }`.


* **UDF (User Defined Functions):** Usadas apenas dentro de queries SQL para cálculos customizados (ex: calcular imposto no `SELECT`). Não usam para escrever dados.

---

### Change Feed (Fluxo de Alterações)

Funciona como um log de transações que você pode "escutar".

* **Uso:** Acionar um **Azure Function** sempre que um documento for criado ou alterado no Cosmos.
* **Limitação:** Ele **não** captura *Deletes* nativamente (apenas criações e atualizações).
* *Workaround (Dica de Prova):* Para capturar deletes, use "Soft Delete" (marque um campo `deleted=true` e use TTL para apagar depois).



---

### SDK .NET (Código)

Hierarquia de objetos que você precisa instanciar:
`CosmosClient` -> `GetDatabase` -> `GetContainer`.

**Operação mais eficiente (Ponto de Prova):**
Sempre que possível, use **Point Read** (`ReadItemAsync`) passando o **ID** e a **Partition Key**. É muito mais barato (1 RU) e rápido que fazer uma Query (`SELECT * FROM c WHERE c.id = ...`).

```csharp
// Exemplo de Point Read (Eficiência Máxima)
ItemResponse<Product> response = await container.ReadItemAsync<Product>(
    id: "123",
    partitionKey: new PartitionKey("Eletronicos")
);

```

---

### Simulado Rápido Cosmos DB

**Cenário:** Você está desenhando um sistema de telemetria para carros de corrida (IoT).

1. O sistema recebe milhares de eventos por segundo contendo `CarroID`, `Velocidade`, `Temperatura`, `Timestamp`.
2. Você precisa consultar os dados frequentemente filtrando por `CarroID` para plotar gráficos em tempo real.
3. O sistema roda globalmente e atrasos mínimos na leitura são toleráveis, mas a ordem dos dados (segundo a segundo) deve ser respeitada estritamente.

**Perguntas:**

1. Qual a melhor **Partition Key**?
2. Qual o **Nível de Consistência** mínimo recomendado para equilibrar performance e ordem?

*(Pense e role para baixo)*
.
.
.

**Respostas:**

1. **Partition Key:** `CarroID`. (Motivo: Suas queries filtram por CarroID. Todos os dados de um carro ficarão na mesma partição, tornando a leitura muito rápida e eficiente).
2. **Consistência:** **Consistent Prefix** (ou Session, se a conexão for mantida pelo mesmo cliente). O importante é garantir a ordem (não ver a velocidade do segundo 5 antes da velocidade do segundo 4), mas permitir um leve delay de replicação é aceitável para ganhar performance.

---

## Exemplo utilização

Temos na pasta **/exercisecosmospy** um exemplo de código utilizando a SDK do CosmosDB com phyton.