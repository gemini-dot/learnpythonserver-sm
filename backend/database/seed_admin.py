import sys
import os
from backend.configs.db import db
from backend.utils.hash_password import make_salt, hash_password
from backend.logs.logger import logger
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

def create_initial_admin():
    admin_collection = db["users"]
    
    # Kiểm tra thực tế kết nối
    try:
        db.command('ping')
        logger.info("system: find to connect mongodb ")
    except Exception as e:
        logger.error(f"system: error connect {e}")
        sys.exit(1)

    # Kiểm tra tồn tại
    if admin_collection.find_one({"role": "admin-root"}):
        logger.warning("Canh bao: Tai khoan Admin-Root đa ton tai trong he thong!")
        return

    # Thông tin admin
    username = os.getenv("ADMINROOTUSER")
    password = os.getenv("ADMINROOTPASS")
    
    salt = make_salt()
    hashed = hash_password(password, salt)
    
    admin_data = {
        "username": username,
        "password": hashed,
        "salt": salt,
        "role": "admin-root",
        "full_name": "Hệ Thống Admin"
    }

    try:
        admin_collection.insert_one(admin_data)
        logger.info(f"Thanh cong: Đa khoi tao quyen Admin-Root cho {username}")
    except Exception as e:
        logger.error(f"Loi khi luu Admin vào DB: {e}")

if __name__ == "__main__":
    create_initial_admin()