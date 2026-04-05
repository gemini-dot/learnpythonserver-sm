from configs.db import db


def check_blacklist(user_gmail):
    collection = db["users"]

    user = collection.find_one({"gmail": user_gmail}, {"blacklist": 1})

    if not user:
        return "không tìm thấy user", 404

    ans = int(user.get("blacklist", 0))

    if ans != 0:
        return "bạn đã bị hệ thống chặn", 401
    return "thành công", 200
