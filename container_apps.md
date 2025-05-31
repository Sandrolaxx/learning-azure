# Container Apps

O **Azure Container Apps** é um serviço da Microsoft Azure voltado para a execução de aplicações em contêineres, especialmente aplicações baseadas em microsserviços, APIs e aplicações orientadas a eventos. Ele abstrai a complexidade da infraestrutura Kubernetes, oferecendo uma plataforma gerenciada que simplifica o deployment, o escalonamento e a integração com outros serviços da Azure.

### Características:

* **Gerenciado pela Azure**: Não requer o gerenciamento direto de clusters Kubernetes.
* **Suporte a autoscaling**: Inclui escalonamento automático com base em eventos (como uso de CPU ou mensagens em fila), incluindo o modelo KEDA (Kubernetes Event-Driven Autoscaling).
* **Compatível com Dapr**: Suporte integrado para o Dapr (Distributed Application Runtime), facilitando a construção de aplicações distribuídas.
* **Ambiente serverless ou provisionado**: Permite operar com zero instâncias quando inativo ou com número mínimo de instâncias, conforme configurado.
* **Deploy via contêiner**: Aceita imagens de contêiner de qualquer registry (Docker Hub, Azure Container Registry, etc.).
* **Integração com rede virtual e monitoramento**: Possibilita controle de rede, identidade gerenciada e rastreamento com Application Insights.

### Casos de uso comuns:

* APIs e microsserviços escaláveis
* Processamento assíncrono baseado em eventos
* Aplicações web em contêineres com requisitos variáveis de carga

---

## Comparativo AKS x Container Apps x Web Apps(App Service)

Comparação com foco em casos de uso, gerenciamento, escalabilidade e outras características técnicas.

### Visão Geral

| Característica     | **AKS (Azure Kubernetes Service)**       | **Azure Container Apps**                          | **Azure App Service (Web Apps)**              |
| ------------------ | ---------------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| Modelo de Execução | Kubernetes (gerenciado)                  | Serverless/container-based                        | PaaS (Platform as a Service)                  |
| Tipo de Aplicação  | Contêinerizada, complexa, multi-serviços | Contêinerizada, orientada a eventos/microserviços | Código tradicional (Node, .NET, Python, etc.) |
| Abstração          | Baixo nível (controle total)             | Médio nível (abstrai Kubernetes)                  | Alto nível (sem contêiner necessário)         |
| Deploy             | Contêineres, Helm, YAML                  | Imagem de contêiner (Docker)                      | Código direto, contêiner ou ZIP               |

---

### Gerenciamento e complexidade

| Característica               | **AKS**                               | **Container Apps**            | **Web Apps**                        |
| ---------------------------- | ------------------------------------- | ----------------------------- | ----------------------------------- |
| Gerenciamento de Infra       | Alto – você gerencia o cluster        | Baixo – gerenciado pela Azure | Muito baixo – totalmente gerenciado |
| Complexidade de Configuração | Alta (necessário conhecimento em K8s) | Média                         | Baixa                               |
| Integração com DevOps        | Flexível e personalizável             | Nativa e simples              | Muito simples                       |

### Escalabilidade e resiliência

| Característica           | **AKS**                                   | **Container Apps**                   | **Web Apps**                        |
| ------------------------ | ----------------------------------------- | ------------------------------------ | ----------------------------------- |
| Escalabilidade           | Avançada (horizontal/vertical, HPA, KEDA) | Automática baseada em eventos (KEDA) | Escalabilidade automática integrada |
| Suporte a Zero-Instância | Não                                       | Sim                                  | Não                                 |
| Alta disponibilidade     | Depende da configuração                   | Nativa                               | Nativa                              |

### Casos de uso comuns

| Característica         | **AKS**                                    | **Container Apps**                      | **Web Apps**                      |
| ---------------------- | ------------------------------------------ | --------------------------------------- | --------------------------------- |
| Aplicações complexas   | Sim (microsserviços, mesh, CI/CD avançado) | Sim (event-driven, API, microsserviços) | Sim (web apps simples, APIs REST) |
| Workloads event-driven | Sim                                        | Sim (ótimo suporte com KEDA + Dapr)     | Limitado                          |
| Aplicações legacy      | Limitado (precisa ser contêiner)           | Sim (se contêinerizadas)                | Sim                               |

### Custo e eficiência

| Característica                     | **AKS**                                    | **Container Apps**                     | **Web Apps**  |
| ---------------------------------- | ------------------------------------------ | -------------------------------------- | ------------- |
| Custo base                         | Médio a alto (infraestrutura provisionada) | Baixo (paga-se por execução e consumo) | Baixo a médio |
| Eficiência para pequenos workloads | Baixa (overhead do cluster)                | Alta                                   | Alta          |

---

### Quando escolher cada um?

* **Use AKS se**: você precisa de controle total sobre o orquestrador, arquitetura complexa, políticas personalizadas, ou já usa Kubernetes.
* **Use Container Apps se**: quer um ambiente moderno para microsserviços e event-driven, com escalabilidade automática sem gerenciar infraestrutura.
* **Use Web Apps se**: precisa de uma solução rápida para hospedar aplicações web ou APIs com o mínimo de complexidade.

---

### Referência:
* [AKS Overview](https://learn.microsoft.com/en-us/azure/aks/intro-kubernetes)
* [Container Apps Overview](https://learn.microsoft.com/en-us/azure/container-apps/overview)
* [App Service Overview](https://learn.microsoft.com/en-us/azure/app-service/overview)

---

## Pequeno passo a passo de utilização

Seguindo os comandos abaixo conseguimos subir um simples container com um hello-world no Container Apps.

```bash
az login

#Adição da extensão de containerapp
az extension add --name containerapp --upgrade

#Definindo namespace de app, necessário para criar recursos do containerapp
az provider register --namespace Microsoft.App

#Definindo namespace da ferramenta de coleta de logs e monitoramento
az provider register --namespace Microsoft.OperationalInsights

#Definindo variáveis de ambiente
myRG=sandrolaxxcontainerapp
myLocation=eastus
myAppContainerEnv=sandrolaxx-env-001

#Criação do resource group
az group create --name $myRG --location $myLocation

#Criação o ambiente do containerapp
az containerapp env create \
  --name $myAppContainerEnv \
  --resource-group $myRG \
  --location $myLocation

#Criação do containerapp
az containerapp create \
  --name my-container-app \
  --resource-group $myRG \
  --environment $myAppContainerEnv \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 80 \
  --ingress 'external' \
  --query properties.configuration.ingress.fqdn
```

Bloco acima cria o Container App com as seguintes configurações:
* **name**: Nome do aplicativo.
* **resource-group**: Resource group onde o aplicativo será criado.
* **environment**: Ambiente de Container Apps onde o aplicativo será hospedado.
* **image**: Imagem de contêiner usada para o aplicativo (neste caso, um hello-world).
* **target-port**: Porta que o aplicativo escutará (porta 80).
* **ingress** 'external': .
* **query** properties.configuration.ingress.fqdn: Retorna o Fully Qualified Domain Name (FQDN) do aplicativo criado.

Ao final podemos acessar o recurso criado com a url retornada do comando, tal url também é possível encontrar ao selecionar o container app no portal da Azure.

![Image](https://github.com/user-attachments/assets/f28af566-73af-4b7d-90f1-0398647d074c)