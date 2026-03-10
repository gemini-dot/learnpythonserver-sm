from flask import request,jsonify
from configs.db import db
from datetime import datetime

def lock_file_services():
    try:
        gmail = request.cookies.get("user_gmail")
        username = request.cookies.get("ten_nguoi_dung")

        if not gmail:
                return jsonify({"trang_thai": False, "mes": "Vui lòng đăng nhập"}), 401
        
        collection = db['quyen_han_nguoi_dung']

        ket_qua = collection.find_one({'gmail':gmail})

        if not ket_qua:
            new_user = {
                'username': username,
                'gmail': gmail,
                'trang_thai': 'khoa',
                'thoi_gian': datetime.now(),
                'ip': request.remote_addr
            }
            collection.insert_one(new_user)
            ket_qua = new_user

        if str(ket_qua.get("trang_thai")) == 'khoa':
            return jsonify({"trang_thai": False,'mes':'bạn chưa có đủ quyền hạn để truy cập nội dung này'}),401
        return jsonify({"trang_thai": True,'mes':'ok'}),200
    except Exception as e:
        return jsonify({"trang_thai": False,'mes':'error from server'}),500