# Lab Criando DIOFlix

Nesse lab criamos uma instância do CosmosDB, Storage Account e diversas Functions para listar, armazenar e executar vídeos em um front-end com HTML simples.

A arquitetura proposta pelo instrutor no lab é essa abaixo:
![Arquitetura Proposta](https://github.com/user-attachments/assets/64ca3a81-7e54-42bc-87b1-a9cd8e2cecc7)

No início do lab o instrutor comenta de criar um Web App e um APIM para gerenciar a entrada e acesso as API's, porém acaba que ele apenas cria o CosmosDB e Functions. Front-end criamos apenas local. Para seguir essa estrutura precisariamos criar o Web App e vincular ele ao nosso APIM, onde o APIM seria o ponto de entrada, não o Web App, creio que essa estrutura proposta por ele está conceitualmente incorreta.

### Criando os recursos no portal

Criando API Management (APIM):

![Criando APIM](https://github.com/user-attachments/assets/5ead5131-4b93-4869-b783-afc2c01f19c4)

Criando CosmosDB:

![Criando CosmosDB](https://github.com/user-attachments/assets/d06b45f6-2ee4-4f72-a127-85b80a9dc174)

Configurando base de dados e patition key no CosmosDB:
![Config Cosmos](https://github.com/user-attachments/assets/6bd5e453-bda9-497f-9121-04eeb935ac3f)

Criando Storage Account:

![Criando SA](https://github.com/user-attachments/assets/f2918f68-cad5-4f0c-96ab-83cd8fd0ec9f)

Definindo acesso anônimo aos containers do Storage Account:

![Config acesso blob SA](https://github.com/user-attachments/assets/74eb8719-aca6-4bbd-94a6-f7bbcd68ffcc)

Criando container blob de **videos** e **images**:

![Container videos](https://github.com/user-attachments/assets/9c6f638c-215d-4169-8024-363c1a0a5222)

Containers blob criados:
![Todos containers](https://github.com/user-attachments/assets/1e963fff-c1e5-47c3-8e64-7572d31c1590)

Todos os recursos criados no Resource Group:
![Recursos Criados](https://github.com/user-attachments/assets/23a8bd54-4fcb-46fa-8bb8-017e9bce7d19)

### Criando as funções

No projeto realizamos a criação das seguintes funções:

![Funções criadas](https://github.com/user-attachments/assets/98615aea-4293-4649-81ca-7c5fe4a63a4f)

**fnUploadDataStorage** para fazer o envio e persistência dos vídeos e imagens de thumbnail para o blob storage.

Upload de vídeo:
![Upload vídeo](https://github.com/user-attachments/assets/c0b7204f-b702-4a13-b90c-b148780c3faa)

Upload de imagem:
![Upload imagem](https://github.com/user-attachments/assets/1bc49c4c-c2e9-4f9b-be46-cd8839ff1b92)

### IMPORTANTE⚠

Nessa função precisamos atualizar/configurar a função para permitir upload de arquivos maiores que o default.

![Atualizando tamanho limite upload](https://github.com/user-attachments/assets/5f672f76-ed28-4744-b358-140b7f96981b)

Seguindo temos a função **fnPostDataBase** que salva um determinado payload no CosmosDB:
![Save Movie CosmosDB](https://github.com/user-attachments/assets/18238222-ffbe-4a82-a9eb-b3e2ff79ce9b)

E **fnFindAll** e **fnFindById** que listam todos os filmes e por id:
![Listagem todos os filmes](https://github.com/user-attachments/assets/b12895b0-d7ca-43ba-99e5-2d8471c06c1d)

Vamos então para a parte do front-end, onde temos o arquivo **index.html** na pasta public. Vamos abrir ele no navegador.

Mas antes precisamos sempre lembrar de configurar o CORS para execução local, para isso alteramos o arquivo **local.settings.json** adicionando as configurações abaixo:
```
  "Host": {
    "CORS": "*",
    "CORSCredentials": false
  }
```

Vamos compilar nosso projeto:
```
yarn && yarn build
```

Podemos então executar nossas functions com o comando:
```
func start
```

Acessando agora nossa landing-page vamos ter o seguinte resultado:
![Tela inícial SandrolaxxFlix](https://github.com/user-attachments/assets/4601cf50-1504-4e3d-9b44-ed823d03a5b4)

Ao abrir um vídeo:
![Vídeo executando](https://github.com/user-attachments/assets/8ed0c8b6-59bf-45eb-84ac-3e0c6643026d)

Tudo isso sendo executado na infra da Azure.

Não se esqueça de excluir o Resource Group criado!