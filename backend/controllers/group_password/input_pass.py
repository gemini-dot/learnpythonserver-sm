from flask import request, jsonify, make_response
from services.group_mk.login import kiem_tra
from validators.kiem_tra_cap_bac import kiem_tra_cap_bac
def kiem_tra1():
    du_lieu = request.get_json()
    
    nguoi_dung = du_lieu.get('gmail','')
    mat_khau = du_lieu.get('password','')
    role = kiem_tra_cap_bac(nguoi_dung, "users")

    if str(role) == "admin-root":
        lenh = {"lenh_thuc_thi":"khong_kiem_tra"}
        res_res_res = make_response(jsonify(lenh))
        res_res_res.set_cookie("role", role, max_age=86400 * 30, httponly=True, samesite='None', secure=True, path='/')
        res_res_res.set_cookie("lenh_thuc_thi", "khong_kiem_tra", max_age=86400 * 30, httponly=True, samesite='None', secure=True, path='/')
        return res_res_res,200
    
    ket_qua = kiem_tra(nguoi_dung, mat_khau)

    if ket_qua['success']:
        token = ket_qua["token"]
        res = make_response(jsonify(ket_qua))
        res.set_cookie("user_token", token, max_age=86400 * 30, httponly=True, samesite='None',secure=True,path='/')
        res.set_cookie("user_gmail", nguoi_dung, max_age=86400 * 30, httponly=True, samesite='None', secure=True, path='/')
        res.set_cookie("role", role, max_age=86400 * 30, httponly=True, samesite='None', secure=True, path='/')
        res.set_cookie("lenh_thuc_thi", "can_kiem_tra", max_age=86400 * 30, httponly=True, samesite='None', secure=True, path='/')
        return res, 200
    else:
        res_res = make_response(jsonify(ket_qua))
        res_res.set_cookie("user_token", "", max_age=0, httponly=True, samesite='None', secure=True, path='/')
        res.set_cookie("user_gmail", '', max_age=0, httponly=True, samesite='None', secure=True, path='/')
        res.set_cookie("role", role, max_age=86400 * 30, httponly=True, samesite='None', secure=True, path='/')
        res.set_cookie("lenh_thuc_thi", "can_kiem_tra", max_age=86400 * 30, httponly=True, samesite='None', secure=True, path='/')
        return res_res, 401