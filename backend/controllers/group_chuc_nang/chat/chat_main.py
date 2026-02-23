from flask import request
import time
import threading
from configs.db import db
from services.chat.chuc_nang.send_mes import send_message
from services.chat.main_chat_bot import handle_ai_logic

limits_col = db["user_limits"]


def receive_message():
    data = request.get_json()
    if data["object"] == "page":
        for entry in data["entry"]:
            for messaging_event in entry["messaging"]:
                if messaging_event.get("message"):
                    sender_id = messaging_event["sender"]["id"]
                    message_text = messaging_event["message"].get("text")
                    if not message_text:
                        send_message(
                            sender_id, "thử gửi lại mà không dùng icon đi bạn:)"
                        )  # Trường hợp khách gửi ảnh/sticker
                        continue

                    current_time = time.time()

                    user_data = limits_col.find_one({"sender_id": sender_id})

                    if not user_data:
                        new_user = {
                            "sender_id": sender_id,
                            "count": 1,
                            "reset_time": current_time + 86400,
                        }
                        limits_col.insert_one(new_user)
                    else:
                        if current_time > user_data["reset_time"]:
                            limits_col.update_one(
                                {"sender_id": sender_id},
                                {
                                    "$set": {
                                        "count": 1,
                                        "reset_time": current_time + 86400,
                                    }
                                },
                            )
                        else:
                            if user_data["count"] >= 20:
                                send_message(
                                    sender_id,
                                    "Og nhắn hơi nhiều rồi đó, mai quay lại nha! 🤐",
                                )
                                return "ok", 200
                            limits_col.update_one(
                                {"sender_id": sender_id}, {"$inc": {"count": 1}}
                            )
                    thread = threading.Thread(
                        target=handle_ai_logic, args=(sender_id, message_text)
                    )
                    thread.start()

    return "ok", 200
