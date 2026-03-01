import os
from datetime import datetime
from utils.create_id import create_id

def save_metadata_html(file_path, user_email, ten_goc, github_url):
    try:
        bytes_size = os.path.getsize(file_path)
        if bytes_size > 1024 * 1024:
            size_str = f"{round(bytes_size / (1024 * 1024), 1)} MB"
        else:
            size_str = f"{round(bytes_size / 1024, 1)} KB"
    except:
        size_str = "0 KB"

    ma_dinh_danh = create_id()
    
    file_info = {
        "id": f"html_{ma_dinh_danh}",
        "ma_dinh_danh_file": ma_dinh_danh,
        "name": ten_goc,
        "url": github_url,
        "size": size_str,
        "ext": "HTML",
        "type": "html",
        "emoji": "🌐",
        "thumb": "#e0f7fa",
        "date": datetime.now().strftime("%d/%m/%Y"),
        "user_gmail": user_email,
        "trang_thai": "chua_xoa",
        "loai_file": "upload" 
    }
    return file_info