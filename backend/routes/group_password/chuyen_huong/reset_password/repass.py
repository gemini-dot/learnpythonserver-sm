from flask import session, Blueprint, send_from_directory
from configs.duong_dan_thu_muc import thu_muc_chinh
from configs.settings import MAX_REQUESTS, PERIOD
from middleware.rate_limiting import limit_requests
from configs.db import db
send_mail_reset_password_main = Blueprint(
    "send_mail_reset_password route user main", __name__
)


@send_mail_reset_password_main.route("/reset_site", methods=["GET", "POST"])
@limit_requests(max_requests=MAX_REQUESTS, period=PERIOD)
def send_mail_reset_password_main_user_route():

    token_collection = db["token"]

    user_gmail = session.get("gmail")
    token = session.get("token")

    if not token:
        return send_from_directory(thu_muc_chinh("frontend/view/error"), "401.html"), 401
    
    res = token_collection.find_one({"gmail": user_gmail}, {"gmail": 1, "token_nguoi_dung": 1, "trang_thai1": 1, "trang_thai2": 1})

    if str(res.get("trang_thai1")) != "sap_su_dung" or str(res.get("trang_thai2")) != "da_het_han" or res.get("token_nguoi_dung") != token:
        return send_from_directory(thu_muc_chinh("frontend/view/error"), "401.html"), 401

    return send_from_directory(
        thu_muc_chinh("frontend/view/group_password"), "create_new_pass.html"
    )
