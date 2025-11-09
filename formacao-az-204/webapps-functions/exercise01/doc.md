Relizado um teste simples para mostrar o fluxo de como disponibilizar um projeto com HTML no App Service. Abaixo os comandos que foram realizados no CLI.

Realizado comando para listar o nome dos resource-groups.

```bash
az group list --query "[].{id:name}" -o tsv
```

Na raiz do projeto `/html-docs-hello-world` executamos o comando para criar o web app(caso não exista) e já executar:

```bash
az webapp up -g test-webapps -n appazhtml01 --html
```

Esse é o log de retorno👇

![Imagem Log](https://github.com/user-attachments/assets/fa2393dd-b7ed-40db-9aea-128e42b306c4)

App executando👇

![App rodando](https://github.com/user-attachments/assets/e12ae77d-7d9c-4231-af48-50d618096ce5)

Podemos realizar alteração no HTML e executar o mesmo comando novamente, como a app com esse nome já existe, ele apenas vai realizar o deploy novamente.

App após alteração e novo deploy

![App rodando atualizado](https://github.com/user-attachments/assets/ee5a8e16-ea7d-4a3b-b57e-adfdda80909e)