## Criando um Container App - Aplicativo de Contêiner

Neste lab vamos criar um Container App e deixar uma aplicação executando.

Primeiro precisamos adicionar e atualizar a extensão do containerapp:
```
az extension add --name containerapp --upgrade
```

Registrar o provedor com namespace **App**, caso já não esteja:
```
az provider register --namespace Microsoft.App
```

Também o do **OperationalInsights** caso não tenha:
```
az provider register --namespace Microsoft.OperationalInsights
```

Lembrando que podemos listar todos os namespaces ativos com o comando:
```
az provider list --query "[?registrationState=='Registered']" --output table
```

Criando variáveis de ambiente para utilizar no containerapp:
```
myRG=az204-sandrolaxx
myLocation=eastus
myAppContEnv=az204-env-sandrolaxx
```

Criando resource group:
```
az group create --name $myRG --location $myLocation
```

Criando variáveis de ambiente do containerapp:
```
az containerapp env create \
  --name $myAppContEnv \
  --resource-group $myRG \
  --location $myLocation
```

Criando uma aplicação:
```
az containerapp create \
  --name my-container-app \
  --resource-group $myRG \
  --environment $myAppContEnv \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 80 \
  --ingress 'external' \
  --query properties.configuration.ingress.fqdn
```

Retorno do comando é a URL que está executando a app, ao acessar temos esse response:
![App executando](https://github.com/user-attachments/assets/e024dc6e-fc60-425f-a7a7-acbf238e9833)

Apagando recursos:
```
az group delete --name $myRG --no-wait
```