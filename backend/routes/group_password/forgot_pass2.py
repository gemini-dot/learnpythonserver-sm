from flask import Blueprint, request, jsonify
from middleware.rate_limiting import limit_requests
from services.group_mk.forgot_password2 import kiem_tra_xac_nhan
from middleware.rate_limiting import limit_requests
from flask_cors import CORS, cross_origin

app_route3 = Blueprint("auth_xac_thuc_mk", __name__)
CORS(app_route3)

@app_route3.route("/tim-mat-khau2", methods=["GET"])
@cross_origin()

@limit_requests(max_requests=5,period=60)

def xac_thuc():
    gmail = request.args.get('gmail')
    token = request.args.get('token')

    kiem_tra = kiem_tra_xac_nhan(gmail,token)
    
    if kiem_tra["success"]:
        return jsonify(kiem_tra),200
    return jsonify(kiem_tra), 400
