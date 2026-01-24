from utils.gui_mail import gui_mail_reset
from configs.db import db
from utils.make_token import tao_token_10_so
from logs.logger import logger

def kiem_tra_dat_lai_mat_khau(gmail):

    cho_luu_token = db["token"]
    user = db['users']

    try:
        db.command('ping')
        logger.info("system: find to connect mongodb ")
    except Exception as e:
        logger.error(f"system: error connect {e}")

    kiem_tra_ton_tai = user.find_one({"gmail":gmail})
    
    if kiem_tra_ton_tai is None:
        return "người dùng không tồn tại"
    
    tao_token = tao_token_10_so()

    dieu_kien = {"gmail": gmail} 
    noi_dung_thay_doi = {"$set": {"token_nguoi_dung": tao_token}}

    cho_luu_token.update_one(dieu_kien, noi_dung_thay_doi, upsert=True)

    gui_mail_reset(gmail, tao_token)
    return "Đã gửi mã xác thực thành công!"