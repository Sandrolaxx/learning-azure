# Lab Criação e Utilização Redis Azure

Criando resource group:
```
az group create --name az204-redis-sandrolaxx --location eastus
```

Registra namespace do Microsoft.Cache para utilizar os comandos do Redis:
```
az provider register --namespace Microsoft.Cache
```

Comando criação de instância do Redis (Demora quase 10min):
```
az redis create --location eastus --resource-group az204-redis-sandrolaxx --name redis-sandrolaxx --sku Basic --vm-size c0
```

Em nossa app precisamos da senha e ULR do Redis, podemos encontrar essas infos aqui:

![Credenciais do Redis](https://github.com/user-attachments/assets/893d6ee6-7911-4ba2-9c8a-9c9936ae7078)

Deletando grupo de recursos:
```
az group delete --name az204-redis-sandrolaxx --no-wait
```

Para mais detalhes sobre o projeto e a documentação clique [aqui](./README.md).