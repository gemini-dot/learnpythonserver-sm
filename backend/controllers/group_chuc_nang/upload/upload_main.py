import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from flask import request,jsonify

cloudinary.config( 
  cloud_name = "dshgtuy8f", 
  api_key = "181457765166456", 
  api_secret = "6WP17jm02xdtxUlZ4F9sHcOjpd8",
  secure = True
)

def upload_to_cloud():
    print(request.cookies)
    user_email = request.cookies.get('user_gmail','')
    if not user_email:
        return jsonify({"loi":"nguoi_dung"}),401
    
    folder_name = f"my_project/users/{user_email.replace('@', '_').replace('.', '_')}"

    if 'files[]' not in request.files:
        return jsonify({"error": "Không có file"}), 400
    
    files = request.files.getlist('files[]')
    urls = []

    for file in files:
        try:
            upload_result = cloudinary.uploader.upload(
                file,
                folder = folder_name,
                use_filename = True, 
                unique_filename = True 
            )
            urls.append(upload_result.get('secure_url'))
        except Exception as e:
            print(f"Lỗi: {e}")
            
    return jsonify({"links": urls}), 200
