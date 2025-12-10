# Objetivo

Nessa lab subimos um Web App com um container que roda uma landing-page simples e vamos utilizar a CDN da Azure para definir algumas configurações de cache e entregar esse contéudo da melhor maneira possível.

Vamos criar um Storage Account:

![Criando Storage Account](https://github.com/user-attachments/assets/af94b82e-ebd7-424e-adae-36c1336f2633)

Então vamos permitir o acesso anônimo:

![Habilitando acesso anônimo](https://github.com/user-attachments/assets/17a4c063-5acc-4dd7-8a67-f638e77bee7c)

Criamos um Web App:

![Criando Web App](https://github.com/user-attachments/assets/af5ebedf-c807-427e-893d-8fe3c7088a20)

Na aba container vamos colocar "outro registry" e definir essa imagem:

```
microsoftlearning/edx-html-landing-page:latest
```

Após criar o Web App:
![Recurso criado](https://github.com/user-attachments/assets/d3fd7d49-aec1-4854-9591-972cae228a83)

Vamos então validar se a CDN está habilitada o namespace:
```
az provider show -n Microsoft.CDN --query "registrationState"
```

Caso não esteja "Registered", vamos executar o comando:
```
az provider register --namespace Microsoft.CDN
```

Vamos buscar por "Front Door and CDN profiles":
![Busca por CDN](https://github.com/user-attachments/assets/6f1cc110-4a21-45af-8437-99155c89df64)

Seleção base da configuração da CDN:
![Seleção base da CDN](https://github.com/user-attachments/assets/17270795-2efd-4e09-a7df-621c43ecb4d6)

Configuração da CDN:
![Config da CDN](https://github.com/user-attachments/assets/daf5d194-bc8e-4697-8a47-b123ae08885b)

Não foi possível seguir com o lab pois CDN não está disponível na assinatura do nível gratuito ou de estudante.

Mas no vídeo ele continua criando dois containers no Storage Account chamado vídeo e image:
![Criando container blob storage](https://github.com/user-attachments/assets/6401caa3-04fb-4f1e-bdeb-aa8e13c486f3)

Depois de criar esses dois containeres e colocar 1 vídeo e 3 imagens nesses diretórios, então ele criar end-points para os três recursos, /media, /videos e para a landing page:
![Criando end-point](https://github.com/user-attachments/assets/6abdf6bf-96d7-45b1-b780-e207b47d0690)

Após criado os três end-points:
![Três end-points](https://github.com/user-attachments/assets/efe3f158-f4d3-4cb5-9086-80d55004f085)

Então definimos as variáveis de ambientes pendentes em nossa landing page, que são os end-points da CDN:
![Envs da landing-page](https://github.com/user-attachments/assets/da75b116-07c1-44a0-bab9-deac1f686905)

Print da tentativa de criar a CDN:
![Tentativa de criação da CDN](https://github.com/user-attachments/assets/bd8e1158-9bc9-45fb-8adf-da0b40c9ba0f)

Sempre temos de lembrar de excluir os recursos criados!
![Exclusão dos recursos](https://github.com/user-attachments/assets/256f2b8c-87f7-49b0-8f75-acf4eb97ec15)