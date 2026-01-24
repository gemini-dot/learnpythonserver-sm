from configs.db import db
from logs.logger import logger

lay_token = db["token"]

def kiem_tra_het_han_token(gmail,thoi_gian_tao, thoi_gian_hien_tai, khoang_thoi_gian_het_han):
    khoang_thoi_gian_token_hoat_dong = khoang_thoi_gian_het_han - thoi_gian_tao
    khoang_thoi_gian_cua_nguoi_dung = thoi_gian_hien_tai - thoi_gian_tao
    if khoang_thoi_gian_cua_nguoi_dung > khoang_thoi_gian_token_hoat_dong:
        nguoi_dung = {"gmail":gmail}
        moi = {"$set": {"trang_thai2": "da_het_han"}}
        lay_token.update_one(nguoi_dung,moi)
        return {'success': False, 'message': 'Token đã hết hạn sử dụng'}
    return {'success': True, 'message': 'Token vẫn còn hiệu lực'}