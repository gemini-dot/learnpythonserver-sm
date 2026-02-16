from configs.db import db

def kiem_tra_het_han(thoi_gian_hien_tai, thu_muc_goc, vi_tri_can_xac_dinh, vi_tri_can_xac_dinh_bien, vi_tri_can_tim, ten_trang_thai_can_thay_doi, thay_doi):
    vi_tri = db[str(thu_muc_goc)]
    noi_tim = vi_tri.find_one({str(vi_tri_can_xac_dinh):str(vi_tri_can_xac_dinh_bien)})
    if not noi_tim:
        return {"trang_thai":'khong_xac_dinh', "loi_nhan":"loi o kiem_tra_het_han"}
    thoi_gian_ket_thuc_trong_db = noi_tim.get(str(vi_tri_can_tim))
    if thoi_gian_ket_thuc_trong_db and int(thoi_gian_hien_tai) > int(thoi_gian_ket_thuc_trong_db):
        vi_tri.update_one({str(vi_tri_can_xac_dinh): str(vi_tri_can_xac_dinh_bien)}, {"$set": {str(ten_trang_thai_can_thay_doi): str(thay_doi)}})
        return {"trang_thai":"da_het_han", "loi_nhan":"loi o kiem_tra_het_han"}
    return {"trang_thai":'chua_het_han', "loi_nhan":"ok roi ban"}
