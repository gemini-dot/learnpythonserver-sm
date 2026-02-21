import eventlet
eventlet.monkey_patch()
from flask import Flask, abort, request
from flask_cors import CORS
import os
import sys
import io
import sentry_sdk
from flask_socketio import SocketIO, emit
# import file nội bộ
from configs.db import db
from routes.group_password.input_pass import app_route
from routes.group_password.create_a_password import app_route2
from logs.logger import logger
from routes.group_password.forgot_password.forgot_password import app_route4
from routes.group_password.forgot_password.forgot_pass2 import app_route3
from routes.group_password.forgot_password.forgot_password3 import app_route5
from routes.check_test.cookie import app_route6
from routes.group_chuc_nang.kiem_tra_dang_nhap.upload_fist_login import app_route7
from routes.group_chuc_nang.upload.upload_main import app_route8
from routes.group_chuc_nang.upload.chuc_nang.lay_file import app_route9
from routes.group_chuc_nang.upload.chuc_nang.get_profile_name import app_route10
from routes.group_chuc_nang.upload.chuc_nang.get_profile_power import app_route11
from routes.group_chuc_nang.upload.chuc_nang.delete_file import app_route12
from routes.group_chuc_nang.upload.chuc_nang.restore_file import app_route13
from routes.group_chuc_nang.upload.chuc_nang.permanentDelete import app_route14
from routes.scan_malware.scan_malware_link import app_route15
from routes.ping.ping import khoi_dong
from routes.group_admin.group_chuc_nang.kill_switch import lenh_tu_huy
from utils.trang_thai_db_503 import get_maintenance_status

sentry_sdk.init(
    dsn="https://a5ad9555164abda45436dbd6d09fd251@o4510918588301312.ingest.us.sentry.io/4510918591905792",
    send_default_pii=True,
    traces_sample_rate=1.0,
)

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    origins=[
        "https://gemini-dot.github.io",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
)

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

app.register_blueprint(app_route, url_prefix="/auth")
app.register_blueprint(app_route2, url_prefix="/auth")
app.register_blueprint(app_route3, url_prefix="/auth")
app.register_blueprint(app_route4, url_prefix="/auth")
app.register_blueprint(app_route5, url_prefix="/auth")
app.register_blueprint(app_route6, url_prefix="/auth")
app.register_blueprint(app_route7, url_prefix="/security")
app.register_blueprint(app_route8, url_prefix="/upload_sv")
app.register_blueprint(app_route9, url_prefix="/upload_sv")
app.register_blueprint(app_route10, url_prefix="/profile")
app.register_blueprint(app_route11, url_prefix="/profile")
app.register_blueprint(app_route12, url_prefix="/profile")
app.register_blueprint(app_route13, url_prefix="/profile")
app.register_blueprint(app_route14, url_prefix="/profile")
app.register_blueprint(app_route15, url_prefix="/security")
app.register_blueprint(khoi_dong, url_prefix="/ping")
app.register_blueprint(lenh_tu_huy, url_prefix="/admin")


@app.errorhandler(500)
def internal_server_error(e):
    return "error_server", 500


@app.errorhandler(401)
def unauthorized_error(e):
    return "error_sai_mk", 401


@app.errorhandler(503)
def service_unavailable_error(e):
    return "error_bao_tri", 503


tim_kiem = db["trang_thai_web"]

IS_MAINTENANCE = get_maintenance_status()
WHITELIST_IPS = ["127.0.0.1", "192.168.1.121"]

admin_pass_on, admin_pass_off = str(os.getenv("BAOTRI_KEY_ON")), str(
    os.getenv("BAOTRI_KEY_OFF")
)


@socketio.on('admin_broadcast')
def handle_broadcast(data):
    print(f"Đang phát tin: {data['msg']}",flush=True)
    emit('global_notification', {'message': data['msg']}, broadcast=True)

@app.before_request
def check_for_maintenance():
    client_ip = request.remote_addr
    allowed_routes = ["/unlock-server", "/check-status", "/lock-server"]
    if IS_MAINTENANCE == "website_off" and request.path not in allowed_routes:
        if client_ip in WHITELIST_IPS:
            return None
        else:
            abort(503)


@app.route("/lock-server")
def lock():
    global IS_MAINTENANCE
    pw = request.args.get("key")
    if admin_pass_on and pw == admin_pass_on:
        tim_kiem.update_one({"id": "config"}, {"$set": {"status": "website_off"}})
        IS_MAINTENANCE = "website_off"
        return "Đã bật chế độ bảo trì!", 200
    return "Sai mật khẩu!", 403


@app.route("/unlock-server")
def unlock():
    global IS_MAINTENANCE
    pw = request.args.get("key")
    if admin_pass_off and pw == admin_pass_off:
        tim_kiem.update_one({"id": "config"}, {"$set": {"status": "website_on"}})
        IS_MAINTENANCE = "website_on"
        return "Đã mở cửa server!", 200
    return "Sai mật khẩu!", 403


@app.route("/")
def home():
    return "Server đang chạy cực mượt rồi bạn ơi!"


port = int(os.environ.get("PORT", 5000))

if __name__ == "__main__":
    try:
        db.command("ping")
        logger.info("Database: Kết nối thành công!")
        socketio.run(app,host="0.0.0.0", port=port)
    except Exception as e:
        logger.error(f"System: Lỗi khởi động: {e}")

# hỡi người anh em
# nếu bro gặp lỗi và đang cố gắng fix lỗi(90% là vậy)
# thì xin lỗi...
# chỉ có chúa với tui là hiểu nó chạy thế nào
# và giờ chỉ còn chúa thôi.
