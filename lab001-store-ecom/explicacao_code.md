### 🔧 **1. Configurações iniciais e variáveis de ambiente**

```python
import os, uuid, pymssql, streamlit as st
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv

load_dotenv()
```

- **Carrega variáveis do `.env`** (como conexões com banco e Azure).
- Importa bibliotecas necessárias:
  - `pymssql`: conecta com SQL Server.
  - `streamlit`: cria a interface web.
  - `azure.storage.blob`: para enviar imagens para o Azure Blob Storage.

---

### 🔐 **2. Pega dados de conexão**

```python
blobConnectionString = os.getenv('BLOB_CONNECTION_STRING')
...
SQL_PASSWORD = os.getenv('SQL_PASSWORD')
```

- Lê variáveis de ambiente para conexão com **Azure Blob** e **SQL Server**.

---

### 🖼️ **3. Função `upload_blob(file)`**

```python
def upload_blob(file):
    ...
    image_url = f"https://{blobAccountName}.blob.core.windows.net/{blobContainerName}/{blob_name}"
    return image_url
```

- Envia a imagem do produto para o **Azure Blob Storage**.
- Gera um **link da imagem** e retorna esse link.

---

### 📝 **4. Campos do formulário (Streamlit UI)**

```python
product_name = st.text_input('Nome do Produto')
product_price = st.number_input('Preço do Produto', ...)
...
```

- Cria campos para o usuário digitar nome, preço, descrição e enviar imagem do produto.

---

### 💾 **5. Função `insert_product(...)`**

```python
def insert_product(...):
    ...
    cursor.execute("""
        INSERT INTO PRODUCTS ("NAME", PRICE, "DESCRIPTION", image_url)
    """, (...))
```

- Salva os dados do produto no banco de dados SQL Server.
- Primeiro, envia a imagem para o Azure.
- Depois, insere tudo na tabela `PRODUCTS`.

---

### 📋 **6. Função `list_products()`**

```python
def list_products():
    cursor.execute("SELECT * FROM PRODUCTS")
    ...
```

- Consulta todos os produtos no banco e retorna os dados como lista.

---

### 🖼️ **7. Função `list_produtos_screen()`**

```python
def list_produtos_screen():
    ...
```

- Exibe os produtos em "cards" de 3 em 3 colunas.
- Cada card mostra:
  - Nome
  - Descrição
  - Preço
  - Imagem (se tiver)

---

### ✅ **8. Botão: Salvar Produto**

```python
if st.button('Salvar Produto'):
    insert_product(...)
    st.success('Produto salvo com sucesso')
    list_produtos_screen()
```

- Quando clica no botão, salva o produto e mostra a lista atualizada.

---

### 📦 **9. Botão: Listar Produtos**

```python
if st.button('Listar Produtos'):
    list_produtos_screen()
    st.success('Produtos listados com sucesso')
```

- Exibe os produtos já cadastrados, mesmo sem cadastrar novo.

---

### 🧠 Resumo

Esse código é um pequeno sistema de cadastro de produtos feito com:

- **Streamlit** para interface web.
- **SQL Server** para armazenar dados.
- **Azure Blob** para salvar imagens dos produtos.