from configs.db import db
from utils.hash_password import make_salt, hash_password

def create_initial_admin():
    admin_collection = db["users"]

    if admin_collection.find_one({"role": "admin-root"}):
        print("Tài khoản Admin đã tồn tại!")
        return
    username = "samisadmin1192011@gmail.admin"
    password = "admin1192011@admin.com"
    salt = make_salt()
    hashed = hash_password(password, salt)
    admin_data = {
        "username": username,
        "password": hashed,
        "salt": salt,
        "role": "admin-root",
        "full_name": "Hệ Thống Admin"
    }

    admin_collection.insert_one(admin_data)
    print(f"Đã tạo thành công tài khoản Admin có quyền cao nhất: {username}")
if __name__ == "__main__":
    create_initial_admin()