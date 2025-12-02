# Lab Doc - Criando CI Web App Azure

Nosso objetivo é criar essa arquitetura da imagem abaixo:

![Arquitetura do projeto do Lab](https://github.com/user-attachments/assets/b82f02ad-6ca2-456e-9784-b0cf6f2da170)

Vamos então cria uma organização e um projeto no Azure DevOps, depois disso vamos criar uma pipeline, acessando na primeira vez vamos clicar em criar nova (Pode selecionar a opção "simple example"):

![Novo pipeline](https://github.com/user-attachments/assets/05a1405b-5483-4a76-a9b8-6e22f432b4a7)

Vamos adicionar o código abaixo no **azure-pipelines.yml**:
```
trigger:
- main

pool:
  name: 'poolapiweather'
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

stages:
  - stage: Build
    displayName: 'Build and Push Docker Image'
    jobs:
      - job: BuildAndPush
        displayName: 'Build and Push to ACR'
        steps:
          - script: |
              # Atualizar pacotes
              sudo apt-get update
              
              # Instalar dependências
              sudo apt-get install -y ca-certificates curl gnupg lsb-release
              
              # Adicionar chave GPG do Docker
              sudo mkdir -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              
              # Adicionar repositório do Docker
              echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
              
              # Instalar Docker
              sudo apt-get update
              sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
              
              # Adicionar usuário atual ao grupo docker
              sudo usermod -aG docker $USER
              
              # Alterar permissões do socket (solução temporária para o pipeline)
              sudo chmod 666 /var/run/docker.sock
              
              # Verificar instalação
              docker --version
              docker ps
            displayName: 'Install Docker and Fix Permissions'

          - task: NodeTool@0
            displayName: 'Install Node.js'
            inputs:
              versionSpec: '20.x'

          - script: |
              npm install
              npm run build
            displayName: 'Install dependencies and build'
            workingDirectory: '$(Build.SourcesDirectory)'

          - task: Docker@2
            displayName: 'Build and Push Docker Image'
            inputs:
              containerRegistry: 'acr-weather-api'
              repository: 'acr-weather-api'
              command: 'buildAndPush'
              Dockerfile: '**/Dockerfile'
              tags: |
                $(Build.BuildId)
                latest
```

Tivemos que fazer esse step de instalar o docker, por que o [Agent Pool](https://learn.microsoft.com/pt-br/azure/devops/pipelines/agents/pools-queues?view=azure-devops&tabs=yaml%2Cbrowser) padrão não estava funcionando, então tive que provisionar um na infra da Azure, abaixo o passo a passo para criar esse recurso (No meu caso o padrão não funcionou, caso o seu funcione ignore esses passos):

Vamos acessar as opções de Agent Pools:
![Agent Pools config](https://github.com/user-attachments/assets/20f79c36-cccb-425c-8f8d-8035ec9c26e3)

Vamos selecionar Managed DevOps Pool e clicar em Create in Azure, vamos ser redirecionados:

![Opção Managed DevOps Pool](https://github.com/user-attachments/assets/a7013ce5-3b9c-4ba7-8e61-fb38241a9f3c)

Primeiramente vamos precisar criar um DevCenter, pois ele é necessário na criação do Managed DevOps Pool:

![DevCenter criação](https://github.com/user-attachments/assets/1dc5a4ce-1076-480e-9d5e-b53d82f2cc7e)

Criação do Managed DevOps Pool, para isso precisamos adicionar o nome da nossa organização e quantidade de agentes, que tem de ser no minímo 2:
![Criando Managed DevOps Pool](https://github.com/user-attachments/assets/5d83f36f-50c1-4d62-a401-364fab90af14)

Após criado o recurso, voltando ao Azure DevOps podemos recarregar a área dos Agent Pools, após isso vai aparecer o nosso criado,podemos clicar nele:

![Novo Agent Pool](https://github.com/user-attachments/assets/05a65848-f061-4ba8-b539-9a0211e012d1)

Então vamos dar acesso a esse Agent Pool para poder executar o pipeline:

![Definindo acesso pipeline](https://github.com/user-attachments/assets/b91e66fc-262b-44c2-9075-422b47938ce3)

Vamos então agora criar mais alguns recursos na Azure, agora na CLI.

**Criando grupo de recursos:**
```
az group create --name az204-api-deploy --location eastus
```

**Criando ACR para subir imagem da App:**
```
az acr create --resource-group az204-api-deploy --name acrdeploy-api 4 --sku Basic
```

Vamos vincular esse ACR no Azure DevOps, podemos encontrar essa opção em Project Settings -> Service connections -> New Service Connection -> Docker Registry:

![Configuração Registry Azure DevOps](https://github.com/user-attachments/assets/e9e8dad8-43f6-4a3a-a664-4e49a7deddbf)

Executando o pipeline, ele vai então criar a imagem no ACR:

![Imagem gerada Registry](https://github.com/user-attachments/assets/d7886948-cb62-4c3e-aaeb-1d3ec11f3b71)

Agora vamos criar uma aplicação para executar a app com base na nossa imagem em um container, vamos criar um **Web App**:

![Criando Web App - pt.1](https://github.com/user-attachments/assets/78f159ae-7de1-487c-a4c1-5d10d56d57d3)

Agora as definições do ACR e informações da imagem:

![Criando Web App - pt.2](https://github.com/user-attachments/assets/9e7f87d4-7779-42bb-8f7d-2c179e032f31)

Podemos após o deploy acessar a app normalmente:

![App executando](https://github.com/user-attachments/assets/44fd67a5-7be1-4a18-b730-344af790bef5)

Agora precisamos realizar algumas configurações para realmente ativarmos o Continuous Delivery, ativar o SCM Basic:

![Ativar SCM Basic](https://github.com/user-attachments/assets/7bd1376d-747b-4418-923f-32b71fc7a22b)

Vamos ser redirecionados para realmente a tela onde habilita a opção:

![Ativando SCM](https://github.com/user-attachments/assets/cc0d1587-0d06-4fd5-bfe0-77e4e8d06fc3)

Caso a opção apenas habilitando o CI no checkbox não funcione, podemos configurar o webhook manualmente, copiando sua string:

![Url de webhook do Web App](https://github.com/user-attachments/assets/fd7b2d53-aa1b-430a-949e-fc556486d442)

E então configurando no container registry:

![Criando WebHook ACR](https://github.com/user-attachments/assets/9ae1a4ca-f4ce-4419-aadb-00d96414a2a7)

Podemos então testar o CI, se com a execução do pipeline e criação de nova imagem, se vai trocar o Web App sem downtime.

![Testando CI](https://github.com/user-attachments/assets/b4e67184-7719-40a8-890b-011df7840ddb)

A alteração que fiz no código para executar o pipeline foi apenas adicionar a string "Verifique o nome e tente novamente", no exemplo da image fiquei dando F5, alguns segundos após finalizado o pipeline a aplicação atualizou sem downtime:

![Troca App sem downtime](https://github.com/user-attachments/assets/9020450a-bc06-49e7-b8ab-68f4f511e9a4)

Delete do resource group:
```
az group delete --name az204-api-deploy --no-wait
```