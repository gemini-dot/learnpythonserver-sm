from flask import Flask
from flask_cors import CORS
from configs.db import db
from routes.group_password.input_pass import app_route
from routes.group_password.create_a_password import app_route2
from logs.logger import logger
from routes.group_password.forgot_password import app_route4
from routes.group_password.forgot_pass2 import app_route3
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__)
CORS(app)

app.register_blueprint(app_route, url_prefix='/auth')
app.register_blueprint(app_route2, url_prefix='/auth')
app.register_blueprint(app_route4,url_prefix='/auth')
app.register_blueprint(app_route3,url_prefix='/auth')

@app.route('/')
def home():
    return "Server đang chạy cực mượt rồi bạn ơi!"

if __name__ == '__main__':
    try:
        db.command('ping')
        logger.info("Database: Kết nối thành công! ✅")
        port = int(os.environ.get('PORT', 5000))
        logger.info(f"System: Server khởi động tại https://learnpythonsever-sm.onrender.com:{port}")
        app.run(host='0.0.0.0', port=port)
    except Exception as e:
        logger.error(f"System: Lỗi khởi động: {e}")