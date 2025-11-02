# Orquestração de contêineres na Azure

## Containers

Contêineres são uma tecnologia de empacotamento leve que permite executar uma aplicação juntamente com todas as suas dependências, configurações e bibliotecas, de forma isolada do restante do sistema.  
Isso garante que a aplicação funcione de maneira **consistente em qualquer ambiente**, seja no computador do desenvolvedor, em servidores ou na nuvem, ou seja sem mais "na minha máquina funciona".

Mas isso não é uma máquina virtual que instalo com virtual box? Não eles tem muitas diferenças, abaixo uma tabela para apresentar as principais.

**Contêineres vs Máquinas Virtuais**

| Característica         | Contêineres                     | Máquinas Virtuais             |
|------------------------|----------------------------------|-------------------------------|
| **Inicialização**      | Muito rápida (segundos)          | Mais lenta (minutos)          |
| **Consumo de recursos**| Mais leve (compartilham o SO)    | Mais pesado (cada VM tem seu SO) |
| **Portabilidade**      | Alta                             | Média                         |
| **Isolamento**         | Aplicações                       | Sistema operacional inteiro   |
| **Gerenciamento**      | Mais simples com orquestradores  | Mais complexo                 |

Enquanto as VMs virtualizam o hardware, os contêineres virtualizam apenas o espaço da aplicação, tornando-os mais eficientes e rápidos para desenvolvimento e deploy.

### Benefícios dos contêineres no desenvolvimento

- **Portabilidade**: O contêiner roda da mesma forma em qualquer ambiente com Docker ou outro runtime compatível.
- **Isolamento**: Aplicações e suas dependências ficam isoladas, evitando conflitos no ambiente.
- **Velocidade**: Ambientes de desenvolvimento, teste e produção podem ser iniciados rapidamente.
- **Escalabilidade**: Facilmente replicáveis e ideais para arquiteturas modernas, como microserviços.
- **Eficiência de recursos**: Utilizam menos CPU e memória que VMs, permitindo melhor aproveitamento da infraestrutura.

Contêineres são uma alternativa moderna, leve e eficiente à virtualização tradicional, oferecendo agilidade e confiabilidade no desenvolvimento, teste e implantação de aplicações.

---

## Azure Container Registry - ACR

É um serviço da Microsoft Azure que permite armazenar, gerenciar e distribuir **imagens de contêiner privadas** de forma segura e integrada à nuvem.

Com o ACR, você pode manter suas imagens Docker próximas dos seus serviços em Azure, otimizando performance e segurança no pipeline de CI/CD.

### Principais benefícios:

- **Repositório privado** de contêineres Docker
- **Integração nativa** com o Azure Kubernetes Service (AKS) e outros serviços Azure
- **Automação de builds e tasks** com suporte a webhooks e pipelines
- **Suporte a imagens OCI (Open Container Initiative)**
- **Autenticação segura** com Azure AD e RBAC

O ACR é a solução ideal para equipes que utilizam contêineres e desejam manter um repositório privado, seguro e escalável dentro do ecossistema Azure.

### Principais comandos

Abaixo temos a lista dos principais comandos que podem ser executados na Azure para esse produto.

1. **Login no Azure**
```bash
az login
```
Autentica na sua conta Azure para executar comandos.

2. **Criar um ACR**
```bash
az acr create --name meuRegistro --resource-group meuGrupo --sku Basic --admin-enabled true
```
Cria um novo registro ACR. `--sku` pode ser: `Basic`, `Standard` ou `Premium`.

3. **Listar registros existentes**
```bash
az acr list --output table
```
Mostra todos os ACRs no seu tenant/subscrição.

4. **Login no ACR**
```bash
az acr login --name meuRegistro
```
Faz login no registro ACR para permitir push/pull com o Docker.

5. **Obter o login server (URL do registro)**
```bash
az acr show --name meuRegistro --query loginServer --output tsv
```
Retorna a URL para taguear e enviar imagens, ex: `meuregistro.azurecr.io`.

6. **Taguear uma imagem Docker**
```bash
docker tag minha-imagem meuregistro.azurecr.io/minha-imagem:v1
```
Prepara a imagem local para envio ao ACR.

7. **Enviar (push) uma imagem para o ACR**
```bash
docker push meuregistro.azurecr.io/minha-imagem:v1
```
Publica a imagem no registro.

8. **Listar imagens no ACR**
```bash
az acr repository list --name meuRegistro --output table
```
Exibe os repositórios de imagens armazenadas.

9. **Listar as tags de uma imagem**
```bash
az acr repository show-tags --name meuRegistro --repository minha-imagem --output table
```
Mostra as versões disponíveis da imagem.

10. **Remover uma imagem**
```bash
az acr repository delete --name meuRegistro --repository minha-imagem --yes
```
Remove uma imagem ou repositório inteiro do ACR.

### Examinar a autenticação com Identidade Gerenciada no Azure

A Identidade Gerenciada (Managed Identity) é uma forma segura de permitir que serviços do Azure (como VMs, Web Apps, Azure Functions ou AKS) acessem recursos do Azure sem precisar armazenar credenciais no código.

No contexto do Azure Container Registry (ACR), você pode usar uma identidade gerenciada para que um serviço do Azure autentique-se automaticamente ao ACR e faça pull de imagens sem login manual ou secrets.

Benefícios dessa abordagem são:
* Segurança aprimorada: sem necessidade de armazenar senhas ou tokens.
* Gestão centralizada: permissões são gerenciadas com RBAC no Azure.
* Automação: ideal para pipelines, deploys e orquestração com AKS ou Azure DevOps.

Exemplo de uso:
Habilitar a identidade gerenciada no recurso (por exemplo, uma VM ou AKS).

Para isso precisamos conceder a permissão AcrPull no ACR:

```bash
az role assignment create \
  --assignee <ID-da-identidade> \
  --role AcrPull \
  --scope $(az acr show --name meuRegistro --query id --output tsv)
```