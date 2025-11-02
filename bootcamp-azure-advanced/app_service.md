# Azure App Service

O **Azure App Service** é uma plataforma de hospedagem totalmente gerenciada pela Microsoft que permite criar, implantar e escalar aplicações web, APIs REST e backends móveis de forma rápida e simples.

Com o App Service, você pode rodar aplicações em várias linguagens, como **.NET**, **Java**, **Node.js**, **Python**, **PHP** e **Ruby**, sem se preocupar com infraestrutura.

### Principais benefícios:

- **Gerenciamento automático de infraestrutura**: o Azure cuida de servidores, segurança, escalabilidade e atualizações.
- **Escalabilidade fácil**: aumenta ou reduz a capacidade automaticamente com poucas configurações.
- **Integração com DevOps**: suporte nativo para CI/CD via GitHub, Azure DevOps, Bitbucket e outros.
- **Alta disponibilidade**: balanceamento de carga integrado e suporte a zonas de disponibilidade.
- **Segurança embutida**: integração com Azure Active Directory, SSL/TLS automático, e gerenciamento de identidade.
- **Ambientes de produção e staging**: slots de implantação que permitem atualizações sem downtime.

### Exemplos de aplicações que podem ser hospedadas:

- Sites e portais corporativos
- APIs RESTful
- Aplicações SaaS
- Backends de apps móveis

O **Azure App Service** é ideal para quem quer focar no **código** e no **negócio**, deixando a responsabilidade da infraestrutura e da escalabilidade para a nuvem Azure.

---

## O Azure App Service dá suporte a contêineres?

O **Azure App Service** oferece suporte nativo a aplicações baseadas em **contêineres**.

Você pode:
- **Rodar um único contêiner**: direto a partir de uma imagem (Docker Hub, Azure Container Registry - ACR, ou outro registro privado).
- **Rodar múltiplos contêineres**: usando **Docker Compose** para definir aplicações mais complexas.
- **Customizar**: usar imagens personalizadas para ambientes específicos (por exemplo, um contêiner com dependências específicas para seu app).

Isso amplia bastante as possibilidades para quem quer usar App Service sem ficar preso às linguagens/frameworks padrão suportados.

---

## Autenticação

O **Azure App Service** possui **Autenticação e Autorização integradas** (também conhecido como "Easy Auth").

Com poucos cliques ou configurações, você consegue proteger sua aplicação e conectar a provedores como:
- **Azure Active Directory (AAD)**
- **Microsoft Account**
- **Google**
- **Facebook**
- **Twitter**
- **Qualquer provedor de identidade via OpenID Connect ou OAuth 2.0**

Funciona assim:
- O App Service intercepta as requisições HTTP.
- Ele valida o token/autenticação **antes** da sua aplicação processar o request.
- Seu código fica mais limpo, focando na lógica da aplicação.

Também é possível configurar **autenticação baseada em identidade gerenciada** para acessar outros recursos Azure de forma segura (sem armazenar credenciais no código).

---

## Como funciona a **rede** no Azure App Service?

Por padrão, o App Service é acessível pela **internet pública** via um URL do tipo `https://nomeapp.azurewebsites.net`.

Mas o Azure App Service oferece recursos avançados de rede para cenários mais seguros e controlados:

### Integração com redes privadas (VNet Integration)

Permite que o App Service **se conecte** a recursos internos da sua **Virtual Network (VNet)**, como:
- Bancos de dados
- APIs internas
- Outros serviços protegidos

Existem duas modalidades:
- **Regional VNet Integration**: para VNets na mesma região.
- **Gateway-required VNet Integration**: para VNets em outras regiões ou com regras específicas.

> **Importante**: Essa integração permite que o App Service faça **saídas** (egress) para a VNet, mas não recebe **entradas** (ingress) diretamente — para isso existe outra solução.

### Private Endpoint

Você pode criar um **Private Endpoint** para o App Service. 

Com isso:
- Seu app passa a ter um **IP privado** dentro da VNet.
- O tráfego não passa pela internet pública.
- Protege ainda mais o acesso, ideal para ambientes corporativos e regulamentados.

### Isolamento com App Service Environment (ASE)

Se quiser **máximo isolamento e controle de rede**, você pode usar um **App Service Environment (ASE)**:
- Executa o App Service **totalmente dentro da sua VNet**.
- Controla IPs públicos e privados.
- Ideal para cargas críticas ou altamente seguras.

### Controle de acesso público

Você também pode:
- **Restringir IPs permitidos** para acessar o App Service.
- **Habilitar Firewall de Aplicação Web (WAF)** usando Azure Front Door ou Application Gateway.
- **Forçar HTTPS** e configurar políticas de segurança de rede (NSGs).

Resumo sobre rede no Azure App Service:

| Recurso | Função |
|:--------|:-------|
| **VNet Integration** | Permite o App Service acessar recursos internos da VNet |
| **Private Endpoint** | Acesso seguro via IP privado |
| **App Service Environment** | Isola totalmente o App Service dentro da sua VNet |
| **Restrições de Acesso** | Controle de IPs, firewall, HTTPS obrigatório |