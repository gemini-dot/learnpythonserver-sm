import os
from pymongo import MongoClient
from dotenv import load_dotenv
import sys
load_dotenv() # Để đọc link database từ file .env

def get_database():
    uri = os.getenv("MONGO_URI")
    if not uri:
        print("lỗi rồi bạn ơi, cái chỗ mà nhập .env á(configs/db.py)")
        sys.exit(5)
    client = MongoClient(uri)
    return client["ten_database_cua_ong"]
db = get_database()