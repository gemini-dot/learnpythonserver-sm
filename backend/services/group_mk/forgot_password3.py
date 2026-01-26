from configs.db import db
from logs.logger import logger

def kiem_tra_de_doi_mat_khau(token, gmail, new_password):
    thu_muc_can_kiem_tra = db['token']
    thu_muc_nguoi_dung = db["users"]
    try:
        ket_qua = thu_muc_can_kiem_tra.find_one({'gmail': gmail})
        if not ket_qua:
            return {'success': False, 'message': 'Yêu cầu không tồn tại hoặc đã hết hạn!'}
        
        token_trong_db = ket_qua.get('token_nguoi_dung')
        trang_thai_token = ket_qua.get('trang_thai1')

        if token != token_trong_db:
            return {'success': False, 'message': 'Token không hợp lệ!'}
        if trang_thai_token != 'sap_su_dung':
            return {'success': False, 'message': 'Token không hợp lệ để đổi mật khẩu!'}
        
        print("đến đoạn này rồi bạn ơi, forgot_password3.py")
        
        thu_muc_can_kiem_tra.update_one(
            {"gmail": gmail},
            {"$set": {"trang_thai1": "da_su_dung"}}
        )
        thu_muc_nguoi_dung.update_one(
            {"gmail": gmail},
            {"$set": {"password": new_password}}
        )

        return {'success': True, 'message': 'Đổi mật khẩu thành công!'}
    except Exception as e:
        logger.error(f"Lỗi khi kiểm tra để đổi mật khẩu: {e}")
        return {'success': False, 'message': e}
