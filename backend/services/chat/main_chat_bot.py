from configs.db import db
from services.chat.chuc_nang.AI_core import ask_gemini
from services.chat.chuc_nang.search_duck import get_realtime_info
from services.chat.chuc_nang.send_mes import send_message
from configs.AI_clinet import client

limits_col = db["user_limits"]


def handle_ai_logic(sender_id, message_text):

    user_data = limits_col.find_one({"sender_id": sender_id})
    history = user_data.get("history", []) if user_data else []

    keywords = ["tin tức", "thời tiết", "giá", "hôm nay", "ngày mấy", "mấy giờ"]
    search_context = ""

    if any(word in message_text.lower() for word in keywords):
        print(f"--- Đang tìm tin tức cho: {message_text} ---")
        search_context = get_realtime_info(message_text)
        message_text = (
            f"(Bối cảnh thực tế: {search_context})\nCâu hỏi khách: {message_text}"
        )

    ai_reply = ask_gemini(message_text, history)

    if ai_reply.startswith("loi"):
        send_message(
            sender_id, "Tui đang 'reset' lại não xíu, og nhắn lại câu vừa nãy nha! 🧠"
        )
        print(f"Bỏ qua lưu vì lỗi API: {ai_reply}", flush=True)
        return

    msg_to_send = ai_reply.split("|||")[0].strip() if "|||" in ai_reply else ai_reply
    send_message(sender_id, msg_to_send)
    limits_col.update_one(
        {"sender_id": sender_id},
        {
            "$push": {
                "history": {
                    "$each": [
                        {"role": "user", "parts": [{"text": message_text}]},
                        {"role": "model", "parts": [{"text": ai_reply}]},
                    ],
                    "$slice": -10,
                }
            }
        },
    )
