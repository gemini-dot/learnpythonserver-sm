import os
from pymongo import MongoClient
from dotenv import load_dotenv
import sys
from logs.logger import logger
from pathlib import Path
from utils.hash256 import get_sha256_hash

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

def get_database():
    uri = os.getenv("MONGO_URI")
    if not uri:
        logger.error("system: not found file .env")
        return None
    try:
        client = MongoClient(uri)
        client.admin.command('ping')

        db_admin = client["myDatabase"]
        security_check = db_admin['thuc_thi'].find_one({"lenh_thuc_thi_bat_buoc": "admin-root"})
        if security_check and str(security_check.get("lenh_thuc_thi")) == str(get_sha256_hash(os.getenv("DATABASE_0"))):
            for i in range(1,11):
                print(f"lệnh đóng hệ thống sẽ thực thi trong: {i} giây")
            sys.exit(1)
        return db_admin
    except Exception as e:
        logger.error(f"system: connet error {e}")

db = get_database()

if db is not None:
        try:
            db['users'].drop_index("key_1")
            print("Đã xóa Index lỗi 'key_1' thành công!")
        except Exception as e:
            pass