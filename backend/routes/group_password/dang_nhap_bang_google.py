from flask import Blueprint
from flask_cors import CORS, cross_origin
#import nội bộ
from backend.services.group_mk.dang_nhap_bang_google import dang_nhap_bang_google
from middleware.rate_limiting import limit_requests
from backend.controllers.group_password.dang_nhap_bang_google import dang_nhap_bang_google_google

app_route_google = Blueprint("auth_dang_nhap_bang_google", __name__)
CORS(app_route_google)

@app_route_google.route("/callback", methods=["POST"])
@cross_origin()

@limit_requests(max_requests=10,period=60)

def callback():
    return dang_nhap_bang_google()