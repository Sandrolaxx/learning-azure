# App Service - Serviço de Aplicativo

É um serviço com base em HTTP para hospedagem de aplicativos Web, APIs REST e back-ends. São executados e dimensionados em ambientes baseados em Windows e Linux.

> **Atenção!** Os serviços utilizando Linux não permitem camada de serviço compartilhada.

**PaaS Puro**: Você foca no código; a Azure gerencia a infraestrutura (OS, patches, load balancing).

**Poliglota**: Suporta .NET, Java, Node.js, Python, PHP e Ruby.

**App Service Plan (O "Coração")**: É o conceito mais importante. O Plano define a "região", o "tamanho da VM" (CPU/RAM) e os recursos (ex: Slots, Backups). Vários Apps podem rodar no mesmo Plano.

**Para a Prova**: Você paga pelo App Service Plan, não pela quantidade de Apps rodando nele (a menos que você precise escalar horizontalmente).

### Suporte a dimensionamento integrado

* Reduza os custos e atenda à demanda por meio de dimensionamento
* Escale horizontalmente/de forma manual ou automatizada com base nas métricas
* Aumente/diminua alterando o plano de serviço do aplicativo

### Suporte à CI/CD

* Azure DevOps
* GitHub
* Bitbucket
* FTP
* Repositório Git local
* E outros

### Slots de implementação

* Implantações de destino ou ambientes de produção para testar
* Personalize quais configurações são trocadas entre os slots
* Pense em pratileiras, podemos realizar canary release

### Planos do Serviço de Aplicativo

* Defina um conjunto de recursos de computação
* Pode executar um ou mais aplicativos no mesmo plano
* Pode ser ampliado ou reduzido a qualquer momento para atender às necessidades de computação ou recursos

### Camadas de uso

* **Compartilhado**: Recursos de computação compartilhados direcionados para teste/desenvolvimento.
* **Básico**: Computação dedicada direcionada para teste/desenvolvimento.
* **Padrão**: Execute cargas de trabalho de produção
* **Premium**: Desempenho e escalabilidade aprimorados
* **Isolado**: Alto desempenho, segurança e isolamento

### Como meu aplicativo é executado e dimensionado?

* **Compartilhado**: Aplicativos recebem minutos de CPU em uma instância compartilhada de VM e não é possível escalar horizontalmente.
* **Outros níveis**: Um aplicativo é executado em todas as instâncias de VM configuradas no Plano do Serviço de Aplicativo.

### Implantar um Serviço de Aplicativo

* **Implantação automatizada**
* * Azure DevOps
* * GitHub
* * Bitbucket
* **Implantação manual**
* * Git
* * CLI
* * Zipdeploy
* * FTP/s
* **Slots de implantação**
* * Implantações de destino ou ambientes de produção para testar
* * Personalize quais configurações são trocadas entre os slots

### Autenticação e a autorização

* Suporte integrado à autenticação e autorização
* * Implementar com poucas ou nenhuma alterções de código em seu aplicativo web.
* Provedores de identidade disponíveis por padrão
* * Plataforma de identidade da Microsoft
* * Facebook
* * Google
* * Twitter
* * Apple
* * OpenID Connect

---

### Redundância de Zona (Zone Redundancy)

Esta é uma configuração crítica para Alta Disponibilidade (HA). **Na prova**, cenários que exigem "resiliência contra falhas de datacenter" geralmente apontam para isso.

**Como funciona?**

Uma Região do Azure (ex: East US) possui múltiplas Zonas de Disponibilidade (Availability Zones - AZs). Cada zona é um datacenter (ou conjunto de datacenters) com energia, resfriamento e rede independentes.

**Distribuição Automática**: A plataforma distribui as instâncias do seu App Service Plan uniformemente entre 3 zonas diferentes na mesma região.

**O "Regra de 3"**: Para que funcione, você deve configurar uma contagem mínima de 3 instâncias (uma para cada zona). Se uma zona cair, o Azure roteia o tráfego para as instâncias nas outras duas zonas saudáveis.

**Configuração**: Geralmente é definida na criação do App Service Plan. Mudar um plano existente para redundante por zona é complexo (muitas vezes exige recriar o recurso), então o design inicial é vital.

Requisitos Técnicos (**Cai na Prova!**)

Nem todo plano suporta isso. Para usar Redundância de Zona, você precisa:
* SKUs Específicas: **Premium v2** (Pv2), **Premium v3** (Pv3) ou **Isolated v2** (App Service Environment). Planos Basic ou Standard não suportam.
* Mínimo de Instâncias: 3 instâncias (pense: 1 worker por zona).

---


### Deployment Slot: Conceitos

Um *Deployment Slot* é, na prática, um **aplicativo web completo e em execução** com seu próprio *hostname* (ex: `meuapp-staging.azurewebsites.net`), mas que vive dentro do mesmo **App Service Plan** que seu app de produção. Na prática resolvem o problema clássico de "como implantar em produção sem derrubar o site"

* **Gratuito (em termos de licença):** Você não paga extra pelo slot em si, pois ele consome a CPU/RAM do mesmo Plano que você já paga.
* **Limitação de Tier (CAI NA PROVA ⚠️):**
    * **Free / Shared / Basic:** **NÃO** suportam slots.
    * **Standard:** Suporta até 5 slots.
    * **Premium / Isolated:** Suporta até 20 slots.

**O Processo de Swap (Troca)**

A mágica acontece quando você faz o **Swap**. A Azure troca os IPs virtuais dos slots. O que estava em "Staging" vira "Produção" e vice-versa.

**Por que isso garante Zero Downtime?**

1.  A Azure "aquece" (warm-up) o slot de origem (staging) enviando requisições na raiz (`/`).
2.  Só depois que o app responde "OK" (HTTP 200), o tráfego real é virado.
3.  Se der erro, o Swap é abortado automaticamente e a produção não é afetada.

**Configurações: O que troca e o que fica? (Sticky Settings)**

Essa é a "pegadinha" clássica de prova. Você precisa saber o que "viaja" com o código e o que "fica grudado" no slot.

* **Configurações que viajam (Swap):**
    * Versão do Framework (.NET, Java, etc).
    * Web Sockets.
    * Configurações gerais do app.
* **Configurações que ficam (Sticky - Slot Specific):**
    * **Endpoints de publicação** (óbvio, pois o endereço muda).
    * **Configurações marcadas como "Deployment slot setting"**.
    * *Exemplo clássico:* **Connection Strings**. Você quer que o slot de Staging aponte para o banco de teste, e o de Produção para o banco real. Ao fazer o swap, a string de conexão *não* deve ir junto com o código, ela deve "ficar" no slot para proteger o banco de produção.

**Tipos de Swap (Variações na Prova)**

1.  **Manual Swap:** O padrão. Você clica, ele aquece e troca.
2.  **Auto Swap:** Configurado para trocar automaticamente assim que você faz um *deploy* no slot de staging. Útil para CI/CD ágil (DevOps), mas perigoso se não tiver testes automatizados robustos.
3.  **Swap with Preview:**
    * *Passo 1:* A Azure aplica as configurações da Produção no slot de Staging (para ver se quebra algo), mas **não vira a chave ainda**.
    * *Passo 2:* Você testa o app manualmente no slot de Staging (que agora está rodando com configurações de produção).
    * *Passo 3:* Você "completa" o swap.
    * *Uso:* Cenários críticos onde você precisa validar manualmente antes de virar.

**Traffic Routing (Canary Deployment)**

Você pode direcionar uma porcentagem do tráfego (ex: 10%) para um slot de teste *antes* de fazer o swap total.
* **Nome na prova:** "Testing in production" ou "Canary release".
* O usuário vê a versão nova, se der erro, você reverte o tráfego para 0%.