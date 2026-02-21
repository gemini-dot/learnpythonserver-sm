from configs.db import db
def cap_nhat_bio(bio, user_gmail):
    collection = db['users']
    nguoi_dung = collection.find_one({'gmail':user_gmail})
    if not nguoi_dung:
        return {'trang_thai':False,'mes':'loi nguoi dung'}
    collection.update_one({'gmail':user_gmail},{'$set':{'bio':bio}})
    return {'trang_thai':True,'mes':'da xong'}