from flask import session,send_from_directory
from functools import wraps
from configs.duong_dan_thu_muc import thu_muc_chinh
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = session.get("user_gmail")
        trang_thai = session.get("trang_thai")

        if not user or str(trang_thai) != 'da_dang_nhap':
            return send_from_directory(thu_muc_chinh("frontend/view/error"), "401.html"), 401

        return f(*args, **kwargs)
        
    return decorated_function