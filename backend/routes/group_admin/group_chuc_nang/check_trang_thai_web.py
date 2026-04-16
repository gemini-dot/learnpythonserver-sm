from flask import request, abort, Blueprint
from configs.db import db
from logs import logger
from utils.trang_thai_db_503 import get_maintenance_status
from configs.duong_dan_thu_muc import duong_dan_hien_tai
from configs.settings import ip_allow

last_check_time = 0
cached_maintenance_status = None

maintenance_status = Blueprint("maintenance_status", __name__)


@maintenance_status.before_request
def check_for_maintenance():
    global last_check_time, cached_maintenance_status
    import time

    current_time = time.time()
    client_ip = request.remote_addr
    if cached_maintenance_status is None or (current_time - last_check_time > 10):
        try:
            new_status = get_maintenance_status()
            if new_status:
                cached_maintenance_status = new_status
                last_check_time = current_time
        except Exception as e:
            logger.error(f"{e}", duong_dan_hien_tai())
    allowed_routes = ["/unlock-server", "/check-status", "/lock-server"]
    if (
        cached_maintenance_status == "website_off"
        and request.path not in allowed_routes
    ):
        if client_ip in ip_allow:
            return None
        else:
            abort(503)
