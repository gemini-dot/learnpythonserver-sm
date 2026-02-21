from configs.db import db


def get_data(username, username_var, collection, thu_can_tim):
    collection_tim = db[str(collection)]
    nguoi_dung = collection_tim.find_one({username: username_var})
    if not nguoi_dung:
        return {"trang_thai": False, "mes": "khong_tim_thay"}
    return {"trang_thai": True, "mes": nguoi_dung.get(thu_can_tim)}
