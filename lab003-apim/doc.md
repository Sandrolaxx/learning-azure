# Lab 003 - APIM na prática

Neste lab vamos criar uma aplicação gerenciada pelo API Management, vamos também realizar a autenticação e autorização com Microsoft Entra ID.

## Criando APIM

Primeiramente vamos realizar a criação do APIM.

![Image](https://github.com/user-attachments/assets/9fa27c81-6860-4eb7-b4c0-6e791cecdbc6)

Configurações de monitoramento e proteção do APIM

![Image](https://github.com/user-attachments/assets/ce62850d-2e9f-4cdf-bf08-c785acf96542)

Configuração de rede

![Image](https://github.com/user-attachments/assets/e213383c-ecbd-4e26-a431-f714a3dbd650)

Tags e então clicamos em "Revisar + Criar"

![Image](https://github.com/user-attachments/assets/a61097d5-e00d-4229-9653-63d226f3e92e)

## Criando app

Iniciamos criando um aplicativo web, onde iremos fazer o deploy da nossa aplicação.

![Image](https://github.com/user-attachments/assets/6aad833a-c5ee-4eb0-b099-106486a00376)

Após isso subimos a imagem do container da nossa aplicação para o registry. 

![Image](https://github.com/user-attachments/assets/1122287c-144f-4e48-97a5-bf04e288974c)

Após a imagem estar disponível no registry, realizamos o deploy da aplicação utilizando a imagem.

![Image](https://github.com/user-attachments/assets/6bfc1b4f-e356-4889-a7bc-bd8ca4160599)

Mais detalhes da configuração da aplicação.

![Image](https://github.com/user-attachments/assets/5f4f889b-247a-4491-bbc2-07d370525b80)

Após executar o deploy já podemos acessar nossa aplicação.

![Image](https://github.com/user-attachments/assets/89d7960e-f0ed-40fa-b22e-929360dac537)

## Configurando app no APIM

Primeiro vamos em APIs e vamos criar uma nova API

![APIS_CONFIG_APIM](https://github.com/user-attachments/assets/010d40b7-b160-4f17-af16-f083a9ea36cb)

Vamos escrolar para baixo e encontrar a opção "App service".

![Image](https://github.com/user-attachments/assets/696f74c0-ab10-4601-bb71-7503fc76f9bd)

Configuramos a nova API.

![CREATE_APP_SERVICE_APIM](https://github.com/user-attachments/assets/fabbc776-f90f-470d-801d-2ca682500211)

Irá funcionar corretamente, agora na prática, temos um gateway na frente do nosso serviço. Funciona somente na chamada de teste da plataforma, qualquer chamada externa precisamos de uma key.

![Image](https://github.com/user-attachments/assets/013e1c01-74a2-47ca-b768-9aadba18d336)

## Adicionando key ao APIM

Vamos acessar no menu lateral "Assinaturas" e iremos criar uma nova.

![Image](https://github.com/user-attachments/assets/fab5a23c-7b43-4d8f-a62d-67a901cc1def)

Iremos copiar o valor da "Chave primaria", pois vamos utilizar lá no insomnia.

![Image](https://github.com/user-attachments/assets/eea223bb-7c60-4e3a-aef3-54750ff0af28)

Então configuramos nossa aplicação para começar a receber o api-key nos headers.

![Image](https://github.com/user-attachments/assets/c6af87a0-be87-4747-8c95-8ac2d372dae7)

## Criando JWT Microsoft Entra ID

Vamos acessar o Microsoft Entra ID e vamos acessar a opção "Registro de aplicativos".

![Image](https://github.com/user-attachments/assets/0b9b4c63-0869-48f6-839e-62046b3e06b6)

Vamos clicar na opção "Novo registro" e definir os valores da config.

![Registro de aplicativo - gwt](https://github.com/user-attachments/assets/7bfa1415-f8f5-4a6a-8c39-2223da049b95)

Após criada a app no Microsoft Entra, teremos o seguinte retorno, vamos copiar o client id, url de geração do token e o link do OIDC.
Essas informações vamos utilizar no insomnia e na configuração da API no APIM.

![copy-clientid-oauth-openid](https://github.com/user-attachments/assets/49aade5d-9f2f-42d7-b40e-6f2c922a7ad7)

Vamos também criar roles para nosso token JWT.

![Allow-role-read](https://github.com/user-attachments/assets/7e08e184-c72a-4dbe-bb40-c12399e21bc2)

Vamos então adicionar as roles, no menu lateral vamos acessar a opção "Permissões de API's. Vamos então adicionar novas permissões.

![solicitar permissao Allow-roles](https://github.com/user-attachments/assets/10cf6f25-4f5c-4825-8785-5bf8e845c306)

Precisamos então dar consentimento de admin.

![concentimento-admin](https://github.com/user-attachments/assets/0f9bc630-3520-4481-a821-bfb792e1c586)

Após realizar o consentimento.

![role-com-consentimento-admin](https://github.com/user-attachments/assets/a1c60518-ac85-4cc2-a472-ab922ba062df)

Vamos então expor um scope default.

![Expor scopo - api](https://github.com/user-attachments/assets/2089e8f1-a752-484c-b677-e488c2d46baf)

Configuração do escopo.

![Config-criacao-escopo](https://github.com/user-attachments/assets/e869bad5-1152-42a0-b1b6-f900969002d1)

É possível realizar a request com o scope do graph, mas vamos utilizar o que criamos. Para isso precissamos dar permissão a ele.

![User-read](https://github.com/user-attachments/assets/38ef94f6-0b71-48bf-8d63-d6cb48e5dc62)

Realizamos a solicitação de permissão para nossa app.

![Solicitar permissao app](https://github.com/user-attachments/assets/1d89b956-4c4f-4657-b1de-3c6682ffe1be)

Após finalizado o processo vamos copiar o scope e adicinar na resquest.

![Adicionando-scope-request](https://github.com/user-attachments/assets/0b0da48a-e6cc-4a0a-b0a2-4f75b692282e)

## Configurando JWT no APIM

Em nossa API, iremos em Desing e vamos adicionar o inbound processing do JWT.

![Adicionando-jwt-apim](https://github.com/user-attachments/assets/d77b3345-0846-4db9-b8dc-c202df7cbadc)

Selecionando a opção do JWT.

![Adicionando-input-jwt-apim](https://github.com/user-attachments/assets/f5661a4a-db1e-491f-9c04-185a6153defe)

Configuração do JWT. Aqui adicionamos as informações de aud e iss do JWT gerado via Insomnia e o URL do OpenId Connect.

![Config-jwt](https://github.com/user-attachments/assets/3897e855-43cf-4fc5-9aca-237e836fa388)

Onde encontra as informações acima no JWT? Podemos gerar um JWT no Insomnia e validar/visualizar esses dados no https://jwt.io.

![audience-issuer](https://github.com/user-attachments/assets/22ad24ed-e931-4440-bd4e-5b9154e86318)

Exemplo de request sem passar o token no header.

![tomando-erro-sem-jwt](https://github.com/user-attachments/assets/0ceba0c7-3204-482b-80e8-adda4780b6c5)

Request com sucesso utilizando o token.

![fluxo-funcional](https://github.com/user-attachments/assets/aef71faa-ebc8-4340-b4e1-b433a3f588ef)
