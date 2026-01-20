import logging
import os
from logging.handlers import RotatingFileHandler
import sys

# 1. Tự động xác định đường dẫn thư mục hiện tại để không bị lỗi "backend/backend"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
log_dir = os.path.join(BASE_DIR, 'logs')

if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# 2. Cấu hình logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        # Thêm encoding='utf-8' để ghi tiếng Việt vào file app.log không bị lỗi
        RotatingFileHandler(
            os.path.join(log_dir, 'app.log'), 
            maxBytes=5000000, 
            backupCount=3, 
            encoding='utf-8'
        ),
        # Dùng StreamHandler với encoding chuẩn để in ra Console không bị đỏ lòm
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)