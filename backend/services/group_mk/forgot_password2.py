from configs.db import db
from logs.logger import logger

def kiem_tra_xac_nhan(gmail, token_nguoi_dung_gui_len):
    thu_muc_can_kiem_tra = db["token"]
    
    try:
        ban_ghi = thu_muc_can_kiem_tra.find_one({"gmail": gmail})
        if ban_ghi is None:
            return {"success": False, "message": "Yêu cầu không tồn tại hoặc đã hết hạn!"}
        
        token_trong_db = ban_ghi.get("token_nguoi_dung")
        
        # 4. So sánh
        if str(token_nguoi_dung_gui_len) == str(token_trong_db):
            return {"success": True, "message": "Xác thực thành công! Mời og đổi mật khẩu."}
        else:
            return {"success": False, "message": "Mã xác thực không chính xác!"}
            
    except Exception as e:
        logger.error(f"Lỗi hệ thống: {e}")
        return {"success": False, "message": "Có lỗi xảy ra phía server!"}