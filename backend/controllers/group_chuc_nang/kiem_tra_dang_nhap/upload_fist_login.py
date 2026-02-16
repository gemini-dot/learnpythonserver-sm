from flask import request, jsonify
from services.group_chuc_nang.kiem_tra_dang_nhap.up_load_fist_login import kiem_tra_token_link

def kiem_tra_token():
    try:
        nguoi_dung = request.cookies.get('gmail','')
        token_nguoi_dung = request.cookies.get("token","")

        ket_qua = kiem_tra_token_link(nguoi_dung, token_nguoi_dung, "users", "token_nguoi_dung_upload")

        if ket_qua["success"]:
            return jsonify(ket_qua),200
        return jsonify(ket_qua),401
    except Exception as e:
        return jsonify({"success": False, "message": "Lỗi hệ thống nghiêm trọng!"}),500