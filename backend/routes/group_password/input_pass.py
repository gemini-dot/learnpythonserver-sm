from flask import Blueprint
#import nội bộ
from middleware.rate_limiting import limit_requests
from controllers.group_password.input_pass import kiem_tra1

app_route = Blueprint('auth_input',__name__)

@app_route.route("/input-pass", methods=["POST"])

@limit_requests(max_requests=5, period=60)

def input_pass():
    return kiem_tra1()


    

