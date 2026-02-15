from configs.db import db
import secrets
def kiem_tra_token(gmail_gui_len, token_gui_len, noi_tim_kiem, vi_tri_can_kiem_tra):
    try:
        vi_tri_kiem_tra = db[noi_tim_kiem]
        ket_qua_tim_kiem = vi_tri_kiem_tra.find_one({"gmail":gmail_gui_len})
        if ket_qua_tim_kiem is None:
            return {"success": False, "message": "Người dùng không tồn tại!"}
        token_luu_tru_trong_db = ket_qua_tim_kiem.get(vi_tri_can_kiem_tra)
        if not token_luu_tru_trong_db:
                return {"success": False, "message": "Dữ liệu xác thực không hợp lệ!"}
        if not secrets.compare_digest(str(token_luu_tru_trong_db), str(token_gui_len)):
            return {"success": False, "message": "token không chính xác"}
        return {"success": True, "message": "token chính xác"}
    except Exception as e:
        return {"success": False, "message": "Lỗi hệ thống, vui lòng thử lại sau!"}