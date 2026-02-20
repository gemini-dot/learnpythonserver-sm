from flask import Blueprint

# import nội bộ
from middleware.rate_limiting import limit_requests
from controllers.group_password.forgot_password.forgot_password import gui_yeu_cau
from configs.settings import MAX_REQUESTS, PERIOD

app_route4 = Blueprint("auth_tim_mk", __name__)


@app_route4.route("/tim-mat-khau1", methods=["POST"])
@limit_requests(max_requests=MAX_REQUESTS, period=PERIOD)
def tim_mat_khau1():
    return gui_yeu_cau()
