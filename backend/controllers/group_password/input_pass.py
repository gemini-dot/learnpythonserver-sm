from flask import request, jsonify
from services.group_mk.login import kiem_tra

def kiem_tra1():
    du_lieu = request.get_json()
    
    nguoi_dung = du_lieu.get('gmail','')
    mat_khau = du_lieu.get('password','')

    ket_qua = kiem_tra(nguoi_dung, mat_khau)

    if ket_qua['success']:
        return jsonify(ket_qua), 200
    else:
        return jsonify(ket_qua), 401