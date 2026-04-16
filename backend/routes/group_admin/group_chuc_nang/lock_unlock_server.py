from flask import Blueprint, request
from configs.db import db
import secrets
import os

admin_bp = Blueprint("admin", __name__)

admin_pass_on, admin_pass_off = str(os.getenv("BAOTRI_KEY_ON")), str(
    os.getenv("BAOTRI_KEY_OFF")
)

tim_kiem = db["trang_thai_web"]


@admin_bp.route("/lock-server")
def lock():
    pw = request.args.get("key", "")
    if admin_pass_on and secrets.compare_digest(pw, admin_pass_on):
        tim_kiem.update_one({"id": "config"}, {"$set": {"status": "website_off"}})
        return "Đã bật chế độ bảo trì!", 200
    return "Sai mật khẩu!", 403


@admin_bp.route("/unlock-server")
def unlock():
    pw = request.args.get("key", "")
    if admin_pass_off and secrets.compare_digest(pw, admin_pass_off):
        tim_kiem.update_one({"id": "config"}, {"$set": {"status": "website_on"}})
        return "Đã mở cửa server!", 200
    return "Sai mật khẩu!", 403
