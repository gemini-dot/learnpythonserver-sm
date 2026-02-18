from flask import request, jsonify
from services.group_chuc_nang.dashboard.get_profile_name import get_profile
def get_profile_controller():
    gmail = request.cookies.get("user_gmail")

    ket_qua = get_profile(gmail)
    if not gmail:
        return jsonify({'trang_thai': False, 'mes': "Cookie gmail trống"}), 401
    if not ket_qua['trang_thai']:
        return jsonify(ket_qua),404
    return ket_qua,200