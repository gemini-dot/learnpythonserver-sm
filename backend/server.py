from flask import Flask
from flask_cors import CORS
import os
import sys
import io
#import file nội bộ
from configs.db import db
from routes.group_password.input_pass import app_route
from routes.group_password.create_a_password import app_route2
from logs.logger import logger
from routes.group_password.forgot_password import app_route4
from routes.group_password.forgot_pass2 import app_route3
from routes.group_password.forgot_password3 import app_route5

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__)
CORS(app)

app.register_blueprint(app_route, url_prefix='/auth')
app.register_blueprint(app_route2, url_prefix='/auth')
app.register_blueprint(app_route3,url_prefix='/auth')
app.register_blueprint(app_route4,url_prefix='/auth')
app.register_blueprint(app_route5,url_prefix='/auth')

@app.errorhandler(404)
def page_not_found(e):
    return {"error": "Đường dẫn này không tồn tại rồi bạn ơi!"}, 404

@app.errorhandler(500)
def internal_server_error(e):
    return {"error": "Server đang bị 'hắt hơi sổ mũi', đợi xíu nhé!"}, 500

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

#hỡi người anh em
#nếu bro gặp lỗi và đang cố gắng fix lỗi(90% là vậy)
#thì xin lỗi...
#chỉ có chúa với tui là hiểu nó chạy thế nào
#và giờ chỉ còn chúa thôi