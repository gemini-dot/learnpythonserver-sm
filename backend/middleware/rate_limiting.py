from flask import request, jsonify
from functools import wraps
import time

ip_history = {}

def limit_requests(max_requests=5, period=60):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            WHITELIST_IPS = ['127.0.0.1', '192.168.1.121']
            ip = request.remote_addr #lấy địa chỉ ip
            if ip in WHITELIST_IPS:
                return f(*args, **kwargs)
            now = time.time()
            if ip not in ip_history:
                ip_history[ip] = []
            ip_history[ip] = [t for t in ip_history[ip] if now - t < period]
            if len(ip_history[ip]) >= max_requests:
                return jsonify({
                    "status": "error",
                    "message": f"Quá nhiều yêu cầu! Thử lại sau {period} giây."
                }), 429
            ip_history[ip].append(now)
            return f(*args, **kwargs)
        return decorated_function
    return decorator