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