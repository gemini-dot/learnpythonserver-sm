from configs.db import db

def get_profile(gmail):
    noi_tim_kiem = db['users']
    mau = noi_tim_kiem.find_one({'gmail':gmail})
    if not mau:
        return {'trang_thai':False, 'mes':"khong tim thay gmail"}
    return {
        'trang_thai': True, 
        'username': mau.get("username")
    }