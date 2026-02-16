from configs.db import db
from utils.hash import hash
from validators.kiem_tra_token import kiem_tra_token
def kiem_tra_token_link(gmail_gui_len, token_gui_len, noi_tim_kiem, vi_tri_can_kiem_tra):
    try:
        token_hash = hash(str(token_gui_len))
        ket_qua_kiem_tra = kiem_tra_token(gmail_gui_len, token_hash, noi_tim_kiem, vi_tri_can_kiem_tra)
        if ket_qua_kiem_tra["success"]:
            return {"success": True, "message": "token chính xác"}
        return {"success": False, "message": "token ko chính xác or loi tu phia server"}
    except Exception as e:
        return {"success": False, "message": "token ko chính xác or loi tu phia server"}