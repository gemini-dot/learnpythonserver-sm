from flask import Flask
from configs.db import db
from routes.group_password.input_pass import app_route
from logs.logger import logger
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__)


app.register_blueprint(app_route, url_prefix='/auth')

@app.route('/kiem_tra_mat_khau')
def home():
    return "Server đang chạy cực mượt rồi bạn ơi!"

if __name__ == '__main__':
    logger.info("System: Server đang khởi động...")
    app.run(debug=True, port=5000)