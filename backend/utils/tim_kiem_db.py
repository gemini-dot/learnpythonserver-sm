from configs.db import db
import time


def tim_kiem(ten_thu_muc_goc, thu_can_tim_kiem):
    vi_tri = db[str(ten_thu_muc_goc)]
    ten = vi_tri.find_one({"godmode": "private"})
    thoi_gian_hien_tai = time.time()
    if not ten:
        gia_han_mac_dinh = 15
        thoi_gian_het_han = thoi_gian_hien_tai + (gia_han_mac_dinh * 60)
        new_doc = {
            "godmode": "private",
            "trang_thai": "on",
            "thoi_gian": thoi_gian_hien_tai,
            "thoi_gian_het_han": thoi_gian_het_han,
            "gia_han": gia_han_mac_dinh,
            "trang_thai_thoi_gian": "chua_het_han",
            "du_lieu": {},
        }
        vi_tri.insert_one(new_doc)
        ten = new_doc
    return ten.get(str(thu_can_tim_kiem), "Không tìm thấy")
