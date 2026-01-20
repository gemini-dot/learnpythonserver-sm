import os
from pymongo import MongoClient
from dotenv import load_dotenv
import sys
from logs.logger import logger
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

def get_database():
    uri = os.getenv("MONGO_URI")
    if not uri:
        logger.error("system: not found file .env")
        sys.exit(1)
        
    try:
        client = MongoClient(uri)
        # Kiểm tra thử xem có connect được thật không
        client.admin.command('ping') 
        return client["myDatabase"]
    except Exception as e:
        logger.error(f"system: connet error {e}")
        sys.exit(1)

db = get_database()