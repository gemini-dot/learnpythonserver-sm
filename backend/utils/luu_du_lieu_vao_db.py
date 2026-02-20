from configs.db import db


def luu(du_lieu, thu_muc_luu):
    collection_name = str(thu_muc_luu).strip()
    files_col = db[str(collection_name)]
    try:
        ket_qua = files_col.insert_one(du_lieu)
        if "_id" in du_lieu:
            du_lieu["_id"] = str(du_lieu["_id"])
        return {"status": "ok", "id": str(ket_qua.inserted_id)}
    except Exception as e:
        return {"status": "error", "message": str(e)}
