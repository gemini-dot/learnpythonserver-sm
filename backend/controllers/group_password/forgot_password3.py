from flask import request, jsonify
from services.group_mk.forgot_password3 import kiem_tra_de_doi_mat_khau
from logs.logger import logger

def doi_mat_khau_moi():

    print("đến đoạn này rồi bạn ơi, forgot_password3.py - controller")

    data = request.get_json()
    token = data.get('token')
    gmail = data.get('gmail')
    new_password = data.get('new_password')

    kiem_tra = kiem_tra_de_doi_mat_khau(token, gmail, new_password)
    
    print("đến đoạn này rồi bạn ơi, forgot_password3.py - controller")

    if kiem_tra["success"]:
        return jsonify(kiem_tra), 200
    return jsonify(kiem_tra), 400