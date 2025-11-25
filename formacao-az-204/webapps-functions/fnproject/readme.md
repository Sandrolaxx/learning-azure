## Criação recursos projeto

Criando resource group:
```
az group create --name az204-cpf-lambda --location eastus
```

Criando storage account:
```
az storage account create --name acsandrolaxx --location eastus --resource-group az204-cpf-lambda --sku Standard_LRS
```

Criando a function:
```
az functionapp create --resource-group az204-cpf-lambda --name fnsandrolaxx-cpf --consumption-plan-location eastus --runtime node --runtime-version 18  --storage-account acsandrolaxx
```

Publicando função local para Azure:
```
func azure functionapp publish fnsandrolaxx-cpf
```

Excluindo resource group:
```
az group delete --name az204-cpf-lambda --no-wait
```

Código da lambda se encontra nesse repositório.

---

## Execução da API na Azure

Caso com sucesso:

![Sucesso](https://github.com/user-attachments/assets/d9e5cc33-d2e2-4ed1-b84e-208c2cbeb3c9)

Caso validação campo não informado:

![Validação campo CPF](https://github.com/user-attachments/assets/e03f584e-8543-4ec9-a481-6758c8d1033d)

Caso de CPF inválido:

![Cpf inválido](https://github.com/user-attachments/assets/104d6e1a-3345-4fdc-b1a0-918ccac8c511)