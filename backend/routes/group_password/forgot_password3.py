from flask import Blueprint
#import nội bộ
from middleware.rate_limiting import limit_requests
#from controllers.group_password.forgot_password3 import ...

app_route5 = Blueprint("auth_xac_nhan_token", __name__)
@app_route5.route("/tim-mat-khau3", methods=["POST"])

@limit_requests(max_requests=5, period=60)

def xac_nhan_token():
    pass