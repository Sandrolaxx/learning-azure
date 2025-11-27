## Event Grid e Event Hubs📨

* **Event Grid:** "Algo aconteceu!" (Reativo / Notificação).
* **Event Hubs:** "Tome aqui milhões de dados!" (Big Data / Streaming).

---

### Azure Event Grid (O "Fofoqueiro" / Reativo) 🔔

O Event Grid é um **Broker de Eventos** totalmente gerenciado. A função dele é pegar um evento de uma fonte (Publisher) e rotear para um interessado (Subscriber).

#### Características Chave para a Prova:

* **Modelo Push-Push:** A fonte empurra para o Grid, o Grid empurra para o seu código (Webhook, Function, Logic App). Seu código não precisa ficar perguntando "tem novidade?".
* **Eventos Discretos:** Cada evento é independente. O Grid não garante a ordem estrita (embora tente). Ele quer entregar rápido.
* **Integração Nativa:** Ele já vem "ligado" nos serviços do Azure.
* *Ex:* "Arquivo criado no Blob" -> Grid avisa -> Function redimensiona imagem.
* *Ex:* "Nova VM criada" -> Grid avisa -> Logic App manda email pro chefe.

#### Conceitos Técnicos (Vocabulário AZ-204):

1. **Topics (Tópicos):** O endpoint onde a fonte envia o evento.
* *System Topics:* Tópicos prontos do Azure (Storage, Subscription).
* *Custom Topics:* Tópicos que **você** cria para seu app enviar eventos personalizados.

2. **Subscriptions (Assinaturas):** A "regra" que diz: "Eu, Azure Function X, quero receber eventos do Tópico Y".
3. **Event Filtering (Filtros):** ⚠️ **Muito Cobrado**.
* Você pode filtrar **antes** de enviar para o código.
* *Subject Filtering:* "Só quero arquivos que terminam em `.jpg`" ou "começam com `/blob/logs`".
* *Advanced Filtering:* Filtra pelo conteúdo do JSON (ex: `data.cor == 'azul'`).

4. **Dead-lettering (Fila de Mensagens Mortas):** Se o Grid tentar entregar para sua API e ela retornar erro 500 (várias vezes), o evento vai para um **Blob Storage** configurado como Dead-letter, para você não perder o dado.
5. **Esquemas (Schemas):**
* **Event Grid Schema:** O JSON padrão da Microsoft.
* **CloudEvents Schema:** Padrão aberto da CNCF (Cloud Native Computing Foundation). Use este se precisar de interoperabilidade entre nuvens (AWS/GCP).

---

### Azure Event Hubs (A "Mangueira de Incêndio" / Streaming) 🌊

O Event Hubs é um serviço de **Ingestão de Big Data**. Ele é feito para receber milhões de eventos por segundo, armazená-los (buffer) e permitir que processadores leiam no ritmo deles.

#### Características Chave para a Prova:

* **Modelo Pull:** O Event Hub recebe os dados e guarda. O seu código (Consumer) conecta lá e **puxa** os dados.
* **Streaming e Telemetria:** Logs de aplicação, coordenadas de GPS de caminhões, dados de sensores IoT, Clickstream de site.
* **Baixa Latência, Alta Vazão:** Feito para aguentar o tranco.

#### Conceitos Técnicos (Obrigatório Decorar):

1. **Partitions (Partições):** ⚠️ **Top 1 do Event Hubs**.
* O Hub divide os dados em "baldes" (Partições) para permitir leitura paralela.
* Você define o número na criação (ex: 4 a 32). **Difícil mudar depois.**
* A ordem dos eventos é garantida **apenas dentro da partição**, não no Hub inteiro.

2. **Consumer Groups (Grupos de Consumidores):**
* Permite que diferentes aplicações leiam o **mesmo fluxo de dados** sem brigar entre si.
* *Exemplo:* O "Grupo Analytics" lê os dados para gerar Dashboard. O "Grupo Arquivo" lê os **mesmos** dados para salvar backup. Cada grupo tem seu próprio "cursor" (ponteiro de onde parou de ler).

3. **Event Hubs Capture (Captura):** ⚠️ **Resposta de Prova**.
* Se a questão disser: *"Precisamos salvar todos os dados brutos recebidos no Event Hub diretamente em um Blob Storage ou Data Lake para análise histórica, **sem escrever nenhum código**."*
* **Resposta:** Habilitar o recurso **Capture**. Ele salva arquivos `.avro` automaticamente.

4. **Throughput Units (TUs):** É como você paga e escala a capacidade.

---

### Resumo Comparativo: A "Tabela da Verdade" ⚔️

| Característica | Event Grid | Event Hubs |
| --- | --- | --- |
| **Objetivo** | Reagir a mudanças de estado. | Ingestão de Telemetria/Logs. |
| **Comportamento** | Push (Empurra). | Pull (Puxa). |
| **Volume** | Baixo volume, alto valor por evento. | Milhões de eventos, valor agregado. |
| **Ordem** | Não garantida. | Garantida por partição. |
| **Exemplo** | "Foto carregada, dispare a função". | "Temperaturas de 1000 termômetros a cada segundo". |
| **Destaque Prova** | Filtros avançados, Integração Serverless. | Partições, Consumer Groups, Capture. |

---

### Simulado Prático: Grid vs Hub 🧠

**Cenário 1: IoT Industrial**
Você tem 50.000 sensores em uma fábrica enviando dados de voltagem a cada segundo. Você precisa analisar esses dados em tempo real para detectar anomalias e, simultaneamente, salvar todos os dados brutos em um Data Lake para treinar uma IA no futuro.
Qual arquitetura você usa?

A) IoT Hub -> Event Grid -> Azure Function.

B) Event Hubs com Capture habilitado e 2 Consumer Groups.

C) Service Bus Queue com Sessions habilitadas.

D) Event Grid com Tópico Customizado salvando em Storage.

**Cenário 2: Processamento de RH**
Sempre que um novo funcionário é cadastrado no sistema de RH (ERP), um evento é gerado. Você precisa que esse evento dispare 3 ações independentes:

1. Criar conta no AD.
2. Encomendar um crachá (API externa).
3. Enviar email de boas-vindas.
Se o sistema de crachá estiver fora do ar, o sistema não pode travar, e deve tentar de novo mais tarde. As ações ocorrem poucas vezes ao dia.

A) Event Hubs.

B) Event Grid com Logic Apps.

C) Azure Queue Storage.

D) Notification Hubs.

**Cenário 3: Filtragem Inteligente**
Você tem um sistema de upload de documentos. Você quer disparar uma Azure Function específica **apenas** quando o arquivo carregado no Blob Storage for do tipo `.pdf` e estiver na pasta `/contratos`. Arquivos `.jpg` ou em outras pastas devem ser ignorados para não gastar processamento.

A) Configurar um Event Hub e filtrar no código da Function (`if file == pdf`).

B) Configurar um Event Grid Subscription com Subject Filtering (EndsWith `.pdf` e BeginsWith `/contratos`).

C) Configurar um Service Bus Topic com Subscription Filters.

D) Configurar um Blob Trigger na Azure Function.

*(Respostas abaixo)*

.

.

.

.

.

.

.

.

**Respostas Comentadas:**

1. **B (Event Hubs).**
* *Por que?* Alto volume (50k sensores/seg) = Streaming.
* *Capture:* Resolve o requisito de "salvar dados brutos no Data Lake".
* *Consumer Groups:* Permite que a análise em tempo real e o backup ocorram ao mesmo tempo.

2. **B (Event Grid).**
* *Por que?* É um evento discreto ("Novo funcionário"). Baixo volume. Modelo Reativo ("Quando X acontecer, faça Y, Z e W"). O Grid pode fazer "Fan-out" (enviar o mesmo evento para 3 lugares).
* *Nota:* Service Bus Topics também funcionariam bem aqui (pela garantia de entrega/retry robusto), mas em cenários de "reagir a eventos", o Grid é a resposta "moderna" serverless. Se a questão focar pesadamente em **transação financeira** ou **ordem complexa**, Service Bus ganha.

3. **B (Event Grid Filtering).**
* *Por que?* A filtragem nativa do Grid (Subject Filtering) é a forma mais eficiente e barata. O evento nem chega na sua Function se não for PDF, economizando dinheiro.
* *Blob Trigger (D):* Funciona, mas o Blob Trigger tem atrasos (pode levar até 10 min no plano Consumption) e custa mais caro pois a Function roda para verificar. Grid é instantâneo.

---

## Lab Event Grid

Foi realizado um lab mão na massa onde você pode encontrar mais documentações sobre [aqui](./lab-event-grid/README.md).