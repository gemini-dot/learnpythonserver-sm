from flask import request, jsonify
from configs.db import db
from datetime import datetime
from utils.kiem_tra_thong_tin import lam_dep_thiet_bi 

def log_sh():
    # Lấy dữ liệu từ Cookie
    gmail = request.cookies.get("user_gmail")
    ten_nguoi_dung = request.cookies.get("ten_nguoi_dung")
    ua_string = request.headers.get('User-Agent')

    # Lấy dữ liệu JSON từ Body
    data = request.get_json()

    if not gmail or not ten_nguoi_dung or not data or not data.get("id"):
        return jsonify({'trang_thai': False, 'mes': "Thiếu thông tin xác thực hoặc dữ liệu file"}), 400

    collection = db['log_user_share']
    thong_tin_may = lam_dep_thiet_bi(ua_string)

    try:
        collection.insert_one({
            "id_file": data.get("id"),
            "name_file": data.get("name"),
            "timestamp": datetime.now(),
            "gmail": gmail,
            "username": ten_nguoi_dung,
            "ip_address": request.remote_addr,
            "fingerprint":{
                'thiet_bi':thong_tin_may,
            }
        })
        return jsonify({'trang_thai': True, 'mes': "Đã ghi log thành công!"}), 200
    except Exception as e:
        return jsonify({'trang_thai': False, 'mes': str(e)}), 500