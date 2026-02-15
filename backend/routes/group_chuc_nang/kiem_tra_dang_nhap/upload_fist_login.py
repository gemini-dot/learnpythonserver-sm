from flask import Blueprint
#import noi bo
from controllers.group_chuc_nang.kiem_tra_dang_nhap.upload_fist_login import kiem_tra_token
from middleware.rate_limiting import limit_requests

app_route7 = Blueprint("kiem_tra_dang_nhap", __name__)
@app_route7.route("/upload",methods=["POST"])

@limit_requests(max_requests=5, period=60)

def handle_check_upload_token():
    return kiem_tra_token()