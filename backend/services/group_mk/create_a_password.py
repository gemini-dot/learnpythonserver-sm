from validators.kiem_tra_dinh_dang_gmail import kiem_tra_dinh_dang_gmail
from validators.kiem_tra_do_bao_mat_pass import check_password_strength
from configs.db import db
from logs.logger import logger
from utils.hash_password import hash_password,make_salt
from utils.create_number import goi_y_username
import sys
from flask import jsonify
def kiem_tra_mat_khau(gmail_input, password_input):
    luu_tru = db['users']
    try:
        db.command('ping')
        logger.info("system: find to connect mongodb ")
    except Exception as e:
        logger.error(f"system: error connect {e}")
        sys.exit(1)
    if luu_tru.find_one({"gmail":gmail_input}):
        logger.warning("tài khoản đã tồn tại trong hệ thống")
        goi_y = goi_y_username(gmail_input.split('@')[0])
        return {"status": "error", "message": "Trùng rồi", "error_type": "loi_trung_email","suggestion": goi_y}
    username = gmail_input
    password = password_input
    is_valid, message = check_password_strength(password)
    if kiem_tra_dinh_dang_gmail(username):
        if is_valid:
            salt = make_salt()
            hashed = hash_password(password, salt)
            user_data = {
                "username": username,
                "password": hashed,
                "salt": salt,
                "role": "user"
            }
            try:
                luu_tru.insert_one(user_data)
                return {
                    "status": "good",
                    "message": "lưu vào database rồi bạn ơi!"
                },201
            except Exception as e:
                logger.error(f"lỗi khi lưu vào mongobd {e}")
                return {
                    "status": "error",
                    "error_type": "loi_luu_tru_database",
                    "message": "lỗi khi lưu vào database rồi bạn ơi!"
                }
        else:
            return {
                "status": "error",
                "error_type": "loi_do_manh_pass",
                "message": message
            },400
    else:
        return {
            "status": "error",
            "error_type": "loi_dinh_dang_gmail",
            "message": "định dạng gmail này chưa đúng rồi bạn ơi!"
        }

