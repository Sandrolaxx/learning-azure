import os

from azure.cosmos import CosmosClient, PartitionKey, exceptions
from dotenv import load_dotenv

load_dotenv()

COSMOS_URL = os.getenv("COSMOS_URL")
COSMOS_KEY = os.getenv("COSMOS_KEY")
COSMOS_DATABASE_NAME = os.getenv("COSMOS_DATABASE_NAME")
COSMOS_CONTAINER_NAME = os.getenv("COSMOS_CONTAINER_NAME")

client = CosmosClient(COSMOS_URL, COSMOS_KEY);

# Create database
database = client.create_database_if_not_exists(id=COSMOS_DATABASE_NAME)
# Create container
container = database.create_container_if_not_exists(
    id=COSMOS_CONTAINER_NAME,
    partition_key=PartitionKey(path="/category"),
    offer_throughput=400
)

item = {
    "id": "2",
    "ProductId": "2",
    "name": "Teclado Escritório",
    "fabricante": {
        "name": "Target",
        "modelo": "TK-200"
    },
    "priece": 150.75,
}

def create_item(item):
    try:
        container.create_item(body=item)
        print(f"Item with id {item['id']} created successfully.")
    except exceptions.CosmosHttpResponseError as e:
        print(f"An error occurred: {e.message}")

def read_item(item_id, partition_key):
    try:
        item = container.read_item(item=item_id, partition_key=partition_key)
        print(f"Item retrieved: {item}")
        return item
    except exceptions.CosmosHttpResponseError as e:
        print(f"An error occurred: {e.message}")

def update_item(item_id, partition_key, updated_fields):
    try:
        item = container.read_item(item=item_id, partition_key=partition_key)

        item.update(updated_fields)

        container.replace_item(item=item, body=item)
        
        print(f"Item with id {item_id} updated successfully.")
    except exceptions.CosmosHttpResponseError as e:
        print(f"An error occurred: {e.message}")

def delete_item(item_id, partition_key):
    try:
        container.delete_item(item=item_id, partition_key=partition_key)
        print(f"Item with id {item_id} deleted successfully.")
    except exceptions.CosmosHttpResponseError as e:
        print(f"An error occurred: {e.message}")

# Uncomment to create the item first - Error if it already exists
# create_item(item)

# update_item("1", "1", {"price": 200.40})

# delete_item("2", "2")

read_item("1", "1")
