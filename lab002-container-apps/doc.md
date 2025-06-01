## Docs do processo do lab

### Criar dockerfile

Dockerfile é o arquivo responsável por permitir criarmos um container da nossa aplicação.

```
FROM nginx:alpine

COPY index.html /usr/share/nginx/html

EXPOSE 80
```

### Scripts

### Criar o build do docker e executar container localmente

Para isso, precisamos buildar a imagem da nossa aplicação e depois executá-la.

```
docker build -t simple-landing-sandrolax:latest .
```

E para executar:

```
docker run -d -p 8080:80 simple-landing-sandrolax:latest
```

Caso a porta já esteja em utilização, tente outra ou encerre o processo.

### Criação de resource grou e container registry

Logar no Azure:

```
az login
```

Criar resource group
```
az group create --name containerappslab002 --location eastus
```

Criar o namespace para poder utilizar o container registry

```
az provider register --namespace Microsoft.ContainerRegistry
```

Após criado namespace, vamos então criar o Container registry
```
az acr create --resource-group containerappslab002 --name landingpagetestacr --sku Basic
```

### Login no ACR - Azure Container Registry

Comando do login
```
az acr login --name landingpagetestacr
```

Adicionando tag a imagem e a referenciando no ACR

```
docker tag simple-landing-sandrolax:latest landingpagetestacr.azurecr.io/simple-landing-sandrolax:latest
```

Realizando push para o registry
```
docker push landingpagetestacr.azurecr.io/simple-landing-sandrolax:latest
```

Após criado, podemos visualizar o ACR com o container, como na imagem abaixo.

![Image](https://github.com/user-attachments/assets/347b1ed8-a833-4076-bcde-c548f57f9e42)
![Image](https://github.com/user-attachments/assets/484e3a88-27d4-42e6-82c4-3e3a54547cc3)

Agora precisamos realizar algumas alterações no ACR para que o Container Apps possa acessá-lo. Primeiramente, vamos permitir login com usuário e senha.

![Image](https://github.com/user-attachments/assets/ba253dd2-c45c-4189-be1c-1f982ce55866)

Caso estivéssemos trabalhando com identidade gerenciada, esse não seria um problema.

Vamos copiar o usuário e senha, pois será necessário no environment do Container Apps.

Abaixo vamos utilizar o usuário, senha e nome do servidor no comando "Criando o Container App".

### Criando Container

Primeiro iniciamos criando o env.

```
az containerapp env create \
  --name sandrolax-landing-env \
  --resource-group containerappslab002 \
  --location eastus
```

Criando o Container App
```
az containerapp create \
  --name simple-landing-sandrolax \
  --resource-group containerappslab002 \
  --image landingpagetestacr.azurecr.io/simple-landing-sandrolax:latest \
  --environment sandrolax-landing-env \
  --cpu 0.5 \
  --memory 1Gi \
  --target-port 80 \
  --ingress external
  --registry-username SEU_USERNAME_DO_ACR
  --registry-password SEU_PASSWORD_DO_ACR
  --registry-server SEU_SERVER_DO_ACR
```

Interessante mencionar que o cpu e memória têm um padrão em seus pares, exemplo cpu 0.5 seu par é memória de 1Gi.

Ao ser finalizado a execução do comando, teremos um print com todos os detalhes do recurso criado, nele poderemos encontrar o URL do nosso serviço no campo **latestRevisionFqdn**.

Aqui podemos ver todos os recursos criados nesse lab.

![Image](https://github.com/user-attachments/assets/e0c2bda9-f2e1-428f-a9b4-1a2dc576d887)

Podemos também encontrar a URL do serviço via portal, primeiro entramos no recurso do Container App.

![Image](https://github.com/user-attachments/assets/8e79cafc-5aee-4c93-9548-54f1b4d6654f)