from flask import Blueprint, abort, request
from configs.db import db
import os
from utils.hash256 import get_sha256_hash
import sys
import signal
import threading

lenh_tu_huy = Blueprint("lenh_tu_huy",__name__)

@lenh_tu_huy.route('/nuclear-shutdown/<passphrase>', methods=['GET'])
def kill_switch(passphrase):
    security_check = db['thuc_thi'].find_one({"lenh_thuc_thi_bat_buoc": "admin-root"})
    env_pass = os.getenv("DATABASE_0")

    if security_check and env_pass:
        db_hash = security_check.get("lenh_thuc_thi")
        if passphrase == env_pass and str(db_hash) == str(get_sha256_hash(env_pass)):
            print("\n☢️[SECURITY ALERT] LỆNH TỰ HỦY ĐÃ KÍCH HOẠT QUA HTTP!")
            def suicide():
                os.kill(os.getpid(), signal.SIGKILL)
            threading.Timer(1.0, suicide).start()
            return "System shutting down...", 200
    return "Access Denied", 403