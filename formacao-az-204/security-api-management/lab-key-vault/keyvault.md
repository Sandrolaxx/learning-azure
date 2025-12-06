## Comandos do lab

Criando variáveis de ambiente:
```
myKeyVault=az204vault-sandrolax
myLocation=eastus
```

Criando grupo de recursos
```
az group create --name az204-vault-rg --location $myLocation
```

Criando Key Vault:
```
az keyvault create --name $myKeyVault --resource-group az204-vault-rg --location $myLocation
```

Criando um segredo na estrutura chave/valor:
```
az keyvault secret set --vault-name $myKeyVault --name "SecretSample" --value "sandrolaxx-az204"
```

Esse comando terá o seguinte retorno com erro:

![Erro permissão](https://github.com/user-attachments/assets/99904e41-4420-4215-9237-ce6ce6a362bf)

Isso ocorre pois nosso usuário não tem permissão para realizar esse processo.

Para isso vamos dar a parmissão para ele, que é a `Key Vault Administrator`:

Encontrar a opção do Access control(IAM) no Key Vault:
![IAM](https://github.com/user-attachments/assets/e6532cee-9e77-43df-bf5d-7e3696f1fa78)

Buscar e selecionar a opção do Key Vault Administrator:
![Busca KV Adm](https://github.com/user-attachments/assets/6a195944-b2dd-4e21-99e2-4333772ae6e3)

Selecionar o seu usuário para conceder a permissão:

![Usuário permissão](https://github.com/user-attachments/assets/9f5bc359-50e8-4ab1-8328-4dcfb24e6843)

Ao executar novamente o comando temos o retorno com sucesso. Com isso nosso segredo é criado e já está disponível.

Apresentando o valor do segredo salvo no Key Vault:
```
az keyvault secret show --name "SecretSample" --vault-name $myKeyVault --query "value"
```

Retorno do comando:
![Comando com sucesso](https://github.com/user-attachments/assets/f415ee89-1b88-482c-b469-853edaacfe58)

Comando para remover grupo de recursos:
```
az group delete --name az204-vault-rg --no-wait
```