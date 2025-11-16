# Azure Container Apps (ACA)

É a "estrela em ascensão" da prova AZ-204. Ele preenche a lacuna entre a simplicidade do ACI (Azure Container Instances) e a complexidade do AKS (Kubernetes).

Para a prova, o segredo é entender que o ACA é **Kubernetes Serverless**. Ele roda sobre Kubernetes, mas esconde a complexidade (você não vê *nodes*, *master*, *etcd*).

---

### Arquitetura e Conceitos (Vocabulário da Prova)

Você precisa dominar a hierarquia para não confundir "Environment" com "App".

* **Environment (Ambiente):**
    * É a fronteira de segurança e rede.
    * Pense nele como uma **VNET** (Rede Virtual).
    * Todos os Container Apps dentro do mesmo *Environment* podem se comunicar facilmente e compartilham o mesmo Log Analytics.
    * Se você precisa que dois apps estejam isolados (redes diferentes), coloque-os em *Environments* diferentes.

* **Container App:**
    * É o microserviço em si (ex: "Serviço de Carrinho").
    * Suporta **vários containers** (padrão Sidecar), mas eles escalam juntos (como um *Pod* no Kubernetes).

* **Revision (Revisão) ⚠️:**
    * O ACA usa **Imutabilidade**. Toda vez que você altera o código ou uma configuração, uma **nova Revisão** é criada.
    * Isso permite o *Traffic Splitting* (divisão de tráfego), crucial para cenários de **Blue/Green Deployment** ou **Canary Testing**.
* *Modos de Revisão:*
    1. **Single:** A nova versão substitui a antiga imediatamente (zero downtime, mas sem teste A/B).
    2. **Multiple:** Ambas versões rodam simultaneamente. Você decide: "80% do tráfego para a v1 e 20% para a v2".

### Escalabilidade com KEDA (O "Pulo do Gato") 📈

Diferente do App Service (que escala por CPU/RAM), o ACA escala baseado em **Eventos** usando o **KEDA** (Kubernetes Event-driven Autoscaling).

**Scale to Zero (Escalar a Zero):**
* Se não houver eventos (ex: fila vazia, ninguém acessando HTTP), o ACA desliga tudo (0 réplicas). **Custo Zero**.
* Assim que chega uma mensagem, ele liga o container instantaneamente.
* *Comparação:* O AKS padrão não escala a zero facilmente (os Nodes continuam ligados). O ACI cobra por segundo de execução, mas não tem orquestrador de eventos nativo.

**Gatilhos Comuns na Prova:**
* HTTP (número de requisições concorrentes).
* Azure Service Bus / Queue Storage (tamanho da fila).
* Event Hubs.
* Métricas customizadas (CPU/Memória também valem).

---

### Dapr (Microserviços Simplificados) 🧩

O ACA tem integração nativa com o **Dapr** (Distributed Application Runtime).
A prova vai perguntar: *"Como facilitar a comunicação entre microserviços e troca de estado sem mudar o código?"* Resposta: **Dapr**.

* **Sidecars:** O Dapr roda num container auxiliar (sidecar) junto com seu app.
* **Building Blocks (O que ele resolve):**
    1. **Service-to-Service Invocation:** Chama o "Serviço B" pelo nome (`http://localhost:3500/v1.0/invoke/servico-b/...`), sem saber IP ou DNS.
    2. **State Management:** Salva dados (chave-valor) no Redis ou Cosmos DB sem escrever SDK específico do banco.
    3. **Pub/Sub:** Envia mensagens entre serviços sem se preocupar se é RabbitMQ ou Service Bus por baixo.

---

### Cenário Desafio (Simulado)

**Cenário:** Você tem uma API de processamento de imagens que recebe picos enormes de tráfego imprevisível durante eventos esportivos.

1. Nos momentos sem jogos, o tráfego é nulo e você **não quer pagar nada**.
2. Quando o tráfego sobe, você precisa escalar rapidamente baseado no número de mensagens numa fila do RabbitMQ.
3. Você quer testar uma nova versão do processador enviando apenas 5% das imagens para o novo código, sem derrubar o antigo.

**Qual solução você escolhe e como configura?**

A) **ACI** com um Logic App para monitorar a fila.

B) **AKS** com Cluster Autoscaler.

C) **Azure Container Apps** com regra de escala KEDA e Revision Mode "Multiple".

D) **App Service** com Autoscale baseado em CPU.

*(Resposta Comentada)*
.

.

.

.

.

.

.

.

**Resposta C (Azure Container Apps).**

* **Por que C?**
1. *Scale to Zero:* Requisito vital (não pagar nada sem jogos).
2. *KEDA:* Escala nativamente com RabbitMQ (baseado em eventos, não CPU).
3. *Revision Mode:* O recurso de "Traffic Splitting" (5% para v2) é nativo do ACA.


* *Por que não B?* O AKS demoraria para escalar os nós e você pagaria pela infraestrutura ociosa (System Node Pool).
* *Por que não A?* ACI não tem orquestrador nativo para Traffic Splitting complexo ou gestão de revisões.