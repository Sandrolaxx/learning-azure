## Azure Container Instances (ACI) 📦

O ACI é a forma mais rápida e simples de rodar um contêiner no Azure. É "Serverless Containers".

### Quando usar?

* **Ideal para:** Jobs isolados, scripts de automação, tarefas agendadas, ambientes de desenvolvimento, "Bursting" (transbordo) do AKS.
* **Não use para:** Orquestração complexa (Service Discovery, Auto-scaling complexo, Blue/Green deployment). Para isso, use Container Apps ou AKS.

### Grupos de Contêineres (Container Groups)

No ACI, a unidade atômica não é o contêiner, é o **Container Group**.

* É muito similar ao conceito de **Pod** no Kubernetes.
* Todos os contêineres no grupo compartilham:
* O mesmo ciclo de vida (iniciam e morrem juntos).
* A mesma rede local (podem falar entre si via `localhost`).
* O mesmo endereço IP público.
* Volumes de armazenamento montados.

> **Padrão Sidecar (Sidecar Pattern):** A prova adora isso.
> * *Cenário:* Você tem um container principal (App Web) e precisa enviar logs para um sistema externo.
> * *Solução:* Adiciona um segundo container (Sidecar - Log Agent) no **mesmo Container Group**. O App escreve logs num volume compartilhado, e o Sidecar lê desse volume e envia para fora. 

### Políticas de Reinicialização (Restart Policy)

Você define isso na criação.

* **Always:** (Padrão para servidores web). Se o processo parar, o Azure inicia de novo.
* **OnFailure:** (Padrão para Jobs/Tasks). Só reinicia se o processo sair com erro (exit code != 0). Se terminar com sucesso, fica parado.
* **Never:** Para containers que rodam uma vez e não devem repetir (ex: migração de banco perigosa).

#### Armazenamento

Como persistir dados no ACI?

* Você **não** usa discos gerenciados comuns.
* Você monta um **Azure File Share** (Compartilhamento de Arquivos) como volume dentro do contêiner.

---

### Vamos ao Teste Prático (Simulado)

Você tem uma aplicação Python que precisa rodar um script de processamento de dados todas as noites às 03:00 AM. O script leva cerca de 15 minutos para rodar.
Você quer minimizar o esforço administrativo e pagar apenas pelos minutos de execução.

**Qual configuração você escolhe?**

A) Azure App Service com Always On.

B) Azure Container Instances com Restart Policy = Always.

C) Azure Container Instances com Restart Policy = OnFailure.

D) Azure Kubernetes Service (AKS).

*(Respostas abaixo)*
.

.

.

.

.

.

.

**Respostas:**

**Letra C (ACI com OnFailure).**
* *Por que não A?* App Service é para web apps contínuos, e Always On paga 24h.
* *Por que não B?* `Always` faria o script rodar, terminar, e o Azure iniciaria ele de novo em loop infinito. `OnFailure` garante que ele rode até o sucesso e pare (você usaria um Logic App ou Azure Function Timer para disparar a criação do container às 3AM).
* *Nota:* Azure Functions também seria uma opção, mas entre as listadas, ACI OnFailure é a correta para "batch jobs" em containers.