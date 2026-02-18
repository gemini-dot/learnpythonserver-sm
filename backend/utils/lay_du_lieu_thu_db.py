from configs.db import db
def lay_tat_ca_file(user_gmail, collection):
    collection_can_tim = db[str(collection)]
    user_data = list(collection_can_tim.find({'user_gmail':user_gmail}))
    if not user_data:
        return list(user_data)
    res = {
        "danh_sach_file" : [],
        "danh_sach_file_da_xoa":[]
    }
    
    for doc in user_data:
        if '_id' in doc:
            doc['_id'] = str(doc['_id'])   
            doc['id'] = doc['_id']
        if doc.get('trang_thai') == 'da_xoa':
            res['danh_sach_file_da_xoa'].append(doc)
        else:
            res['danh_sach_file'].append(doc)
    return res
