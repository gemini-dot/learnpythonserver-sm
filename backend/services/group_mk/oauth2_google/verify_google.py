from configs.db import db
from datetime import datetime, timedelta

def kiem_tra_db(nguoi_dung,gmail_nguoi_dung, pic):
    collection = db['users']
    ket_qua = collection.find_one({"gmail":str(gmail_nguoi_dung)})
    if ket_qua:
        return {'trang_thai':True,'mes':'ban da dang nhap'}
    thoi_gian_hien_tai = datetime.now()
    thoi_gian_het_han = thoi_gian_hien_tai + timedelta(days=30)
    cap_nhat = {
        'username':str(nguoi_dung),
        'gmail':str(gmail_nguoi_dung),
        'cap_nguoi_dung':'basic',
        'thoi_gian_cap_trang_thai':{
            'bat_dau': thoi_gian_hien_tai,
            'ket_thuc':thoi_gian_het_han
        },
        "khong_gian_luu_tru":'128',
        'role':'user',
        "bio":'',
        "avatar_google":pic
    }
    collection.insert_one(cap_nhat)
    return {'trang_thai': True, 'mes': 'Đăng ký thành công!', 'email': gmail_nguoi_dung}