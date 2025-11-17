# Azure Kubernetes Service (AKS)

Para a prova de *Desenvolvedor* (não Admin), você não precisa saber instalar Kubernetes na unha ("Kubernetes The Hard Way"), mas precisa saber como a infraestrutura afeta seu deploy.

### Networking (Rede): Kubenet vs. Azure CNI 🌐

Essa é a questão clássica de arquitetura no exame.

| Recurso | **Kubenet** (Básico) | **Azure CNI** (Avançado) |
| --- | --- | --- |
| **IPs de Pods** | Recebem IPs de uma rede interna **oculta** (NAT). | Recebem IPs **reais** da VNET do Azure. |
| **Comunicação** | Pods usam NAT para sair. Mais lento (levemente). | Pods são "cidadãos de primeira classe" na rede. |
| **Esgotamento de IPs** | **Pouco consumo.** Bom para redes pequenas. | **Alto consumo.** Cada Pod gasta 1 IP da sua subnet. |
| **Cenário** | Clusters simples, dev/test, economizar IPs. | Produção, conexão direta com on-premise, Windows Containers. |

> **Dica:** Se a questão falar "precisa suportar Windows Containers" ou "evitar saltos extras de rede (NAT)", a resposta é **Azure CNI**. Se falar "temos poucos IPs disponíveis na rede corporativa", a resposta é **Kubenet**.

### Armazenamento (Storage) 💾

Contêineres são efêmeros (perdem dados ao reiniciar). Para salvar dados, usamos **Volumes**.
A prova foca na abstração do Kubernetes para não lidar com discos físicos.

1. **Persistent Volume (PV):** O disco real (Azure Disk ou Azure Files).
2. **Persistent Volume Claim (PVC):** O "pedido" do desenvolvedor. *"Eu quero 5GB de disco rápido"*.
3. **Storage Class:** A "classe" de serviço.
    * *Default:* Cria um Azure Disk Standard SSD.
    * *Managed-Premium:* Cria um Azure Disk Premium SSD.
    * *Azurefile:* Cria um Share SMB no Azure Files (permite **ReadWriteMany** - vários pods lendo/escrevendo ao mesmo tempo).

> **Atenção:** **Azure Disks** só podem ser montados em **um** Pod por vez (ReadWriteOnce). Se precisar compartilhar arquivos entre vários pods (ex: CMS WordPress escalado), use **Azure Files**.

### Escalabilidade no AKS 📈

Dois tipos de escala que caem na prova:

1. **HPA (Horizontal Pod Autoscaler):** Escala os **Pods**. (Ex: CPU > 50%, cria mais réplicas do container).
2. **Cluster Autoscaler:** Escala os **Nodes** (VMs).
* *Cenário:* O HPA pediu mais pods, mas o cluster acabou a memória RAM. O Cluster Autoscaler detecta que tem pod "Pendente" e provisiona uma nova VM automaticamente.

### Integração AKS + ACR 🤝

Para o AKS baixar imagens do seu registro privado (ACR) sem `docker login`:

* Use a integração nativa via **Managed Identity** ou **Service Principal**.
* Comando chave: `az aks update -n meuAKS -g meuRG --attach-acr meuACR`.
* Isso concede a permissão `AcrPull` para o cluster.

---

### Simulado Rápido de Consolidação ⚡

**Questão:**
Você vai implantar um cluster AKS para uma aplicação crítica. Cada pod precisa ter um endereço IP roteável diretamente da rede corporativa para auditoria de tráfego sem NAT. Além disso, você rodará containers Windows.
Qual plugin de rede você escolhe?

A) Kubenet.

B) Azure CNI.

C) Docker Bridge.

D) Service Mesh.

*(Respostas abaixo)*
.

.

.

.

.

.

.

**Resposta B (Azure CNI).** 

Kubenet não suporta Windows Nodes nativamente da mesma forma e usa NAT, escondendo os IPs reais. Azure CNI dá um IP real para cada pod.