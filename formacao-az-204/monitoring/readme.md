# Application Insights e Log Analytics

Quanto ao **Monitoramento**, a Microsoft adora cenários onde o código "funciona, mas está lento" ou "quebrou e ninguém sabe porquê".

Aqui o foco muda de *criar* recursos para *observar* o comportamento deles.

### Azure Application Insights (O "Médico" da Aplicação) 🩺

O Application Insights é uma ferramenta de **APM (Application Performance Management)**. Ele monitora o seu código em tempo real.

#### Como habilitar? (Cenário de Prova)

Existem duas formas principais, e você precisa saber quando usar cada uma:

1. **Auto-instrumentation (Sem Código):** Você ativa um botão no Portal do Azure (App Service > Application Insights > Enable).
* *Vantagem:* Não precisa recompilar o código.
* *Uso:* Aplicações .NET, Java, Node.js rodando no App Service.

2. **SDK (Via Código):** Você instala o pacote NuGet/NPM (`Microsoft.ApplicationInsights`).
* *Vantagem:* Permite enviar **Custom Telemetry** (métricas de negócio que o Azure não conhece, ex: `TrackEvent("ItemComprado")`).
* *Uso:* Quando você precisa de controle total ou o app roda fora do Azure (On-premise).

#### Funcionalidades Chave (Vocabulário AZ-204):

* **Application Map:** Cria um mapa visual de todas as dependências. Se o seu site está lento porque o SQL Database está demorando 5 segundos para responder, o Application Map mostra uma seta vermelha entre eles com o tempo de latência.
* **Live Metrics Stream:** Mostra gráficos em **tempo real** (latência de 1 segundo). Útil para monitorar durante um deploy crítico para ver se a CPU explode.
* **Availability Tests (Web Tests):**
* **Standard Test (O novo padrão):** Verifica se seu site está no ar (Ping), valida certificados SSL, verifica verbos HTTP (GET/POST).
* *Na prova:* Se pedir para garantir que o site responde "200 OK" de 5 locais diferentes do mundo, a resposta é **Availability Test**.


* **Smart Detection:** Usa Machine Learning para avisar anomalias sem você configurar nada (ex: "A taxa de falha aumentou anormalmente").

#### Sampling (Amostragem) ⚠️

Este é o tópico técnico mais cobrado. Como reduzir o volume de dados (e o custo) sem perder a estatística?

| Tipo | Descrição | Quando usar? |
| --- | --- | --- |
| **Adaptive Sampling** | **Padrão** no SDK ASP.NET. Ajusta-se automaticamente. Se o tráfego sobe, ele descarta mais itens. | Uso geral. O SDK decide. |
| **Fixed-rate Sampling** | Você define: "Grave apenas 10% de tudo". | Quando você quer controle de custo previsível e sincronia entre cliente/servidor. |
| **Ingestion Sampling** | O descarte ocorre **no servidor do Azure**, não no seu app. | Pior opção (gasta banda de rede enviando tudo, para o Azure jogar fora depois). Use só se não puder mexer no código. |

---

### Azure Log Analytics (O "Cérebro" dos Dados) 🧠

Enquanto o App Insights é a "ferramenta de visualização", o Log Analytics é o **banco de dados** onde tudo fica guardado.

* O App Insights salva seus dados em um **Log Analytics Workspace**.
* Logs de infraestrutura (VMs, Kubernetes) também vão para lá.

#### Kusto Query Language (KQL)

Você **precisa** saber ler uma query básica para a prova. A estrutura é sempre: `Fonte | Filtro | Agrupamento | Visualização`.

**Operadores Obrigatórios:**

1. `where`: Filtra linhas (O "WHERE" do SQL).
* `requests | where duration > 1000` (Requisições lentas).

2. `summarize`: Agrega dados (O "GROUP BY" do SQL).
* `requests | summarize count() by resultCode` (Quantos erros 500 vs 200?).

3. `project`: Seleciona colunas (O "SELECT" do SQL).
* `traces | project timestamp, message`.

4. `take` / `limit`: Pega os primeiros X registros.
5. `render`: Transforma a tabela em gráfico.
* `| render timechart`.

> **Exemplo de Questão:** "Você precisa contar quantas exceções ocorreram na última hora, agrupadas pelo tipo de erro."
**Query:**
```kusto
exceptions
| where timestamp > ago(1h)
| summarize count() by type
```

---

### Alertas e Diagnostic Settings 🔔

* **Diagnostic Settings:** Recursos do Azure (como Key Vault, App Service, Logic Apps) não guardam logs para sempre. Você deve configurar o "Diagnostic Settings" para enviar os logs (Platform Logs) para o Log Analytics.
* **Action Groups:** Um objeto reutilizável que define "Quem avisar".
* Ex: Grupo "OpsTeam" (Manda SMS e Email).
* Se o Alerta disparar, ele chama o Action Group.

---

### Simulado Final de Monitoramento 🏁

**Cenário 1: Custo e Performance**
Sua aplicação está gerando terabytes de logs de telemetria, estourando o orçamento do Azure Monitor. Você precisa reduzir a quantidade de dados ingeridos, mas quer garantir que, se ocorrer um erro (Exception), os logs relacionados (Request, Dependency) sejam mantidos para investigação.
Qual estratégia de amostragem você usa?

A) Ingestion Sampling.

B) Fixed-rate Sampling.

C) Adaptive Sampling (com o SDK configurado corretamente).

D) Desabilitar o Application Insights.

**Cenário 2: KQL na Veia**
Você precisa criar um gráfico de linha que mostre a duração média das requisições do seu site nos últimos 7 dias, em intervalos de 1 hora.
Qual a query correta?

A) `requests | where timestamp > ago(7d) | summarize avg(duration) by bin(timestamp, 1h) | render timechart`

B) `requests | select avg(duration) from timestamp > 7d`

C) `requests | project duration | render barchart`

**Cenário 3: Falha Silenciosa**
Usuários relatam que o botão "Checkout" não funciona, mas o servidor retorna HTTP 200 OK. O problema é que um script JavaScript no navegador do usuário está quebrando.
Onde você vê esse erro?

A) Live Metrics Stream (Server Side).

B) Application Map.

C) Failures Tab (Browser / Client-side exceptions).

D) Distributed Tracing.

*(Respostas abaixo)*

.

.

.

.

.

.

.

.

**Gabarito:**

1. **C (Adaptive Sampling).** Ele é inteligente o suficiente para manter itens relacionados. O Fixed-rate é "cego" (pode salvar o erro mas jogar fora a requisição que causou).
2. **A.** Lembre-se: `summarize` para agregar e `bin(timestamp, tempo)` para criar os "baldes" de tempo no gráfico.
3. **C (Failures - Browser).** Se o erro é JS no cliente, o servidor (Live Metrics/App Map) acha que está tudo bem (200 OK). Você precisa ver a telemetria do *Browser* (que o SDK JS coleta).

---

# Lab implementanto observabilidade

Foi realizado o lab onde utilizamos o Application Insight para monitorar uma API. Para detalhes sobre a documentação completa desse processo clique [aqui](./lab-app-insights/API-Weather/readme.md).