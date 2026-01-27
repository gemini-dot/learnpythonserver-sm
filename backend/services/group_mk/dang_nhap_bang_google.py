from configs.db import db

def dang_nhap_bang_google(gmail, ten_nguoi_dung):
    thu_muc_nguoi_dung = db["users"]
    nguoi_dung = thu_muc_nguoi_dung.find_one({"gmail": gmail})
    if not nguoi_dung:
        new_user = {
            "gmail": gmail,
            "username": ten_nguoi_dung,
            "role": "user",
            'auth_type': 'google'
        }
        thu_muc_nguoi_dung.insert_one(new_user)
    return {"success": True, "message": "Đăng nhập thành công"}
