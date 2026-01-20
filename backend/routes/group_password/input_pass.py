from flask import Blueprint, request, jsonify
from middleware.rate_limiting import limit_requests
from services.group_mk.login import kiem_tra

app_route = Blueprint('main',__name__)
@app_route.route("/input-pass", methods=["POST"])

@limit_requests(max_requests=5, period=60)

def kiem_tra():
    du_lieu = request.get_json()
    nguoi_dung = du_lieu.get('email')
    mat_khau = du_lieu.get('password')
    ket_qua = kiem_tra(nguoi_dung, mat_khau)
    if ket_qua['success']:
        return jsonify(ket_qua), 200
    else:
        return jsonify(ket_qua), 401
    

