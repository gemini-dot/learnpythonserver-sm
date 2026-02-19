from validators.kiem_tra_dinh_dang_gmail import kiem_tra_dinh_dang_gmail
from validators.kiem_tra_do_bao_mat_pass import check_password_strength
from configs.db import db
from logs.logger import logger
from utils.hash_password import hash_password,make_salt

def kiem_tra_mat_khau(user_name_input ,gmail_input, password_input):
    
    luu_tru = db['users']

    try:
        db.command('ping')
        logger.info("system: find to connect mongodb ")
    except Exception as e:
        logger.error(f"system: error connect {e}")

    if luu_tru.find_one({"gmail": gmail_input}):
        logger.warning(f"Email {gmail_input} đã tồn tại.")
        return {
            "status": "error", 
            "error_type": "loi_trung_email", 
            "message": "Email này đã được sử dụng rồi!",
        }

    if not kiem_tra_dinh_dang_gmail(gmail_input):
        return {
            "status": "error", 
            "error_type": "loi_dinh_dang_gmail",
            "message": "Định dạng Gmail không hợp lệ!"
        }

    is_valid, message = check_password_strength(password_input)

    if not is_valid:
        return {
            "status": "error", 
            "error_type": "loi_do_manh_pass", 
            "message": message
        }

    
    try:
        salt = make_salt()
        hashed = hash_password(password_input, salt)
        
        user_data = {
            "username": user_name_input,
            "gmail": gmail_input,
            "password": hashed,
            "salt": salt,
            "cap_nguoi_dung":"basic",
            "thoi_gian_cap_trang_thai":0,
            "khong_gian_luu_tru":"128",
            "role": "user"
        }
        
        luu_tru.insert_one(user_data)

        return {
            "status": "good", 
            "message": "Tạo tài khoản thành công rồi nhé!"
        }
    except Exception as e:
        logger.error(f"Lỗi database: {e}")
        return {
            "status": "error", 
            "error_type": "loi_luu_tru_database", 
            "message": "Lỗi hệ thống, vui lòng thử lại sau!"
        }