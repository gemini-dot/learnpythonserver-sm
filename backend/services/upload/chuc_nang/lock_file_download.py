from flask import request, jsonify


def lock_file_download_services():
    user_gmail = request.cookies.get("user_gmail")
    username = request.cookies.get("ten_nguoi_dung")
    trang_thai_tai_khoan = request.cookies.get("trang_thai")
    