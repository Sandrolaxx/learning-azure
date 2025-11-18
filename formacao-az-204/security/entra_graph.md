## Microsoft Entra ID (Antigo Azure AD) 🔐

O Entra ID é o serviço de gerenciamento de identidade e acesso. Para a prova, você precisa dominar 3 conceitos fundamentais:

### Objetos de Aplicação e Service Principals

Entenda essa distinção, pois cai muito:

**Application Object (O "Molde"):** Quando você registra um app no portal ("App Registration"), você cria a definição global dele. Define o nome, logo, e quais permissões ele *pode* pedir.
**Service Principal (A "Instância"):** É a **identidade** da aplicação em um tenant específico.
* *Analogia:* O "Application Object" é a classe (código); o "Service Principal" é o objeto instanciado (runtime).
* Para que seu código acesse o Azure, ele precisa de um Service Principal.
* Permissões são concedidas ao Service Principal.

### Managed Identities (Identidades Gerenciadas) ⚠️ TOP 1 DA PROVA

A "bala de prata" para eliminar credenciais (senhas/secrets) do seu código.

Em vez de colocar uma Connection String com senha no `appsettings.json`, você usa a identidade do próprio recurso do Azure.

**System-Assigned (Atribuída pelo Sistema):**
* Criada diretamente no recurso (ex: ligo um switch no App Service).
* **Ciclo de Vida:** Nasce e morre com o recurso. Se deletar o App Service, a identidade some.
* *Uso:* Relação 1:1. Simples, para um único recurso.

**User-Assigned (Atribuída pelo Usuário):**
* Você cria um recurso de identidade separado (recurso independente).
* Você atribui essa identidade a vários serviços (ex: 5 App Services usando a mesma identidade).
* **Ciclo de Vida:** Independente. Se deletar o App, a identidade continua lá.
* *Uso:* Relação 1:N. Ideal para compartilhar permissões entre várias aplicações.

### Microsoft Authentication Library (MSAL)

Esqueça a ADAL. Se a prova mencionar ADAL, é "pegadinha" ou questão antiga. **A resposta certa é sempre MSAL (Microsoft.Identity.Client).**

* A MSAL gerencia a aquisição, cache e renovação de tokens.
* **Tokens:**
* **Access Token:** Usado para chamar APIs (autorização - OAuth 2.0).
* **ID Token:** Prova quem o usuário é (autenticação - OIDC).
* **Refresh Token:** Usado pela MSAL para pegar novos Access Tokens sem pedir login de novo.

---

## Permissões e Consentimento (Delegated vs. Application)

Aqui é onde você define **o que** o app pode fazer. A prova AZ-204 exige que você saiba diferenciar qual tipo de permissão escolher.

| Tipo de Permissão | Contexto ("Em nome de quem?") | Interação do Usuário | Exemplo de Cenário | Requer Consentimento Admin? |
| --- | --- | --- | --- | --- |
| **Delegated** (Delegada) | Em nome do **Usuário Logado**. | **Sim** (Usuário está presente). | Um app móvel que lê o calendário do *próprio usuário*. | Depende (Para coisas básicas não, para sensíveis sim). |
| **Application** (Aplicativo) | Em nome do **Próprio App** (Background). | **Não** (Daemon/Job noturno). | Um serviço que varre o correio de *todos os usuários* à noite para backup. | **SIM, SEMPRE.** |

> **Dica de Prova:** Se a questão disser "O aplicativo roda como um serviço em background sem usuário logado", a resposta obrigatória é **Application Permissions** (e vai exigir Consentimento de Admin).

---

## Microsoft Graph📊

O Microsoft Graph é a "porta única" (API REST unificada) para acessar dados de todo o ecossistema Microsoft 365 (Usuários, Grupos, Emails, Calendários, Teams).

* **Endpoint:** `https://graph.microsoft.com/v1.0/`

### Microsoft Graph SDK

Embora seja uma API REST, na prova eles preferem o uso do SDK.

```csharp
// Snippet clássico de prova (C#)
var scopes = new[] { "User.Read" };
var tenantId = "seu-tenant-id";
var clientId = "seu-client-id";

// Usando DefaultAzureCredential (busca Managed Identity ou Variáveis de Ambiente)
var options = new TokenCredentialOptions { AuthorityHost = AzureAuthorityHosts.AzurePublicCloud };
var clientSecretCredential = new ClientSecretCredential(tenantId, clientId, clientSecret, options);

var graphClient = new GraphServiceClient(clientSecretCredential, scopes);
```

### OData Queries (Sintaxe de Consulta)

Você precisa saber filtrar dados para não trazer a base inteira (performance). A Microsoft usa o padrão **OData**.

Parâmetros comuns na prova:

* `$select`: Escolhe quais colunas retornar (ex: só nome e email).
* `GET /users?$select=displayName,mail`

* `$filter`: Filtra linhas (cláusula WHERE).
* `GET /users?$filter=startsWith(displayName, 'J')`
* **Atenção:** Operadores são `eq` (igual), `ne` (não igual), `ge` (maior ou igual), `and`, `or`. Não use `==` ou `>`.

* `$top`: Limita resultados (ex: top 10).
* `GET /users?$top=5`

* `$orderby`: Ordenação.
* `GET /users?$orderby=displayName desc`

> **Pegadinha Clássica:** "Você precisa buscar todos os usuários cujo email começa com 'admin'. Qual a query correta?"
> * Errado: `SELECT * FROM users WHERE email LIKE 'admin%'` (Isso é SQL).
> * Certo: `GET /users?$filter=startswith(mail, 'admin')` (Isso é OData).

---

## Shared Access Signatures (SAS) vs Entra ID

A prova muitas vezes pede para escolher entre os dois para acessar **Storage Accounts**.

| Método | Quando usar? | Revogação |
| --- | --- | --- |
| **Entra ID (Recomendado)** | Sempre que possível. Melhor segurança, logs auditáveis, não gerencia chaves. | Remove o usuário/permissão no AD. Imediato. |
| **SAS Token** | Quando o cliente não tem conta no AD (ex: app mobile de terceiro, upload temporário de usuário anônimo). | Difícil (requer expiração curta ou Stored Access Policy). |

---

## Simulado Rápido de Fixação 🧠

**Cenário 1:**
Você está desenvolvendo um aplicativo web que permite aos usuários da sua empresa agendarem reuniões. O aplicativo precisa ler o calendário **do usuário que está logado** para verificar disponibilidade.
Qual tipo de permissão você deve configurar no Entra ID?
A) Application Permission: `Calendars.Read`.

B) Delegated Permission: `Calendars.Read`.

C) Application Permission: `Calendars.ReadWrite`.

D) Delegated Permission: `Directory.Read.All`.

**Cenário 2:**
Você tem um Azure Function que roda toda madrugada para gerar relatórios. Ele precisa ler dados de um Blob Storage. Você não quer armazenar chaves de acesso (Access Keys) ou Connection Strings no código ou nas configurações.
O que você deve fazer?
A) Usar uma SAS Token com validade de 1 ano.

B) Armazenar a Access Key no Azure Key Vault.

C) Habilitar a System-Assigned Managed Identity na Function e dar permissão de "Blob Data Reader" (RBAC) no Storage.

D) Criar um Service Principal e hard-code o Client Secret no código.

**Cenário 3:**
Você precisa fazer uma query no Microsoft Graph para listar os nomes de todos os usuários, mas a resposta está vindo muito pesada com dados desnecessários (foto, endereço, telefone). Você quer receber **apenas** o `displayName`.
Qual parâmetro OData você usa?

A) `$filter=displayName`

B) `$select=displayName`

C) `$query=displayName`

D) `$project=displayName`

*(Respostas abaixo)*
.

.

.

.

.

.

**Gabarito:**

1. **B (Delegated Permission).** O app age em nome do usuário logado ("Me"). Application Permission daria acesso a *todos* os calendários da empresa, o que é inseguro e excessivo (Princípio do Menor Privilégio).
2. **C (Managed Identity).** É a única opção que **elimina** o gerenciamento de credenciais. Key Vault (B) é seguro, mas você ainda precisaria de uma credencial para acessar o Key Vault. Managed Identity resolve o problema da "credencial zero".
3. **B (`$select`).** `$filter` é para restringir linhas (quem), `$select` é para restringir colunas (quais dados).