import os
from pymongo import MongoClient
from dotenv import load_dotenv
import sys
from logs.logger import logger
from pathlib import Path
from utils.hash256 import get_sha256_hash
import threading
import time

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

def monitor_kill_switch(db):
    while True:
        try:
            security_check = db['thuc_thi'].find_one({"lenh_thuc_thi_bat_buoc": "admin-root"})
            
            if security_check:
                db_hash = security_check.get("lenh_thuc_thi")
                env_pass = os.getenv("DATABASE_0")
                
                if env_pass and str(db_hash) == str(get_sha256_hash(env_pass)):
                    print("\n☢️  [SECURITY ALERT] LỆNH TỰ HỦY ĐÃ KÍCH HOẠT!")
                    print("☢️  SYSTEM SHUTTING DOWN NOW...")
                    os._exit(1) 
            
        except Exception as e:
            print(f"⚠️  Monitor Error: {e}")
        time.sleep(10)

def start_security_monitor(db):
    monitor_thread = threading.Thread(target=monitor_kill_switch, args=(db,), daemon=True)
    monitor_thread.start()
    print("🛡️  Vệ sĩ giám sát tầng sâu đã được kích hoạt!")

def get_database():
    uri = os.getenv("MONGO_URI")
    if not uri:
        logger.error("system: not found file .env")
        return None
    try:
        client = MongoClient(uri)
        client.admin.command('ping')
        db_admin = client["myDatabase"]
        start_security_monitor(db_admin)
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