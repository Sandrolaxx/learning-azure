# AKS - Azure Kubernetes Service

O **Azure Kubernetes Service (AKS)** é um serviço gerenciado da Microsoft Azure que facilita a implantação, o gerenciamento e a operação de clusters Kubernetes na nuvem.

Com o AKS, a Azure gerencia automaticamente tarefas complexas como:
- Provisionamento de nós do cluster
- Atualizações de versão do Kubernetes
- Escalabilidade automática de workloads
- Balanceamento de carga e segurança

Assim, os times de desenvolvimento podem focar mais nas aplicações e menos na infraestrutura.

### Principais benefícios:

- **Gerenciamento simplificado**: você não precisa gerenciar manualmente o plano de controle do Kubernetes (control plane).
- **Escalabilidade automática**: adicione ou remova nós conforme a demanda (Cluster Autoscaler).
- **Integração nativa com serviços Azure**: como Azure Monitor, Azure Active Directory, Azure Container Registry (ACR) e mais.
- **Segurança**: suporte a identidade gerenciada, políticas de rede e atualizações automáticas.
- **Redução de custos**: paga apenas pelos nós do worker, o plano de controle é gratuito.

O AKS é a solução da Azure para rodar **aplicações baseadas em contêineres** de forma escalável, resiliente e com alta automação, ideal para quem busca agilidade no desenvolvimento e operação de ambientes em Kubernetes.

---

## Workloads no AKS (Azure Kubernetes Service)

No **AKS**, **workloads** são as aplicações e serviços que você implanta e gerencia dentro do cluster Kubernetes.  

Esses workloads podem ser simples, como um site estático, ou complexos, como sistemas distribuídos compostos de múltiplos microsserviços.

No AKS, o **Kubernetes** é o motor que orquestra esses workloads, cuidando de:
- **Escalonamento automático** (aumentar ou reduzir instâncias)
- **Atualizações contínuas** (sem tempo de inatividade)
- **Distribuição de carga** entre nós do cluster
- **Resiliência** em caso de falhas de hardware ou software

### Tipos de workloads comuns no AKS:

- **Deployments**: aplicações de longa duração, escaláveis, com atualizações progressivas.
- **StatefulSets**: aplicações que precisam manter **identidade** e **estado persistente**, como bancos de dados.
- **DaemonSets**: serviços de suporte que precisam rodar em todos os nós, como agentes de monitoramento.
- **Jobs/CronJobs**: tarefas de execução única ou programada (por exemplo, processos de ETL, backups).

### Benefícios de usar o AKS para workloads:

- **Gerenciamento automático** do cluster e das cargas de trabalho.
- **Alta disponibilidade** sem configuração manual complexa.
- **Escalabilidade sob demanda** com integração a autoscaling.
- **Segurança integrada** com identidade gerenciada e políticas de acesso.
- **Monitoramento nativo** via Azure Monitor e Azure Log Analytics.

No AKS, workloads representam suas aplicações rodando de maneira **escalável, resiliente e segura**, aproveitando o poder do Kubernetes gerenciado pela Azure.

---

## Como funciona a **rede no AKS?**
 
No AKS, a rede é o que conecta:

- **Pods** (unidades que rodam seus containers)
- **Serviços internos** do cluster
- **Usuários externos** que acessam suas aplicações

Cada **Pod** recebe um **IP** único, e o Kubernetes cuida da comunicação **pod a pod** automaticamente.  

Para expor aplicações e controlar acessos, usamos dois recursos principais: **Services** e **Ingress**.

### O que é o **Service**?

**Service** é uma abstração no Kubernetes que **exponibiliza um conjunto de Pods** de forma estável.

Principais tipos de Service:
- **ClusterIP**: acessível **apenas dentro** do cluster.
- **NodePort**: abre uma porta em todos os nós para acesso **externo**.
- **LoadBalancer**: cria um **IP público** via Azure Load Balancer para acesso **externo automático**.
- **ExternalName**: mapeia o Service para um **nome DNS externo**.

Exemplo simples de Service LoadBalancer:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: minha-api
spec:
  type: LoadBalancer
  selector:
    app: minha-api
  ports:
  - port: 80
    targetPort: 8080
```

→ Aqui o Kubernetes provisionaria um IP público via Azure para sua aplicação.

### O que é o **Ingress**?

**Ingress** é um **controlador de entrada** que permite:
- **Gerenciar múltiplas rotas HTTP/HTTPS** num único ponto de acesso.
- Fazer **balanceamento de carga de aplicações** baseado em regras de URL ou host.

Ele trabalha em conjunto com um **Ingress Controller** (como NGINX Ingress Controller).

Exemplo simples de Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: meu-ingress
spec:
  rules:
  - host: minhaaplicacao.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: minha-api
            port:
              number: 80
```

→ Aqui, todo tráfego vindo de `minhaaplicacao.com` será roteado para o `Service` chamado `minha-api`.

Em resumo temos:

| Elemento | Função |
|:---------|:------|
| **Pod IP** | Comunicação entre pods |
| **Service** | Expõe aplicações dentro ou fora do cluster |
| **Ingress** | Gerencia rotas HTTP/HTTPS inteligentes para múltiplos serviços |