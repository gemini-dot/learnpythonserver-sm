from flask import Blueprint, request, jsonify

app_route6 = Blueprint("auth_cookie", __name__)


@app_route6.route("check-status")
def check_status():
    token = request.cookies.get("user_token")
    if token:
        return jsonify({"exists": True, "user": token}), 200
    return jsonify({"exists": False}), 401
