import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from flask import request, jsonify
from utils.cloudidary_json_get import make_json_cloud
from utils.luu_du_lieu_vao_db import luu
from utils.scan_img import check_image_sensitivity
import os
import time
import uuid

cloudinary.config(
    cloud_name="dshgtuy8f",
    api_key="181457765166456",
    api_secret="6WP17jm02xdtxUlZ4F9sHcOjpd8",
    secure=True,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(BASE_DIR, 'temp')

if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR, exist_ok=True)
    print(f"📁 Đã tạo thư mục tạm tại: {TEMP_DIR}", flush=True)
else:
    print(f"✅ Thư mục tạm đã sẵn sàng: {TEMP_DIR}", flush=True)

def upload_to_cloud_avt():
    print(request.cookies)
    user_email = request.cookies.get("user_gmail")
    trang_thai = request.cookies.get("trang_thai")

    if trang_thai != "da_dang_nhap":
        return jsonify({"loi": "nguoi_dung_chua_dang_nhap"}), 401

    if not user_email:
        return jsonify({"loi": "nguoi_dung"}), 401

    folder_name = f"my_project/users/{user_email.replace('@', '_').replace('.', '_')}"

    if "avatar" not in request.files:
        return jsonify({"error": "Không có file"}), 400

    files = request.files.getlist("avatar")
    urls = []
    error = []
    print("--- KIỂM TRA ĐẦU VÀO ---")
    print(f"Content-Length: {request.content_length}") # Xem dung lượng gửi lên có > 0 không
    print(f"Files keys: {list(request.files.keys())}")
    for file in files:
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        temp_path = os.path.abspath(os.path.join(TEMP_DIR, unique_filename))
        try:
            file.save(temp_path)
            print(f"--- Đã lưu tạm: {temp_path} ---", flush=True)
            file.seek(0)
            ten_file_goc = file.filename
            if ten_file_goc:
                print("ok, ten da co roi ban oi")
            else:
                print("loi o day ne")
                ten_file_goc = "no_name__file"
            res = check_image_sensitivity(temp_path)
            print(res,flush=True)
            level = res.get('level').upper()
            if level != 'SAFE':
                error.append({"file": ten_file_goc, "error": "Nội dung nhạy cảm"})
                os.remove(temp_path)
                continue
            print("--- Bắt đầu upload Cloudinary ---", flush=True)
            upload_result = cloudinary.uploader.upload(
                file,
                folder=folder_name,
                use_filename=True,
                resource_type="auto",
                unique_filename=True,
            )
            print("--- Upload Cloudinary xong ---", flush=True)
            file_info = make_json_cloud(upload_result, user_email, ten_file_goc, 'avatar')
            luu(file_info, "file_info")

            urls.append(file_info.get("url"))
        except Exception as e:
            print(f"Lỗi: {e}")
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    return jsonify({"mes": urls, 'error':error}), 200
