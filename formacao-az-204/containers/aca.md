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

Vamos aprofundar nos detalhes técnicos do **Azure Container Apps (ACA)** sobre Rede e Segredos, e depois cobrir o essencial de **AKS** para garantir que você esteja preparado para o exame.

---

### Ingress (Entrada de Tráfego)

No ACA, o "Ingress" é a porta de entrada para seu aplicativo. A prova explora as diferenças de visibilidade e configuração.

**Tipos de Ingress (Visibilidade):**
1. **External:** Aceita tráfego da **Internet Pública**. O ACA gera automaticamente uma URL HTTPS (`https://meu-app.regiao.azurecontainerapps.io`).
2. **Internal:** Aceita tráfego **apenas de dentro do Environment (VNET)**. Ideal para microserviços de backend que não devem ser expostos ao mundo.
* *Dica de Prova:* Se um serviço de backend precisa ser acessado apenas pelo frontend, configure o Ingress como **Internal**.

**Configurações Importantes:**
* **Target Port:** A porta onde seu container está escutando (ex: 8080). O Ingress recebe na 443 (HTTPS) e roteia para essa porta interna.
* **Transport:**
* `Auto`: O padrão (HTTP/1.1 ou HTTP/2).
* `HTTP/2`: Se precisar de gRPC ou alta performance.
* `TCP`: Para protocolos não-HTTP (ex: Redis customizado), mas requer configuração específica de porta.

**Traffic Splitting (Divisão de Tráfego) 🚦:**
* Funciona apenas com Ingress habilitado.
* Você define **pesos** (weights) entre revisões.
* *Exemplo:* Revision A (80%) | Revision B (20%).
* **Labels:** Você pode dar um nome para uma revisão (ex: "staging") que gera uma URL única, permitindo testar diretamente aquela versão sem afetar o tráfego principal.

### Secrets (Gerenciamento de Segredos) 🔒

Nunca coloque senhas no código ou nas variáveis de ambiente em texto plano.

* **Onde ficam:** Os segredos são armazenados no nível do **Container App**, criptografados em repouso.
* **Como usar:**
    1. **Definir:** Você cria o segredo no menu "Secrets" (chave/valor).
    2. **Referenciar:** Nas variáveis de ambiente do container, você escolhe "Source = Secret" e aponta para a chave criada.


* *Resultado:* O código vê uma variável de ambiente normal, mas a origem é segura.

**Integração com Key Vault (Nível Prova):** 🔑
* Você pode (e deve) usar o **Azure Key Vault** para guardar os segredos reais.
* No ACA, você usa uma **Managed Identity** para dar permissão ao ACA de ler o Key Vault.
* Ao criar o segredo no ACA, você usa a referência: `keyvaultref:<URL-do-Segredo>`.
* *Vantagem:* Se você rotacionar a senha no Key Vault, o ACA pega a nova versão (pode exigir restart da revisão dependendo da configuração).

---

### Cenário Desafio (Simulado)

**Questão 1:** Você tem uma API de processamento de imagens que recebe picos enormes de tráfego imprevisível durante eventos esportivos.

1. Nos momentos sem jogos, o tráfego é nulo e você **não quer pagar nada**.
2. Quando o tráfego sobe, você precisa escalar rapidamente baseado no número de mensagens numa fila do RabbitMQ.
3. Você quer testar uma nova versão do processador enviando apenas 5% das imagens para o novo código, sem derrubar o antigo.

**Qual solução você escolhe e como configura?**

A) **ACI** com um Logic App para monitorar a fila.

B) **AKS** com Cluster Autoscaler.

C) **Azure Container Apps** com regra de escala KEDA e Revision Mode "Multiple".

D) **App Service** com Autoscale baseado em CPU.

**Questão 2:**
Você está configurando um Container App que precisa se conectar a um banco de dados legado on-premise via VPN. A equipe de segurança exige que o aplicativo não seja acessível pela internet pública, apenas por outros apps na mesma rede virtual.
Como você configura o Ingress?

A) External com restrição de IP.

B) Internal.

C) Desabilitado.

D) External com porta TCP customizada.

*(Resposta Comentada)*
.

.

.

.

.

.

.

.

**Questão 1 - Resposta C (Azure Container Apps).**

* **Por que C?**
1. *Scale to Zero:* Requisito vital (não pagar nada sem jogos).
2. *KEDA:* Escala nativamente com RabbitMQ (baseado em eventos, não CPU).
3. *Revision Mode:* O recurso de "Traffic Splitting" (5% para v2) é nativo do ACA.

* *Por que não B?* O AKS demoraria para escalar os nós e você pagaria pela infraestrutura ociosa (System Node Pool).s
* *Por que não A?* ACI não tem orquestrador nativo para Traffic Splitting complexo ou gestão de revisões.

**Questão 2 - Resposta B (Internal). Garante que o app só é visível dentro do Environment/VNET.**
