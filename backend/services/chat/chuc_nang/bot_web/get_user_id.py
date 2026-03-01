from flask import request


def get_user_id():
    user_id = request.cookies.get("user_id")

    if not user_id:
        user_id = request.headers.get("X-User-ID") or request.remote_addr

    return user_id
