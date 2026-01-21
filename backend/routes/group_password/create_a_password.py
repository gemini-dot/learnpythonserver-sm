from flask import Blueprint, request, jsonify
from middleware.rate_limiting import limit_requests
from services.group_mk.create_a_password import kiem_tra_mat_khau

app_route2 = Blueprint('auth_create', __name__)

@app_route2.route('/create-a-pass',methods=["POST"])

@limit_requests(max_requests=5, period=60)

def kiem_tra2():
    dulieu = request.get_json()
    nguoi_dung = dulieu.get("gmail",'')
    mat_khau = dulieu.get("password", '')
    ket_qua = kiem_tra_mat_khau(nguoi_dung, mat_khau)
    code = 200
    if ket_qua.get("status") == "error":
        loi = ket_qua.get("error_type")
        if loi == "loi_trung_email": code = 409
        elif loi == "loi_luu_tru_database": code = 500
        else: code = 400
    return jsonify(ket_qua), code and print("gửi lên ok!(route/group_password/create_a_password)")