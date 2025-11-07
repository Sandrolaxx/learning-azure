## Detalhes Sobre Configuração App Service

Abaixo onde ficam essas configs no portal, ao acessa o web app temos esses opções:

![Menu web app](https://github.com/user-attachments/assets/e8a0f49a-ab29-4812-9e5a-3765d4a48703)

### Environment Variables (Variáveis de Ambiente)

Antigamente chamado de "Configuration", agora você encontra como **Environment Variables**. É aqui que a mágica da segurança e flexibilidade acontece.

* **App Settings (Configurações do Aplicativo):**
    * **O que são:** Pares chave-valor que sua aplicação lê como variáveis de ambiente.
    * **Uso na Prova:** Elas **sobrescrevem** as configurações do seu `appsettings.json` (ou `web.config`) quando o app sobe no Azure.
    * **Segurança:** Os valores são criptografados em repouso (encrypted at rest).
    * **Exemplo:** Se no seu código local a chave `ApiUrl` é `localhost`, você cria uma App Setting `ApiUrl` com valor `api.producao.com` no Azure. O código lerá o valor do Azure automaticamente.
    * **Atualização**: Ao criar uma env, mesmo que ela exista localmente em um `appsettings.json` (ou `web.config`), ao criar a env e clicar em salvar, a Azure já reestarta e desse modo já aplica a nova env, sem a necessidade e reiniciar a aplicação manualmente.

* **Connection Strings:**
    * Funcionam igual às App Settings, mas são expostas ao código com prefixos específicos dependendo do tipo (SQL, MySQL, etc.).
    * **Dica AZ-204:** Para .NET, o Azure adiciona automaticamente o prefixo ao injetar a variável.

### General Settings (Configurações Gerais)

Fica dentro da aba **Configuration**. Aqui você define a "alma" da infraestrutura do app.

* **Stack Settings:** Define a linguagem e versão (ex: .NET 8, Java 17, Python 3.11). Mudar isso reinicia o app.
* **Platform Settings:**
    * **Bitness:** 32-bit ou 64-bit. (Dica: 32-bit é o padrão para economizar memória em planos menores, mude para 64-bit se precisar de alta performance).
    * **Always On:** **CRÍTICO PARA A PROVA**. Se estiver `Off` (padrão em planos compartilhados), seu app "dorme" após 20 min de inatividade. Para WebJobs ou Apps que precisam responder rápido sempre, **ative o Always On**. (Disponível apenas em planos Basic ou superior).
    * **ARR Affinity (Session Affinity):** Se ativado, o Azure cria um cookie para garantir que o usuário sempre caia na mesma instância (sticky session). Se seu app é *stateless* (o ideal para nuvem), **desligue** isso para melhorar o balanceamento de carga.

### Monitoring & Logs (Monitoramento)

A prova adora perguntar como debugar um erro em produção sem acesso SSH direto.

* **App Service Logs:**
    * **Application Logging (Filesystem):** Logs gerados pelo seu código (`System.out`, `Console.WriteLine`). Útil para debug rápido, desliga sozinho após 12h.
    * **Application Logging (Blob):** Para logs permanentes. Você conecta um Storage Account e os logs vão para lá.
    * **Web Server Logging:** Logs brutos de requisição HTTP (quem acessou o quê).
* **Log Stream:** Permite ver os logs passando em tempo real no console do portal ("tail -f"). Salva vidas em debug.

### Depuração Remota (Remote Debugging)

* Você pode conectar seu Visual Studio local diretamente no processo rodando no Azure para debugar linha a linha.
* **Atenção:** Isso "trava" a thread do processo. **NUNCA** faça isso em um slot de produção que está recebendo tráfego real. Use em slots de Staging/Dev.
* Fica na aba **General Settings** > Debugging. Desliga automaticamente após 48h por segurança.

### TLS/SSL Settings (Certificados)

* **Bindings:** É onde você amarra um certificado a um domínio customizado.
* **App Service Managed Certificates:** Certificados gratuitos que a Microsoft renova para você. Limitação: Só validam o domínio raiz e www, não suportam wildcard (`*.meudominio.com`).
* **HTTPS Only:** Um botão simples que força todo tráfego HTTP a ser redirecionado para HTTPS. **Sempre ative**.

---

### Resumo para a prova (Cheat Sheet):
| Funcionalidade | Palavra-chave / Cenário |
| :--- | :--- |
| **Always On** | App "dormindo" ou WebJobs não rodando. (Requer Basic+). |
| **App Settings** | Guardar segredos/configs sem mudar código. Sobrescreve local. |
| **Remote Debugging** | Erro difícil de reproduzir, usar **apenas** em Dev/Staging. |
| **Log Stream** | Ver erros "agora" em tempo real. |
| **Deployment Slots** | Zero downtime deployment, A/B testing. |