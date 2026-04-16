from configs.db import db


def get_du_lieu_dashboard(user_gmail: str) -> dict:
    collection = db["users"]

    user_data = collection.find_one(
        {"gmail": user_gmail},
        {"_id": 0, "cap_nguoi_dung": 1, "username": 1, "luu_tru": 1, "bio": 1},
    )

    if not user_data:
        return {
            "cap_nguoi_dung": "basic",
            "username": "User",
            "luu_tru": "Basic",
            "bio": "",
        }

    return user_data
