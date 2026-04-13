from flask import Flask, request
import os
from pymongo import MongoClient

def get_database():
    uri = str(os.getenv("MONGO_URI"))
    if not uri:
        print("lỗi")
        return None
    try:
        client = MongoClient(uri)
        client.admin.command("ping")
        db_admin = client["myDatabase"]
        return db_admin
    except Exception as e:
        print(f"{e}")


db = get_database()

if db is not None:
    try:
        db["users"].drop_index("key_1")
    except Exception as e:
        print(f"{e}")


app = Flask(__name__)


@app.route("/login", methods=['POST'])
def login() -> tuple:
    try:
        collection = db['users']
        data = request.get_json()
        if not data:
            return {'trang_thai':False, 'mes':'không có dữ liệu'}, 404
        
        gmail_user = data.get("gmail")
        password = data.get("password")

        if not gmail_user or not password:
            return {'trang_thai':False, 'mes':'không có dữ liệu'}, 404
        
        res_db = collection.find_one({'gmail':gmail_user},{'gmail': 1, 'password': 1, '_id': 0})

        if not res_db:
            return {'trang_thai':False, 'mes':'sai tài khoản khoặc mật khẩu'}, 401
        
        if str(res_db.get("password")) == str(password):
            return {'trang_thai':True, 'mes':'đăng nhập thành công'}, 200
        
        return {'trang_thai':False, 'mes':'sai tài khoản hoặc mật khẩu'}, 401
    except Exception as e:
        print(f"{e}")
        return {'trang_thai':False, 'mes':'có lỗi nào đó từ phía server'}, 500
@app.route("/")
def main():
    return "hello", 200


if __name__ == "__main__":
    try:
        port = int(os.getenv("PORT", 8000))
        app.run(host="0.0.0.0", port=port)
    except Exception as e:
        print(f"{e}")
