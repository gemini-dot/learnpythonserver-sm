from models.mongodb__pass import User
from configs.db import db
from logs.logger import logger
from utils.hash_password import hash_password, make_salt
from utils.make_token import tao_token_10_so
from utils.hash import hash


def kiem_tra(email_gui_len, pass_gui_len):

    noi_tim_kiem = db["users"]  # truy cập vào kho của tôi:))

    try:
        db.command("ping")
        logger.info("system: find to connect mongodb ")
    except Exception as e:
        logger.error(f"system: error connect {e}")

    kiem_tra_1 = noi_tim_kiem.find_one({"gmail": email_gui_len})

    if kiem_tra_1 is None:
        return {"success": False, "message": "Người dùng không tồn tại!"}

    role = kiem_tra_1["role"]

    salt = kiem_tra_1.get("salt")
    pass_hash = hash_password(pass_gui_len, salt)

    token_new = tao_token_10_so()
    token_new_hash = hash(str(token_new))

    if kiem_tra_1["password"] == pass_hash:
        noi_tim_kiem.update_one(
            {"gmail": email_gui_len},
            {"$set": {"token_nguoi_dung_upload": token_new_hash}},
        )
        return {
            "success": True,
            "message": "Đăng nhập thành công! Chào bạn nhé!",
            "token": token_new,
            "role": role,
        }
    else:
        return {"success": False, "message": "Sai mật khẩu rồi kìa!"}
