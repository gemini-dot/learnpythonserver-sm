from flask import request


def render_subdomain():
    h1 = request.headers.get("X-Forwarded-Host", "")
    h2 = request.headers.get("X-Original-Host", "")
    h3 = request.headers.get("Host", "")
    h4 = request.headers.get("DISGUISED-HOST", "")

    tat_ca_host = str(h1 + h2 + h3 + h4).lower()

    if "dashboard" in tat_ca_host:
        from routes.group_chuc_nang.upload.chuyen_huong.dashboard import (
            user_dashboard_user_route,
        )

        return user_dashboard_user_route()
    return None
