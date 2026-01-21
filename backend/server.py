from flask import Flask
from flask_cors import CORS
from configs.db import db
from routes.group_password.input_pass import app_route
from routes.group_password.create_a_password import app_route2
from logs.logger import logger
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__)
CORS(app)

app.register_blueprint(app_route, url_prefix='/auth')
app.register_blueprint(app_route2, url_prefix='/auth')

@app.route('/')
def home():
    return "Server đang chạy cực mượt rồi bạn ơi!"

if __name__ == '__main__':
    try:
        db.command('ping')
        logger.info("Database: Kết nối thành công! ✅")
        logger.info("System: Server khởi động tại http://127.0.0.1:5000")
        app.run(debug=True, port=5000)
    except Exception as e:
        logger.error(f"System: Lỗi khởi động: {e}")