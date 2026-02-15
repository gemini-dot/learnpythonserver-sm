from configs.db import db
tim_kiem = db["trang_thai_web"]
def get_maintenance_status():
    data = tim_kiem.find_one({"id": "config"})
    if not data:
        tim_kiem.insert_one({"id": "config", "status": "website_on"})
        return "website_on"
    return data["status"]