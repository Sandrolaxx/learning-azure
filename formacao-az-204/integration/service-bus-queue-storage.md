## Service Bus x Queue Storage

Essa comparação é **garantida** na prova AZ-204.

A Microsoft vai apresentar um cenário e perguntar: *"Qual serviço de fila devemos usar?"*
Para responder, você precisa entender a distinção entre **Armazenamento Simples (Queue Storage)** e **Mensageria Corporativa (Service Bus)**.

---

### Azure Queue Storage (O "Caminhão de Carga") 🚛

Pense no Queue Storage como parte da **Storage Account**. Ele é simples, barato e feito para volumes massivos de dados, mas com pouca inteligência.

#### Características Chave para a Prova:

* **Capacidade Massiva:** Pode armazenar **milhões de mensagens** (até o limite de TBs da Storage Account).
* **Logs de Auditoria:** Como faz parte do Storage, você pode habilitar logs detalhados de quem acessou cada mensagem (útil para compliance).
* **Tamanho da Mensagem:** Até 64 KB (padrão), mas aceita maiores em base64.
* **TTL (Time-to-live):** Mensagens expiram após 7 dias (padrão), mas pode ser configurado para "jamais expirar".

#### Limitações (O que ele NÃO faz):

* ❌ **Não garante ordem (FIFO):** As mensagens podem ser processadas fora da ordem de chegada.
* ❌ **Não tem Pub/Sub:** É apenas ponto-a-ponto (1 produtor -> 1 fila -> 1 consumidor).
* ❌ **Não tem Dead-letter Queue nativa:** O conceito de "poison message" existe, mas é menos sofisticado que no Service Bus.

> **Cenário de Prova:** "Você precisa de uma fila simples para armazenar uma lista de pendências de processamento de imagens (backlog) que pode chegar a 50 GB. A ordem não importa. Você quer a solução mais barata."
> **Resposta:** **Queue Storage**.

---

### Azure Service Bus (O "Gerente Corporativo") 💼

É o broker de mensagens Enterprise. Se o sistema envolve **dinheiro, transações ou ordem estrita**, a resposta é Service Bus.

#### A. Filas (Queues) vs. Tópicos (Topics)

* **Queues (1:1):** Igual ao Queue Storage, mas com superpoderes. Usado para balanceamento de carga.
* **Topics & Subscriptions (1:N):** O padrão **Pub/Sub**.
* Você envia a mensagem para um **Tópico**.
* Várias **Assinaturas** (Subscriptions) copiam essa mensagem.
* *Exemplo:* Tópico "VendaRealizada". Assinatura 1 (Estoque) recebe cópia. Assinatura 2 (Nota Fiscal) recebe cópia.
* **Filtros:** As assinaturas podem filtrar (ex: Assinatura "Internacional" só pega vendas com `Pais != Brasil`).

#### B. Funcionalidades Avançadas (Decorar para a Prova! ⚠️)

1. **Ordem Garantida (Sessions / FIFO):**
* Por padrão, o Service Bus *não* garante ordem perfeita em processamento paralelo.
* Para garantir FIFO (First-In-First-Out), você deve habilitar **Sessões (Sessions)**.
* *Na prova:* Se falar "ordem sequencial de processamento é crítica", a resposta é **Service Bus com Sessions**.

2. **Transações:**
* Permite operações atômicas (tudo ou nada). Enviar mensagem + deletar outra mensagem na mesma transação.

3. **Dead-Letter Queue (DLQ):**
* Uma sub-fila nativa para onde vão as mensagens que deram erro após X tentativas (MaxDeliveryCount). Você pode inspecionar e reenviar depois.

4. **Duplicate Detection:**
* Se você enviar a mesma mensagem (mesmo ID) duas vezes dentro de uma janela de tempo, o Service Bus descarta a segunda. Evita processar o mesmo pagamento duas vezes.

5. **Modos de Recebimento (Receive Mode):**
* **PeekLock (Padrão/Seguro):** O consumidor "trava" a mensagem, processa e depois avisa "Concluí" (`Complete()`). Se o consumidor travar, a mensagem volta para a fila depois do timeout.
* **ReceiveAndDelete:** O Service Bus entrega e apaga imediatamente. Se o consumidor travar processando, a mensagem é perdida. (Mais rápido, menos seguro).

---

### Tabela de Decisão AZ-204 ⚔️

Decore as diferenças que definem a escolha:

| Funcionalidade | Queue Storage | Service Bus |
| --- | --- | --- |
| **Garantia de Ordem (FIFO)** | Não. | **Sim** (com Sessões). |
| **Modelo** | Ponto-a-ponto apenas. | Ponto-a-ponto **e** Pub/Sub. |
| **Tamanho da Fila** | Enorme (> 80 GB). | Limitado (geralmente 1GB a 80GB dependendo do tier). |
| **Tamanho da Mensagem** | 64 KB (texto). | 256 KB (Standard) / 100 MB (Premium). |
| **Delivery Guarantee** | At-Least-Once (Pelo menos uma vez). | **At-Most-Once**, **At-Least-Once**, **Exactly-Once** (via Duplicate Detection). |
| **Logs de Acesso** | Sim (Logs do Storage). | Não detalhado por mensagem. |

---

### Simulado Prático: Storage vs Service Bus 🧠

**Cenário 1: Sistema Financeiro**
Você está projetando um sistema de transferência bancária. A ordem das operações é crítica (o depósito não pode ser processado antes do saque). Além disso, você precisa garantir que nenhuma transferência seja processada em duplicidade caso a rede falhe.
Qual solução você escolhe?

A) Queue Storage.

B) Event Grid.

C) Service Bus Queue com Sessions e Duplicate Detection.

D) Service Bus Topic sem Sessions.

**Cenário 2: Auditoria e Grande Volume**
Você precisa criar um log de auditoria de todos os cliques de usuários no seu site global. O volume esperado é gigantesco (terabytes de mensagens acumuladas). A ordem não importa e o processamento será feito em lote à noite. Você precisa de logs detalhados de quando cada mensagem foi adicionada para fins legais.
Qual solução é a mais adequada e econômica?

A) Service Bus Queue.

B) Azure Queue Storage.

C) Event Hubs.

D) Service Bus Topic.

**Cenário 3: E-commerce**
Quando um cliente finaliza um pedido, o sistema precisa:

1. Avisar o serviço de Estoque.
2. Avisar o serviço de Pagamento.
3. Avisar o serviço de Logística.
Se um novo serviço (ex: Fidelidade) for criado no futuro, ele deve conseguir receber essa mensagem sem que você precise alterar o código do produtor do pedido.
Qual solução?

A) Queue Storage (3 filas diferentes).

B) Service Bus Queue.

C) Service Bus Topic.

D) Azure Functions com HTTP Trigger.

*(Respostas abaixo)*

.

.

.

.

.

.

.

.

**Gabarito Comentado:**

1. **C (Service Bus com Sessions).**
* *Ordem Crítica* = Sessions.
* *Evitar Duplicidade* = Duplicate Detection.
* Queue Storage não garante ordem. Tópicos sem sessão não garantem ordem.

2. **B (Azure Queue Storage).**
* *Palavras-chave:* "Volume gigantesco (TB)", "Ordem não importa", "Logs de auditoria", "Econômica". O Service Bus tem limite de tamanho de fila (e é mais caro). O Queue Storage aguenta TBs de backlog.
* *Nota:* Event Hubs também serviria para ingestão, mas a questão pede uma *fila* para processamento em lote e foca em "audit logs de acesso", que é forte no Storage.

3. **C (Service Bus Topic).**
* O requisito de "adicionar novos interessados sem mudar o produtor" é a definição clássica de **Pub/Sub (Publish/Subscribe)**. Tópicos resolvem isso. Com filas, você teria que mudar o código para enviar para 4 lugares.

---

## Lab implentando Service Bus na prática

Para mais detalhes sobre o lab pode consultar [aqui](./service-bus-lab/README.md).