## APIM - API Management

Pense no APIM como um **Proxy Reverso Anabolizado**. Ele fica na frente dos seus serviços (App Service, Functions, AKS) e adiciona segurança, monitoramento e transformação sem você precisar tocar no código do backend.

### A Estrutura Lógica

Você precisa entender como as coisas se encaixam para configurar acessos.

1. **Backend:** O serviço real (sua API em .NET, Node, etc.).
2. **Frontend (API Proxy):** A "casca" que o APIM expõe para o mundo.
3. **Products (Produtos):** É a unidade de empacotamento.
* Você não dá acesso direto a uma API. Você adiciona a API a um **Produto**.
* O desenvolvedor assina o Produto e ganha uma **Subscription Key**.
* *Exemplo:* Produto "Starter" (API de Clima + API de Moeda, com limite baixo). Produto "Premium" (Mesmas APIs, sem limites).

4. **Groups:** Quem pode ver os produtos (Administrators, Developers, Guests).

---

### Políticas (Policies) - O Coração da Prova ❤️

É aqui que caem 80% das questões de APIM. As políticas são regras em formato **XML** que alteram o comportamento da requisição ou da resposta.

#### Os 4 Escopos de Execução (Scopes)

Você precisa saber a ordem em que as coisas acontecem:

1. **Inbound (`<inbound>`):** Executa quando a requisição chega no APIM, **antes** de ir para o backend.
* *Uso:* Validar JWT, checar limites (Rate Limit), remover headers sensíveis.

2. **Backend (`<backend>`):** Executa antes de chamar o serviço real.
* *Uso:* Mudar a URL de destino, configurar timeout.

3. **Outbound (`<outbound>`):** Executa quando a resposta volta do backend, **antes** de ir para o cliente.
* *Uso:* Transformar JSON em XML, adicionar headers de segurança (CORS), caching.

4. **On-Error (`<on-error>`):** Executa se der erro em qualquer etapa anterior.

#### Políticas Específicas que você deve decorar:

* **Rate Limit vs. Quota (CONFUSÃO CLÁSSICA ⚠️):**
* **Rate Limit (Throttling):** Protege contra picos de tráfego (DDoS/Spam). "Máximo de 10 chamadas por **segundo**". Retorna `429 Too Many Requests`.
* **Quota:** Modelo de negócios/monetização. "Seu plano permite 10.000 chamadas por **mês**". Acabou? Só mês que vem.
* *Na prova:* "Evitar sobrecarga momentânea" = Rate Limit. "Limitar uso mensal" = Quota.

* **Mock Response (Simulação):**
* Permite que o time de Frontend trabalhe antes mesmo do Backend estar pronto. O APIM retorna um JSON estático.

* **Caching (`cache-lookup` e `cache-store`):**
* Armazena respostas no cache interno (ou Redis externo) para não bater no backend repetidamente.
* Reduz latência e custo.

* **Transformation:**
* `xml-to-json` / `json-to-xml`: Converte formatos automaticamente (ótimo para modernizar sistemas SOAP legados).

* **CORS (Cross-Origin Resource Sharing):**
* Deve ser configurada na seção `<inbound>` para permitir que navegadores chamem sua API.

---

### Versionamento vs. Revisões (Versions vs Revisions) 🔄

A Microsoft adora perguntar qual usar para "não quebrar o cliente".

| Característica | Revisões (Revisions) | Versionamento (Versions) |
| --- | --- | --- |
| **Objetivo** | Pequenas alterações, testes, não-bloqueante. | Mudanças drásticas (Breaking Changes). |
| **URL** | A URL **não muda** (público). Usa `;rev=2` internamente ou URL privada. | A URL **muda** (ex: `/v1/api`, `/v2/api`). |
| **Consumo** | O consumidor nem sabe que mudou (transparente). | O consumidor escolhe migrar para a v2. |
| **Current** | Você define qual revisão é a "Online" (Current). | Ambas versões rodam ao mesmo tempo indefinidamente. |

> **Dica de Prova:** "Você quer testar uma otimização de performance na API sem afetar os usuários atuais e, se der certo, tornar essa a versão oficial."
> **Resposta:** Criar uma **Revisão**.

---

### Segurança

* **Subscription Key:** O método padrão. Um header (`Ocp-Apim-Subscription-Key`) ou query param. Não é super seguro sozinho.
* **JWT Validation (`validate-jwt`):**
* Política `<inbound>` que verifica um token (gerado pelo Entra ID/Auth0).
* Verifica a assinatura, validade e *claims* (ex: "Só aceita se tiver a claim `role: admin`").


* **IP Filter:** Bloquear ou permitir faixas de IP.
* **Certificados de Cliente (Mutual TLS):** Alta segurança para comunicação B2B.

---

### Backend Serverless (Functions)

O APIM importa Azure Functions facilmente.

* **Vantagem:** Você mascara a URL feia da Function (`meuapp.azurewebsites.net/api/HttpTrigger1...`) para algo limpo (`api.meuapp.com/vendas`).
* Você gerencia as chaves de acesso (Host Keys) dentro do APIM, não no cliente.

---

### Simulado Prático APIM 🧠

**Cenário 1: Proteção e Negócios**
Você tem uma API pública gratuita, mas quer impedir que um único usuário abuse do sistema derrubando o serviço para os outros. Além disso, você quer limitar os usuários gratuitos a 1.000 chamadas por semana.
Quais políticas você aplica no escopo Inbound?

A) `validate-jwt` e `ip-filter`.

B) `rate-limit-by-key` e `quota-by-key`.

C) `mock-response` e `cache-lookup`.

D) `rewrite-uri` e `set-header`.

**Cenário 2: Desenvolvimento Paralelo**
Sua equipe de backend está atrasada na criação da API de "Consulta de Saldo". A equipe de frontend (React) está parada esperando a API existir para testar a tela.
Qual recurso do APIM permite desbloquear o frontend imediatamente sem escrever código C#?

A) Criar uma nova Versão da API.

B) Configurar a política `mock-response` na operação.

C) Usar um `Logic App` como backend.

D) Criar uma Revisão da API.

**Cenário 3: Atualização Segura**
Você descobriu um bug na API de Produção. Você corrigiu e quer implantar, mas tem medo de que a correção gere novos erros. Você quer disponibilizar a correção em uma URL privada para os QAs testarem, enquanto os usuários reais continuam na versão antiga. Se os testes passarem, você vira a chave instantaneamente.
O que você usa?

A) Deployment Slots (do App Service).

B) API Versions (v1, v2).

C) API Revisions.

D) Products (Group Access).

*(Respostas abaixo)*

.

.

.

.

.

.

.

.

**Respostas:**

1. **B (Rate Limit e Quota).**
* `rate-limit-by-key`: Evita o abuso momentâneo (derrubar o serviço).
* `quota-by-key`: Limita o volume semanal (regra de negócio/plano gratuito).
* *Nota:* O sufixo `-by-key` significa que o limite é individual por chave de assinatura (cada usuário tem o seu limite).


2. **B (Mock Response).** Você define no APIM: "Se chamar essa rota, retorne este JSON fixo: `{ 'saldo': 500 }`". O APIM nem chama o backend. O frontend testa feliz.
3. **C (Revisions).** Revisões são para isso. Você cria a Revisão 2. Ela tem uma URL própria para teste. Os usuários continuam na Revisão 1. Quando o QA aprovar, você clica em "Make Current" na Revisão 2 e todo o tráfego muda instantaneamente. (Deployment Slots é do App Service, não do APIM, embora o conceito seja idêntico).