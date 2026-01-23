from flask import Blueprint, request, jsonify
from middleware.rate_limiting import limit_requests
from services.group_mk.forgot_password1 import kiem_tra_dat_lai_mat_khau
from services.group_mk.forgot_password2 import kiem_tra_xac_nhan


app_route4 = Blueprint("auth_tim_mk", __name__)

@app_route4.route("/tim-mat-khau1", methods=["POST"])

@limit_requests(max_requests=5, period=60)

def gui_yeu_cau():
    du_lieu = request.get("gmail")

    if not du_lieu:
        return jsonify({
            "success": False,
            "message": "Thiếu email rồi bạn ơi!"
        }),400

    ket_qua = kiem_tra_dat_lai_mat_khau(du_lieu)
    return jsonify({
        "message": ket_qua
    }),200
