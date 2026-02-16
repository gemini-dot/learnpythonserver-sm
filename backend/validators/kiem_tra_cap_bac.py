from configs.db import db
def kiem_tra_cap_bac(gmail_nguoi_dung, vi_tri_tim_kiem):
    noi_tim_kiem = db[str(vi_tri_tim_kiem)]
    nguoi_dung = noi_tim_kiem.find_one({"gmail": gmail_nguoi_dung})
    if not nguoi_dung:
        return "error"
    role_nguoi_dung = nguoi_dung.get("role")
    return role_nguoi_dung