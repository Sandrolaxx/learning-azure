# Lab Entra ID - Aplicação Web com Autenticação

Aplicação web simples demonstrando autenticação com **Microsoft Entra ID** (anteriormente Azure AD) usando MSAL Node.

## 🎯 Características

- ✅ **Área Pública**: Página inicial acessível sem autenticação
- 🔒 **Área Protegida**: Página de perfil que requer autenticação
- 🔐 **Autenticação OAuth 2.0**: Integração com Microsoft Entra ID
- 👤 **Informações do Usuário**: Exibe dados do usuário autenticado
- 🚪 **Logout**: Encerramento de sessão completo

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Conta no Azure com acesso ao Microsoft Entra ID
- Aplicativo registrado no Azure AD

## 🚀 Configuração do Azure AD

### 1. Registrar Aplicativo no Azure Portal

1. Acesse o [Portal do Azure](https://portal.azure.com)
2. Vá para **Microsoft Entra ID** > **App registrations** > **New registration**
3. Configure:
   - **Name**: `Lab-Entra-ID-App` (ou nome de sua preferência)
   - **Supported account types**: Escolha a opção apropriada
   - **Redirect URI**: 
     - Tipo: `Web`
     - URI: `http://localhost:3000/auth/redirect`
4. Clique em **Register**

### 2. Configurar Client Secret

1. No aplicativo registrado, vá para **Certificates & secrets**
2. Clique em **New client secret**
3. Adicione uma descrição e escolha a validade
4. **IMPORTANTE**: Copie o valor do secret imediatamente (não será mostrado novamente)

### 3. Copiar IDs Necessários

No painel **Overview** do seu aplicativo, copie:
- **Application (client) ID**
- **Directory (tenant) ID**

## 💻 Instalação Local

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Azure AD:

```env
# Azure AD (Microsoft Entra ID) Configuration
CLIENT_ID=seu-client-id-aqui
CLIENT_SECRET=seu-client-secret-aqui
TENANT_ID=seu-tenant-id-aqui
REDIRECT_URI=http://localhost:3000/auth/redirect
POST_LOGOUT_REDIRECT_URI=http://localhost:3000

# App Configuration
PORT=3000
SESSION_SECRET=sua-chave-secreta-aleatoria-aqui
```

### 3. Executar a Aplicação

Modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```

Modo de produção:
```bash
npm start
```

A aplicação estará disponível em: **http://localhost:3000**

## 📁 Estrutura do Projeto

```
lab-entra-id/
├── app.js                 # Servidor Express principal
├── authConfig.js          # Configuração MSAL
├── package.json           # Dependências do projeto
├── .env                   # Variáveis de ambiente (não versionado)
├── .env.example           # Exemplo de configuração
├── .gitignore            # Arquivos ignorados pelo Git
└── public/               # Arquivos estáticos
    ├── index.html        # Página pública (home)
    └── profile.html      # Página protegida (perfil)
```

## 🔍 Funcionalidades

### Área Pública
- **Rota**: `/`
- **Descrição**: Página inicial acessível a todos
- **Recursos**: 
  - Informações sobre a aplicação
  - Botão para fazer login
  - Link para área protegida

### Área Autenticada
- **Rota**: `/profile`
- **Descrição**: Página de perfil do usuário (requer autenticação)
- **Recursos**:
  - Informações do usuário logado
  - Nome e email
  - ID da conta
  - Botão de logout

### Rotas da API

| Rota | Método | Autenticação | Descrição |
|------|--------|-------------|-----------|
| `/` | GET | ❌ Não | Página inicial (pública) |
| `/auth/signin` | GET | ❌ Não | Inicia processo de login |
| `/auth/redirect` | GET | ❌ Não | Callback do Azure AD |
| `/profile` | GET | ✅ Sim | Página de perfil |
| `/api/userinfo` | GET | ✅ Sim | API com dados do usuário |
| `/auth/signout` | GET | ✅ Sim | Encerra sessão |

## 🔐 Fluxo de Autenticação

1. **Usuário acessa a aplicação** → Vê a página pública
2. **Clica em "Fazer Login"** → Redireciona para Azure AD
3. **Faz login no Azure AD** → Autentica com credenciais Microsoft
4. **Azure AD retorna código** → Aplicação recebe callback
5. **Aplicação troca código por token** → MSAL obtém access token
6. **Sessão criada** → Usuário autenticado
7. **Acesso à área protegida** → Perfil exibido
8. **Logout** → Sessão destruída e logout no Azure AD

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **@azure/msal-node**: Microsoft Authentication Library
- **express-session**: Gerenciamento de sessões
- **dotenv**: Carregamento de variáveis de ambiente

## 🔧 Troubleshooting

### Erro: "AADSTS50011: The reply URL specified in the request does not match"

**Solução**: Verifique se a URL de redirect no Azure AD corresponde exatamente ao valor em `REDIRECT_URI` no `.env`.

### Erro: "Invalid client secret"

**Solução**: Verifique se o `CLIENT_SECRET` está correto. Se expirou, gere um novo no Azure Portal.

### Erro: "Session is not authenticated"

**Solução**: Limpe os cookies do navegador e tente fazer login novamente.

### Porta 3000 já em uso

**Solução**: Altere o valor de `PORT` no arquivo `.env` para outra porta disponível.

## 📚 Recursos Adicionais

- [Documentação MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)
- [Microsoft Entra ID Documentation](https://learn.microsoft.com/azure/active-directory/)
- [Azure AD Authentication Flows](https://learn.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios)

## 📝 Notas de Segurança

- ⚠️ Nunca commite o arquivo `.env` com credenciais reais
- ⚠️ Em produção, use HTTPS e configure `secure: true` nos cookies
- ⚠️ Troque o `SESSION_SECRET` para um valor aleatório forte
- ⚠️ Mantenha as dependências atualizadas

## 📄 Licença

Este projeto é para fins educacionais como parte do treinamento AZ-204.

---

**Desenvolvido para o laboratório de Microsoft Entra ID - Formação AZ-204**
