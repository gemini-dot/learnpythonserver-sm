from utils.search import tim_only
def get_power_services(gmail):
    ket_qua = tim_only('users','gmail',gmail,'cap_nguoi_dung')
    if not ket_qua:
        return {'trang_thai':False, "mes":"bi loi roi ban oi"}
    return ket_qua