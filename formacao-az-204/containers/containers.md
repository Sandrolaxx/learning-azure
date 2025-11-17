## Containers🐳

Vamos entrar no mundo dos contêineres, que é uma parte massiva do exame AZ-204 e da computação moderna.

Para a certificação, a Microsoft divide esse conhecimento em três partes:

1. **Onde guardar:** [Azure Container Registry (ACR)](./acr.md).
2. **Como rodar simples:** [Azure Container Instances (ACI)](./aci.md).
3. **Como rodar complexo/escalável:** [Azure Container Apps (ACA)](./aca.md) e [AKS](./aks.md) (embora AKS caia muito pouco no AZ-204, o foco mudou para Container Apps).

### Resumo Comparativo Formas de Executar Container

| Serviço | Palavra-Chave | Cenário de Prova | Escala a Zero? | Acesso à API K8s? |
| --- | --- | --- | --- | --- |
| **ACR** (Registry) | Armazenar Imagens | Local para realizar build e armazenamento das imagens para utilização em outros serviços. | N/A | N/A |
| **ACI** (Instances) | "Simples", "Isolado", Container Group (Sidecar) | Script único, Job noturno, Sidecar simples, "Burst" do AKS. Não precisa de orquestração. | ✅ Sim (Morre ao fim) | ❌ Não |
| **ACA** (Apps) | "Microserviços", "KEDA", "Dapr" | API HTTP que flutua muito o tráfego, Event-driven, Requer Ingress/HTTPS fácil, Blue/Green. | ✅ Sim (Serverless) | ❌ Não |
| **AKS** (Kubernetes) | "Controle Total", "Custom CRD" | Legado complexo, precisa acessar a API do Kubernetes (`kubectl`), Service Mesh customizado (Istio). | ⚠️ Difícil (Nodes pagam) | ✅ Sim |
