from configs.db import db
def lay_tat_ca_file(user_gmail, collection):
    collection_can_tim = db[str(collection)]
    user_data = list(collection_can_tim.find({'user_gmail':user_gmail}))
    if not user_data:
        return list(user_data)
    danh_sach_file = []
    for doc in user_data:
        if '_id' in doc:
            doc['_id'] = str(doc['_id'])   
            doc['id'] = doc['_id']
        danh_sach_file.append(doc)
    return danh_sach_file
