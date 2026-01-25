from flask import Blueprint
#import nội bộ
from middleware.rate_limiting import limit_requests
from controllers.group_password.forgot_password import gui_yeu_cau

app_route4 = Blueprint("auth_tim_mk", __name__)

@app_route4.route("/tim-mat-khau1", methods=["POST"])

@limit_requests(max_requests=5, period=60)

def tim_mat_khau1():
    return gui_yeu_cau()

