from flask import Flask, send_from_directory, render_template, abort, request
from flask_cors import CORS
import os
import sys
import io
#import file nội bộ
from configs.db import db
from routes.group_password.input_pass import app_route
from routes.group_password.create_a_password import app_route2
from logs.logger import logger
from routes.group_password.forgot_password.forgot_password import app_route4
from routes.group_password.forgot_password.forgot_pass2 import app_route3
from routes.group_password.forgot_password.forgot_password3 import app_route5
from routes.check_test.cookie import app_route6
from routes.ping.ping import khoi_dong

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__)
CORS(app,supports_credentials=True, origins=["https://gemini-dot.github.io", "http://127.0.0.1:5500"])

app.register_blueprint(app_route, url_prefix='/auth')
app.register_blueprint(app_route2, url_prefix='/auth')
app.register_blueprint(app_route3,url_prefix='/auth')
app.register_blueprint(app_route4,url_prefix='/auth')
app.register_blueprint(app_route5,url_prefix='/auth')
app.register_blueprint(app_route6, url_prefix='/auth')
app.register_blueprint(khoi_dong, url_prefix='/ping')

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template("500.html"), 500

@app.errorhandler(401)
def unauthorized_error(e):
    return render_template("401.html"), 401

@app.errorhandler(503)
def service_unavailable_error(e):
    return render_template("503.html"), 503

IS_MAINTENANCE = "0"

@app.before_request
def check_for_maintenance():
    if IS_MAINTENANCE == "1" and request.path != '/unlock-server':
        abort(503)

@app.route('/lock-server')
def lock():
    global IS_MAINTENANCE
    pw = request.args.get('key')
    if pw == "on-adminislaivansam1192011":
        IS_MAINTENANCE = "1"
        return "Đã bật chế độ bảo trì!", 200
    return "Sai mật khẩu!", 403

@app.route('/unlock-server')
def unlock():
    global IS_MAINTENANCE
    pw = request.args.get('key')
    if pw == "off-adminislaivansam1192011":
        IS_MAINTENANCE = "0"
        return "Đã mở cửa server!", 200
    return "Sai mật khẩu!", 403

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