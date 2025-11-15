## Containers🐳

Vamos entrar no mundo dos contêineres, que é uma parte massiva do exame AZ-204 e da computação moderna.

Para a certificação, a Microsoft divide esse conhecimento em três partes:

1. **Onde guardar:** [Azure Container Registry (ACR)](./acr.md).
2. **Como rodar simples:** [Azure Container Instances (ACI)](./aci.md).
3. **Como rodar complexo/escalável:** Azure Container Apps (ACA) e AKS (embora AKS caia muito pouco no AZ-204, o foco mudou para Container Apps).

### Resumo Comparativo Rápido

| Recurso | ACR (Registry) | ACI (Instances) |
| --- | --- | --- |
| **Função Principal** | Armazenar Imagens | Rodar Contêineres |
| **Comando Chave** | `az acr build` | `az container create` |
| **Conceito Chave** | Geo-replication (Premium) | Container Group (Sidecar) |
| **Segurança** | Content Trust / Private Link | Managed Identity |