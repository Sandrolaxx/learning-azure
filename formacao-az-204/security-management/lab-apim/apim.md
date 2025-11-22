## Lab - API Management(APIM) na prática

Primeiramente vamos deixar o APIM sendo criado pois esse processo demora alguns minutos (no meu caso 20m).

![Criando APIM](https://github.com/user-attachments/assets/7ddc5378-b117-4fb9-8f1d-bd45a6f82b6b)

Após isso vamos criar um Web App para ser a API que vamos externalizar no APIM como um produto de API. Vamos selecionar pricing tier como dev.
![Criando Web App - Pt1](https://github.com/user-attachments/assets/bdada5a0-79f5-4206-8be4-e602fbec592b)

Nas configurações do **Container** vamos colocar a de uma imagem que contém uma API com diversos end-points.

Dados da imagem:
* Registry Server: `kennethreitz`
* Image/tag: `httpbin:latest`

![Criando APIM](https://github.com/user-attachments/assets/be62024f-649c-4117-8172-bbf608d102fb)

Após deploy do Web App podemos acessar e visualizar os end-points.

![HttpBin API](https://github.com/user-attachments/assets/98e51125-e0d9-44d8-8016-a3b5e3ebd6ce)

Agora vamos configurar o Web App no APIM, buscamos por 

![Config Web App APIM pt.1](https://github.com/user-attachments/assets/e2c58bc0-df99-414f-84cd-1ca5923f1bcc)

Vamos buscar por nosso Web App criado:

![Config Web App APIM pt.2](https://github.com/user-attachments/assets/67a8604e-b2b0-451a-afd3-5700ca40aee8)

Encontramos nossa API criada com Web App e a selecionamos:

![Config Web App APIM pt.3](https://github.com/user-attachments/assets/268d794e-d0f8-4bcf-ae83-a85dc84ee272)

Podemos então testar via portal:

![Testando Web App no portal](https://github.com/user-attachments/assets/85b45397-bfee-4fc8-a1eb-dd37d4d0d61b)

Caso tentarmos realizar essa request via Insomnia vamos ter o seguinte erro:

![Erro request Insomnia](https://github.com/user-attachments/assets/0d4c75ba-f65e-4976-86aa-806c5796db41)

Isso ocorre pois não configuramos a subscription key do cliente, para isso vamos definir o nome do parâmetro nos headers:

![Parâmetro x-sub-key](https://github.com/user-attachments/assets/db468cf8-8fea-4dd5-8ca5-17cc39ce8205)

Após isso criamos a subscription key para o cliente e definimos o nível de acesso e etc.

![Criação de subscription key](https://github.com/user-attachments/assets/a3bb3cbe-8892-4b53-bfb8-10add6b00da5)

Clicamos na opção para poder visualizar o valor dela:

![Opção de visualização chave](https://github.com/user-attachments/assets/34518ead-b312-4304-83a5-56e3a9f8413c)

Copiamos o valor dela:

![Copy/Paste sub key](https://github.com/user-attachments/assets/ea043307-0e21-491b-b8d5-96aaddcbf940)

Adicionamos aos headers a sub-key e então realizamos a request com sucesso:

![Request com sub-key](https://github.com/user-attachments/assets/8accee40-2e38-4feb-9a3c-b022bdbbcdb8)

Podemos adicionar diversas políticas, tanto na request de entrada, na chamada ao back-end e no response.

![Opções de políticas](https://github.com/user-attachments/assets/b729aba7-bec9-428e-9989-df8194fa963d)

Isso é interessante pois permite definir limit call rate, cache de respostas, rewrite de URL e outras diversas funcionalidades.

![Políticas disponíveis](https://github.com/user-attachments/assets/73c1ebe0-2331-4284-8029-e0b1f0ca4c32)

Exemplo de políticas disponíveis em outbound (Response da request):

![Políticas outbound](https://github.com/user-attachments/assets/461d449b-2737-4ddd-bfa1-5119b84e3457)

### Atenção

Após todo esse processo, excluímos todo o grupo de recurso.