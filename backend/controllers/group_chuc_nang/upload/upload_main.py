import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

# 1. Cấu hình tài khoản (Thay bằng thông số của og nhé)
cloudinary.config( 
  cloud_name = "dshgtuy8f", 
  api_key = "181457765166456", 
  api_secret = "6WP17jm02xdtxUlZ4F9sHcOjpd8",
  secure = True
)

def upload_my_image(file_path):
    try:
        # 2. Thực hiện upload
        response = cloudinary.uploader.upload(file_path)
        
        # 3. Lấy URL của ảnh sau khi upload thành công
        image_url = response.get("secure_url")
        print(f"Thành công rồi og ơi! Link ảnh đây: {image_url}")
        return image_url
        
    except Exception as e:
        print(f"Có lỗi rồi: {e}")

# Chạy thử (Thay 'test.jpg' bằng file ảnh có sẵn trong thư mục code)
upload_my_image("/home/laivansam/Pictures/93 600_600.jpeg")