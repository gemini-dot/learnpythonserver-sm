from flask import Blueprint
from middleware.rate_limiting import limit_requests
from controllers.group_password.create_a_password import kiem_tra2

app_route2 = Blueprint('auth_create', __name__)

@app_route2.route('/create-a-pass', methods=["POST"])
@limit_requests(max_requests=5, period=60)

def create_a_pass():
    return kiem_tra2()