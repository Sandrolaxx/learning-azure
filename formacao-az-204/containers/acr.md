## Azure Container Registry (ACR) 🐳

Pense no ACR como o seu "Docker Hub Privado" dentro do Azure. É onde você armazena e gerencia suas imagens de contêiner.

#### Níveis de Serviço (SKUs) - CAI NA PROVA ⚠️

Você precisa saber quando usar o Premium.

| SKU | Cenário | Recursos Chave |
| --- | --- | --- |
| **Basic** | Dev / Teste | Armazenamento limitado, sem recursos de rede avançados. |
| **Standard** | Produção Padrão | Mais armazenamento e throughput. |
| **Premium** | **Enterprise / Global** | **Geo-replication** (Replicação Geográfica), **Private Link** (Rede Privada), Content Trust (Assinatura de imagem). |

> **Dica de Ouro:** Se a questão falar sobre "uma única imagem disponível localmente em múltiplas regiões para baixa latência de download", a resposta é **ACR Premium com Geo-replicação**.

#### Autenticação (Como logar?)

* **Admin User (Conta de Administrador):** Um switch simples ("Enable Admin User"). Gera usuário e senha fixos.
* *Uso:* Testes rápidos e POCs. **Não recomendado** para produção ou CI/CD robusto.


* **Managed Identity (Identidade Gerenciada):** A forma correta. O seu serviço (ACI, App Service) tem permissão `AcrPull` no registro. Sem senhas no código.
* **Service Principal:** Usado em scripts de automação antigos ou ferramentas externas (Jenkins).

#### ACR Tasks (Tarefas do ACR)

Isso é muito cobrado. O ACR não apenas guarda imagens, ele pode **construir** (build) e **atualizar** imagens.

* **Comando:** `az acr build`
* O que faz: Pega seu código local, envia para o ACR, o ACR sobe um contêiner temporário, roda o `docker build` e salva a imagem.
* *Vantagem:* Você não precisa ter Docker instalado na sua máquina local.


* **Gatilhos de Automação (Triggers):**
1. **Commit de Código:** Quando você faz push no GitHub/Azure DevOps.
2. **Base Image Update (Atualização da Imagem Base):**
* *Cenário:* Sua aplicação usa `FROM node:18`. A equipe do Node lança um patch de segurança para a versão 18.
* *O ACR Task:* Detecta que a imagem base mudou e **recompila automaticamente** sua aplicação para aplicar o patch de segurança. Isso é "OS Patching automático".


### Vamos ao Teste Prático (Simulado)

Sua empresa possui desenvolvedores no Brasil, Europa e Japão. Todos precisam baixar imagens Docker grandes do registro central para seus ambientes locais diariamente. Eles reclamam que o download é muito lento devido à distância da região "East US" onde o registro está.

**O que você deve fazer para resolver isso com o mínimo esforço de gestão?**

A) Criar um novo ACR Basic em cada região e copiar as imagens manualmente via script.

B) Atualizar o ACR para a SKU Premium e configurar a Geo-replicação.

C) Usar o Azure Traffic Manager para rotear os desenvolvedores.

D) Usar CDN para fazer cache das imagens Docker.

*Resposta abaixo*

.

.

.

.

.

.

**Letra B (ACR Premium Geo-replicação).**
* Recurso nativo do Premium. Você clica no mapa, e o Azure sincroniza as imagens automaticamente. O desenvolvedor usa a **mesma URL** de login, mas baixa do servidor mais próximo automaticamente.
