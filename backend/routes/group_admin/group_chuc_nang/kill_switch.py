from flask import Blueprint, request
import requests
from configs.db import db
import os
from utils.hash256 import get_sha256_hash
import sys
import signal
import threading

lenh_tu_huy = Blueprint("lenh_tu_huy",__name__)

RENDER_API_KEY = os.getenv("RENDER_API_KEY") 
SERVICE_ID = os.getenv("SERVICE_ID1")

@lenh_tu_huy.route('/nuclear-shutdown/<passphrase>', methods=['GET'])
def kill_switch(passphrase):
    security_check = db['thuc_thi'].find_one({"lenh_thuc_thi_bat_buoc": "admin-root"})
    env_pass = os.getenv("DATABASE_0")

    if security_check and env_pass:
        db_hash = security_check.get("lenh_thuc_thi")
        if passphrase == env_pass and str(db_hash) == str(get_sha256_hash(env_pass)):
            print("\n☢️[SECURITY ALERT] LỆNH TỰ HỦY ĐÃ KÍCH HOẠT QUA HTTP!")
            url = f"https://api.render.com/v1/services/{SERVICE_ID}/suspend"
            headers = {
                "Authorization": f"Bearer {RENDER_API_KEY}",
                "Accept": "application/json"
            }
            
            response = requests.post(url, headers=headers)
            
            if response.status_code == 204:
                return "☢️ [CRITICAL] Render Service Suspended. Server is DEAD.", 200
            else:
                return f"Failed to kill: {response.text}", 500
    return "Access Denied", 403