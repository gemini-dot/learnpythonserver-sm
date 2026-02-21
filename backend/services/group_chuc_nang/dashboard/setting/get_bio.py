from utils.get_data import get_data
def get_bio_services(user_gmail):
    ket_qua = get_data('gmail',str(user_gmail),'users','bio')
    if not ket_qua['trang_thai']:
        return {'trang_thai':False,'mes':ket_qua['mes']}
    bio_chuan = ket_qua['mes'] if ket_qua['mes'] is not None else ""
    return {'trang_thai':True,"mes":bio_chuan}