## Comandos para subir uma imagem - ACR

Criando resource group:
```
az group create --name az204-acr-sandrolaxx --location eastus
```

Criando ACR:
```
az acr create --resource-group az204-acr-sandrolaxx --name acrdemo01az0204 --sku Basic
```

Criando um dockerfile simples de exemplo:
```
echo FROM mcr.microsoft.com/hello-world > dockerfile
```

Criando imagem no acr:
```
az acr build --image sample/hello-world:v1 --registry acrdemo01az0204 --file dockerfile .
```

Listagem das nossas imagens:
```
az acr repository list --name acrdemo01az0204 --output table
```

Listagem das tags:
```
az acr repository show-tags --name acrdemo01az0204 --repository sample/hello-world --output table
```

Executar o container:
```
az acr run --registry acrdemo01az0204 --cmd '$Registry/sample/hello-world:v1' /dev/null
```

Deletar o resource group:
```
az group delete --name az204-acr-sandrolaxx --no-wait
```

## Comandos para executar uma imagem - ACI

Criando resource group:
```
az group create --name az204-aci-sandrolaxx --location eastus
```

Criando uma variável de ambiente para usar na imagem:
```
DNS_NAME_LABEL=aci-example-sandrolaxx
```

> Lembrando que toda vez que tiver que atualizar esse secret vai ser necessário criar o container novamente, sendo mais recomendado utilizar um cofre de segredos como key-vault.

Aqui tive de executar um comando anterior para habilitar o container instance:
```
az provider register --namespace Microsoft.ContainerInstance
```

Comando para criação do container:
```
az container create --resource-group az204-aci-sandrolaxx \
  --name sandrolaxx204container \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --ports 80 \
  --os-type linux \
  --dns-name-label $DNS_NAME_LABEL --location eastus \
  --memory 1 \
  --cpu 1
```

Pegar a URL e verificar o status do serviço:
```
az container show --resource-group az204-aci-sandrolaxx \
  --name sandrolaxx204container \
  --query "{FQDN:ipAddress.fqdn, ProvisioningState:provisioningState}" \
  --out table
```

Com isso podemos realizar um ping na URL do FQDN:
![Url do FQDN](https://github.com/user-attachments/assets/4ccd95d7-8a79-42a1-8867-2f252d7980ed)

Removendo resource group:
```
az group delete --name az204-aci-sandrolaxx --no-wait
```

---

## Permissão utilização imagens ACR no ACI

Precisamos dar acesso de admin para o ACR, que por padrão ele não vem configurado desse modo. Caso não fizermos esse comando não vai listar o registry do ACR nas criações de app no ACI. Comando para atualizar permissões de adm:
```
az acr update -name NOME_DO_ACR --admin-enabled true
```