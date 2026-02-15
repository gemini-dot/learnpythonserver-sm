from flask import request, jsonify, make_response
from services.group_mk.login import kiem_tra

def kiem_tra1():
    du_lieu = request.get_json()
    
    nguoi_dung = du_lieu.get('gmail','')
    mat_khau = du_lieu.get('password','')

    ket_qua = kiem_tra(nguoi_dung, mat_khau)

    if ket_qua['success']:
        res = make_response(jsonify(ket_qua))
        res.set_cookie("user_token", nguoi_dung, max_age=3600, httponly=True, samesite='None',secure=True,path='/')
        return res, 200
    else:
        return jsonify(ket_qua), 401