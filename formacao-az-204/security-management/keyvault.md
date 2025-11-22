# Azure Key Vault (O Cofre) 🔑

O Key Vault é o serviço para armazenar segredos com segurança (criptografado via Hardware Security Modules - HSMs).

#### Os Três Tipos de Artefatos (Decorar!)

A prova vai perguntar qual tipo de objeto criar para cada cenário:

1. **Secrets (Segredos):** É o que 99% dos desenvolvedores usam.
* Armazena: Connection Strings, Senhas, Tokens de API, Certificados PFX (como string base64).
* Ação: Você lê e escreve o valor (ex: `GetSecret("SenhaBanco")`).


2. **Keys (Chaves):** Usadas para Criptografia.
* Armazena: Chaves RSA ou EC.
* Ação: Você **não vê** a chave privada. Você pede ao Key Vault: *"Por favor, assine este hash com a sua chave"* ou *"Descriptografe este texto"*. O material da chave nunca sai do cofre.


3. **Certificates (Certificados):** Gestão de ciclo de vida de SSL/TLS.
* Gerencia renovação automática de certificados (ex: DigiCert ou Self-Signed) e integra com App Service.

## Controle de Acesso: Access Policies vs. RBAC 🛡️

Essa é a "casca de banana" clássica. Existem dois modelos de permissão:

* **Vault Access Policies (Modelo Antigo/Legado):**
* Você define: "O usuário X pode fazer GET e LIST em Segredos".
* Problema: É "tudo ou nada" dentro do cofre (ou você tem acesso a todos os segredos, ou nenhum), a menos que configure permissões item a item (complexo).


* **Azure RBAC (Modelo Novo/Recomendado):**
* Usa as roles do IAM (`Key Vault Secrets User`, `Key Vault Crypto Officer`).
* Permite controle granular e centralizado.
* **Na prova:** Se a questão pedir "Gestão simplificada usando roles padrão do Azure", a resposta é **RBAC**.



#### Proteção contra Exclusão (Safety Nets)

* **Soft Delete (Exclusão Suave):** Funciona como uma Lixeira. Se você deletar um cofre ou segredo, ele fica em estado de "soft deleted" por 90 dias (padrão). Você pode recuperar (undelete).
* **Purge Protection:** Impede que você "esvazie a lixeira" antes do prazo. Obrigatório para produção crítica.

---

## Managed Identities no Fluxo do Key Vault 🆔

Como seu código acessa o cofre sem ter a senha do cofre?
Aqui entra a **Identidade Gerenciada** que vimos antes.

**O Fluxo da Prova (Passo a Passo):**

1. **Habilitar:** Ative a Managed Identity (System-Assigned) no seu App Service/Function.
2. **Autorizar:** Vá no Key Vault > Access Control (IAM) e dê a role **"Key Vault Secrets User"** para a identidade do App Service.
3. **Codificar:** No código (C#), use a classe `DefaultAzureCredential`. Ela detecta a identidade automaticamente.

```csharp
// O SDK Azure.Identity faz a mágica.
// Ele tenta: Variáveis de Ambiente -> Managed Identity -> Visual Studio Login
var client = new SecretClient(new Uri("https://meu-cofre.vault.azure.net/"), new DefaultAzureCredential());

KeyVaultSecret secret = await client.GetSecretAsync("MinhaSenhaDB");
Console.WriteLine(secret.Value);

```

---

## Azure App Configuration (O Gerente de Configurações) ⚙️

Por que usar isso se já tenho o Key Vault?

* **Key Vault:** É caro e tem limite de requisições. Feito para **Segredos**.
* **App Configuration:** É barato e feito para **Configurações Hierárquicas** e **Feature Flags**.

#### A Integração Perfeita: Key Vault References

Você centraliza tudo no App Configuration.

* Chave `CorDeFundo`: Valor "Azul" (Texto simples, guardado no App Config).
* Chave `SenhaBanco`: Valor `@Microsoft.KeyVault(...)` (Referência).

Quando seu app pede a `SenhaBanco` para o App Config, o App Config diz: *"Não tenho o valor, mas sei quem tem. Vá no Key Vault X e pegue"*. O SDK faz isso transparente para você.

**Vantagem na Prova:** Você gerencia tudo num lugar só, mas mantém a segurança dos segredos no cofre.

#### Feature Flags (Feature Management) 🚩

Tópico quente no AZ-204.

* Permite ligar/desligar funcionalidades em produção sem deploy (`if (featureManager.IsEnabledAsync("BetaDashboard"))`).
* **Feature Manager:** É a biblioteca do .NET que gerencia isso.
* Você pode configurar filtros: "Ligar apenas para 50% dos usuários" ou "Ligar apenas para usuários do Brasil".

---

### Resumão para Decisão Rápida (Cheat Sheet)

| Necessidade | Serviço Correto |
| --- | --- |
| Guardar senhas, chaves privadas, certificados. | **Azure Key Vault** |
| Guardar URLs, configurações de UI, Feature Flags. | **App Configuration** |
| Guardar chaves de criptografia de disco (Disk Encryption). | **Azure Key Vault (Keys)** |
| Alterar comportamento do app sem redeploy. | **App Configuration (Feature Flags)** |
| Centralizar configs de 10 microserviços e seus segredos. | **App Config** (com **Key Vault References**) |

---

### Simulado Prático 🧠

**Cenário 1:**
Você está migrando uma aplicação .NET para o Azure App Service. O código atual lê a string de conexão do banco de dados do `web.config`.
Por requisitos de segurança, nenhuma senha pode ficar em arquivos de texto. Você precisa armazenar a senha de forma segura e acessá-la sem colocar credenciais no código.
Qual a sequência de passos correta?

A) Criar um Key Vault, salvar a senha como Secret, habilitar Managed Identity no App Service, criar uma Access Policy no Vault dando permissão "Get" para a identidade.

B) Criar um App Configuration, salvar a senha como texto plano, usar a connection string do App Configuration no código.

C) Criar um Key Vault, salvar a senha como Key, usar o certificado do App Service para descriptografar.

D) Salvar a senha nas "Application Settings" do App Service e criptografar o valor manualmente.

**Cenário 2:**
Você utiliza o Azure App Configuration para gerenciar as configurações do seu sistema distribuído. Você tem uma nova funcionalidade de "Checkout Rápido" que está instável. Você quer desabilitá-la imediatamente para todos os usuários sem precisar fazer um novo deploy ou reiniciar os servidores.
O que você usa?

A) Key Vault Secrets com expiração definida.

B) App Configuration Sentinel Key.

C) App Configuration Feature Manager (Feature Flag).

D) Azure Traffic Manager.

**Cenário 3:**
Um desenvolvedor júnior(🤡) deletou acidentalmente um Key Vault de produção contendo chaves de criptografia críticas.
Qual recurso permitiria a recuperação desse cofre, e qual recurso garantiria que nem mesmo um administrador pudesse deletar permanentemente o cofre imediatamente?

A) Backup Restore e Resource Lock.

B) Soft Delete e Purge Protection.

C) Versionamento e RBAC.

D) Site Recovery e Policy.

*(Respostas abaixo)*

.

.

.

.

.

.

.

**Respostas:**

1. **A (Key Vault + Managed Identity).** É o padrão ouro. Você move o segredo para o cofre e usa a identidade do servidor para buscar.
2. **C (Feature Flag).** É exatamente para isso que serve: controle de fluxo de funcionalidades em tempo real (on/off switches).
3. **B (Soft Delete e Purge Protection).**
* *Soft Delete:* Permite recuperar (undelete) o cofre.
* *Purge Protection:* Impede que o "Soft Deleted" seja purgado (excluído de vez) antes do tempo de retenção obrigatório.