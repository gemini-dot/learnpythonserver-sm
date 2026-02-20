from datetime import datetime


def thoi_gian_tuong_doi(thoi_gian_trong_db):
    bay_gio = datetime.now()
    khoang_cach = bay_gio - thoi_gian_trong_db
    giay = int(khoang_cach.total_seconds())
    if giay < 60:
        return f"{giay} giây trước"
    phut = giay // 60
    if phut < 60:
        return f"{phut} phút trước"
    gio = phut // 60
    if gio < 24:
        return f"{gio} giờ trước"
    ngay = gio // 24
    return f"{ngay} ngày trước"
