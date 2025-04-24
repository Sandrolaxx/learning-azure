# Lab criando Ecom integrado Azure

Nesse lab vamos criar um pequeno sistema com python de um e-commerce para apresentar produtos, para isso vamos criar um SQL Server e um Storage Account.

O modelo do `.env` utilizado no sistema é esse:
```.env
BLOB_CONNECTION_STRING=""
BLOB_CONTAINER_NAME=""
BLOB_ACCOUNT_NAME=""

SQL_SERVER="URL"
SQL_DATABASE=""
SQL_USER=""
SQL_PASSWORD=""
```
Esse arquivo existe no projeto local, porém por questões de segurança ele não é enviado com os dados para o repositório.

---

## Passo a passo do lab

Primeiro criamos um resource grup, para organizar todos os itens que iremos criar, após finalizar o lab simplificar a remoção de todos os recursos criados.

![pt_01](https://github.com/user-attachments/assets/6962a652-6a46-46d0-a8e2-b1f4d0a7d613)

Vamos no nosso grupo de recursos criado, clicar em criar, irá apresentar o marketplace, vamos buscar por "Azure SQL", no item dele vamos clicar em **Criar** para iniciar o processo de configuração do recurso.

![pt_02](https://github.com/user-attachments/assets/0121aa80-a909-400b-9d1a-da0fb85e9210)

Vamos selecionar a opção **Banco de dados individual** e clicar em criar.

![pt_03](https://github.com/user-attachments/assets/32119db0-82f8-46a1-a758-50116722ff6c)

No processo de criação do banco SQL, vamos ter de criar um novo servidor, clicamos na opção "Criar novo" abaixo do "Selecionar um servidor".

![pt_04](https://github.com/user-attachments/assets/129f8672-2304-419d-b6e8-4bc0f8f06af5)

Definimos o nome, localização, modelo de autenticação, username e senha. Importante salvar a URL de conexão.

![pt_05](https://github.com/user-attachments/assets/8de3355a-f74e-44ca-9cc7-d2e1c69c59cf)

Ao voltar para a tela principal de definição do recurso, podemos clicar em "Nível de serviço de computação", que irá abrir a tela abaixo. Nessa tela vamos definir como "Sem servidor", neste ponto também podemos alterar a configuração da máquina utilizada.

![pt_06](https://github.com/user-attachments/assets/919326f2-44f1-4ea4-9844-db98a6f4372e)

Selecionando a opção "Alterar configuração", podemos alterar para redundância local.

![pt_07](https://github.com/user-attachments/assets/f39d14ed-ea49-4bde-ba52-d5f21d0441dd)

Podemos visualizar quanto vai sair a brincadeira por mês e enfim clicamos em "Criar".

![pt_08](https://github.com/user-attachments/assets/65136ec7-7f73-4e04-8d6e-260b6c1d2b47)

Vamos então criar outro recurso, o Storage Account, podemos voltar no marketplace do nosso grupo de recurso e buscar pelo nome dele, assim como o Azure SQL, clicar na opção "Criar" abaixo do card dele.

![pt_09](https://github.com/user-attachments/assets/1a1e53c8-6227-43a4-a442-23b0b62daa9f)

Aqui definimos o nome da conta, serviço primario e o tipo de redundância, que alteramos para loca.

![pt_10](https://github.com/user-attachments/assets/4878d26e-a984-4629-894c-afd947ac3e2f)

Em avançado, selecionamos o checkbox da opção "Permitir a habilitação do acesso anônimo em contêineres individuais", caso contrario não conseguiremos acessar o recurso.

![pt_11](https://github.com/user-attachments/assets/168b97b1-7dfb-43c6-848d-302becf4d66d)

Após criado o Storage Account vamos ir em Armazenamento de Dados -> Contêineres, na 2º barra lateral.

![pt_12](https://github.com/user-attachments/assets/5b9c3b62-e56b-48bc-8cc5-85a9f5fe2354)

Vamos clicar na opção "+ Contêiner".

![pt_13](https://github.com/user-attachments/assets/0ed5420e-0b06-43c5-ab7a-45b09b716c51)

Adicionamos o nome do contêiner e mudamos o nível de acesso para **Blob**. Então clicamos em criar.

![pt_14](https://github.com/user-attachments/assets/42cd9d7d-8791-443a-9bbf-07a9244e7906)

Após criado nosso contêiner vamos buscar as credenciais necessárias para adicionar em nossa aplicação, podemos encontrar a env `BLOB_CONNECTION_STRING` em "Segurança + rede" -> "Chaves de acesso". `BLOB_CONTAINER_NAME` é o nome no nosso container e `BLOB_ACCOUNT_NAME` é o nome do Storage Account.

![pt_15](https://github.com/user-attachments/assets/7170bbb7-495b-4307-b139-97d13de13bb7)

Em **key1** podemos clicar em mostrar e pegar o valor.

![pt_16](https://github.com/user-attachments/assets/07f18795-5f0a-4065-9e4a-d26b1ce50baa)

### Agora vamos encontrar os dados de conexão do banco

Vamos acessar nosso grupo de recursos e entrar no SQL Server.

![pt_01_grupo_recursos](https://github.com/user-attachments/assets/e767ac6c-9a3a-49e4-828b-b2b1bb78981d)

Nele vamos em Configurações -> Cadeis de conexão e aqui vamos encontrar `SQL_SERVER` e `SQL_DATABASE` que é o catalog.

`SQL_USER` e `SQL_PASSWORD` foram definidos quando criamos o banco.

![pt_02_dados_sql_server](https://github.com/user-attachments/assets/411f377b-b3ab-4cf8-8110-0be571c727ab)

Vamos em "Visão geral" e "Definir firewall do servidor" para adicionar o nosso IP.

![pt_04_acessando_firewall](https://github.com/user-attachments/assets/ae727214-be55-44df-b351-2631119cf53e)

Aqui definimos "Redes selecionadas" e "Adicionar o endereço IPv4 do cliente", também marcamos o checkbox "Permitir que serviços e recursos do Azure acessem esse servidor".

![pt_05_criando_firewall](https://github.com/user-attachments/assets/ebb1c954-3903-4712-93c8-9f90e1672e19)

Vamos então acessar a opção "Editor de consultar", Query, vamos criar nossa tabela.

![pt_06_login_query](https://github.com/user-attachments/assets/d79917b1-ea71-4224-9cbd-f866a26c5ecc)

Após logado vamos criar nossa tabela, SQL abaixo:

```SQL
CREATE TABLE PRODUCTS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    "NAME" NVARCHAR(255),
    "DESCRIPTION" NVARCHAR(MAX),
    PRICE DECIMAL(18,2),
    IMAGE_URL NVARCHAR(2083)
)
```
![pt_07_create_table](https://github.com/user-attachments/assets/e6bfcd3e-9148-4add-8d43-9c753217170b)

---

### Código Python do E-commerce

Após criado o arquivo `requirements.txt` temos de rodar o comando `pip install -r requirements.txt`. Caso não tenha o pip será necessário configurar na sua máquina.

Após baixada as dependências, vamos criar o arquivo com o código, exemplo original está [aqui](./main.py).

```py
import os
import uuid

import pymssql
import streamlit as st
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv

load_dotenv()

blobConnectionString = os.getenv('BLOB_CONNECTION_STRING')
blobContainerName = os.getenv('BLOB_CONTAINER_NAME')
blobAccountName = os.getenv('BLOB_ACCOUNT_NAME')

SQL_SERVER = os.getenv('SQL_SERVER')
SQL_DATABASE = os.getenv('SQL_DATABASE')
SQL_USER = os.getenv('SQL_USER')
SQL_PASSWORD = os.getenv('SQL_PASSWORD')

# Save image on blob storage
def upload_blob(file):
    blob_service_client = BlobServiceClient.from_connection_string(blobConnectionString)
    container_client = blob_service_client.get_container_client(blobContainerName)
    
    blob_name = str(uuid.uuid4()) + file.name
    blob_client = container_client.get_blob_client(blob_name)
    
    blob_client.upload_blob(file.read(), overwrite=True)
    
    image_url = f"https://{blobAccountName}.blob.core.windows.net/{blobContainerName}/{blob_name}"
    return image_url


st.header('Cadastrado de produto')
# Campos do formulário
product_name = st.text_input('Nome do Produto')
product_price = st.number_input('Preço do Produto', min_value=0.0, format="%.2f")
product_description = st.text_area('Descrição do Produto')
product_image = st.file_uploader('Imagem do Produto', type=['jpg', 'png', 'jpeg'])

def insert_product(product_name, product_price, product_description, product_image):
    try:
        image_url = upload_blob(product_image)
        conn = pymssql.connect(server=SQL_SERVER, user=SQL_USER, password=SQL_PASSWORD, database=SQL_DATABASE)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO PRODUCTS ("NAME", PRICE, "DESCRIPTION", image_url) 
            VALUES (%s, %s, %s, %s)
        """, (product_name, product_price, product_description, image_url))

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        st.error(f'Erro ao inserir produto: {e}')
        return False

def list_products():
    try:
        conn = pymssql.connect(server=SQL_SERVER, user=SQL_USER, password=SQL_PASSWORD, database=SQL_DATABASE)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM PRODUCTS")
        rows = cursor.fetchall()
        conn.close()
        return rows
    except Exception as e:
        st.error(f'Erro ao listar produtos: {e}')
        return False
    
def list_produtos_screen():
    products = list_products()

    if products:
        # Define o número de cards por linha
        cards_por_linha = 3

        # Cria as colunas iniciais
        cols = st.columns(cards_por_linha)

        for i, product in enumerate(products):
            col = cols[i % cards_por_linha]
            with col:
                st.markdown(f"### {product[1]}")
                st.write(f"**Descrição:** {product[2]}")
                st.write(f"**Preço:** R$ {product[3]:.2f}")

                if product[4]:
                    html_img = f"<img src='{product[4]}' width='200' height='200' alt='Imagem do produto'>"
                    st.markdown(html_img, unsafe_allow_html=True)

                st.markdown("---")

            # A cada `cards_por_linha` produtos, cria novas colunas se houver mais produtos
            if (i + 1) % cards_por_linha == 0 and (i + 1) < len(products):
                cols = st.columns(cards_por_linha)
    else:
        st.info("Nenhum produto encontrado.")

# Botão para salvar produto
if st.button('Salvar Produto'):
    insert_product(product_name, product_price, product_description, product_image)

    return_message = 'Produto salvo com sucesso'
    st.success(return_message)
    list_produtos_screen()

# Título da seção de produtos cadastrados
st.header('Produtos Cadastrados')

# Botão para listar produtos
if st.button('Listar Produtos'):
    list_produtos_screen()

    return_message = 'Produtos listados com sucesso'
    st.success(return_message)
```

[Aqui](./explicacao_code.md) uma explicação sobre o código acima.

Após criar o código podemos executá-lo com o comando `streamlit run main.py`.

**CASO** esteja no linux como eu, terá de criar um **venv**, para isso seguir os comandos:
 * apt install python3.8-venv
 * python3 -m venv venv
 * source venv/bin/activate

Após isso baixar as dependências novamente `pip install -r requirements.txt`, então podemos executar `venv/bin/python -m streamlit run main.py`.

Com isso nosso projeto estará executando lindamente.

Print da tela de cadastro✨

![pt_08-Cadastro-produto](https://github.com/user-attachments/assets/07ea11c3-306b-4e39-a67a-1b72b07068bc)

Print da tela de listagem de produto✨

![pt-09-listagem-produtos](https://github.com/user-attachments/assets/6e4386e3-f52d-4dd6-a764-b38f39891c3e)