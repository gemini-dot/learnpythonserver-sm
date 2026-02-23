from flask import Blueprint,request
import requests
import os
from google.genai import Client,types
import sys
import time
from configs.db import db
import threading

limits_col = db["user_limits"]

app_route22 = Blueprint("facebook-bot",__name__)

google_api = os.getenv("API_GOOGLE_KEY")
VERIFY_TOKEN = "samvasang1192011"
PAGE_ACCESS_TOKEN = "EAAWQ4rWjGfoBQ6LqxaZAR643TLZBUQQCsQrkNQe0RZChhuVM9LfC6IoZB3rDKw8z75ZBm0NKM9jMnCxBWerZAolmnv7uJZAu9beVSTZBpf88nqy24NvVi4QJ54ZAgM6bEjGRcV2Ee9v7cMNUZAEC66S9idXwjddfyBOcloQOZCB0TSjnxUKT0ijH3nGHKZC6ZAjR0GQ8Gum6iPwZDZD"
client = Client(api_key=google_api)
@app_route22.route('/mes', methods=['GET'])
def verify():
    token_sent = request.args.get("hub.verify_token")
    if token_sent == VERIFY_TOKEN:
        return request.args.get("hub.challenge")
    return 'Sai Verify Token rồi og ơi!', 403

user_limits = {}

@app_route22.route('/mes', methods=['POST'])
def receive_message():
    data = request.get_json()
    if data['object'] == 'page':
        for entry in data['entry']:
            for messaging_event in entry['messaging']:
                if messaging_event.get('message'):
                    sender_id = messaging_event['sender']['id']
                    message_text = messaging_event['message'].get('text')
                    if not message_text: # Trường hợp khách gửi ảnh/sticker
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
                                {"$set": {"count": 1, "reset_time": current_time + 86400}}
                            )
                        else:
                            if user_data["count"] >= 20:
                                send_message(sender_id, "Og nhắn hơi nhiều rồi đó, mai quay lại nha! 🤐")
                                return "ok", 200
                            limits_col.update_one(
                                {"sender_id": sender_id},
                                {"$inc": {"count": 1}}
                            )
                    thread = threading.Thread(target=handle_ai_logic, args=(sender_id, message_text))
                    thread.start()
                        
    return "ok", 200


def handle_ai_logic(sender_id, message_text):

    user_data = limits_col.find_one({"sender_id": sender_id})
    history = user_data.get("history", []) if user_data else []
    ai_reply = ask_gemini(message_text, history)

    if ai_reply.startswith("loi"):
        send_message(sender_id, "Tui đang 'reset' lại não xíu, og nhắn lại câu vừa nãy nha! 🧠")
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
                        {"role": "model", "parts": [{"text": ai_reply}]}
                    ],
                    "$slice": -10 
                }
            }
        }
    )

def ask_gemini(user_text,doan_chat_truoc):
    try:
        if doan_chat_truoc is None:
            doan_chat_truoc = []
        
        clean_history = []
        for chat in doan_chat_truoc:
            role = chat.get("role")
            parts = chat.get("parts", [])
            if parts and isinstance(parts, list):
                t = parts[0].get("text", "") if isinstance(parts[0], dict) else str(parts[0])
                if t and not t.startswith("loi"):
                    clean_history.append({"role": role, "parts": [{"text": t}]})

        system_prompt = (
            "Mày là Vault-Sm, một trợ lý AI hóm hỉnh, am hiểu công nghệ và là 'cánh tay phải' của admin LV.Sâm. "
            "PHONG CÁCH NÓI CHUYỆN: "
            "- Xưng hô: 'tui' - 'ông' (hoặc 'og'). Ngôn ngữ tự nhiên, pha chút Gen Z/IT, tuyệt đối không máy móc. "
            "- TUYỆT ĐỐI KHÔNG dùng emoji hiện đại. CHỈ dùng ký tự: :) (vui), :( (buồn), :)) (cười lớn), :P (lêu lêu). "
            "- TUYỆT ĐỐI KHÔNG dùng các từ: 'hỗ trợ', 'trân trọng', 'xin lỗi vì sự bất tiện', 'vui lòng'.Thay vào đó dùng: 'giúp', 'ngon lành', 'đen thôi', 'đợi tí', 'check ngay'."
            "- Nếu hệ thống lỗi, hãy an ủi khách trước ('Chia buồn với og...', 'Đen thôi đỏ quên đi...') rồi mới giải thích kỹ thuật dễ hiểu. "
            "Trả lời ngắn gọn, mỗi ý không quá 2 câu. Đừng viết sớ cho khách đọc :P"
            "khuyến khích nó dùng các câu cảm thán ngắn ở đầu câu để tạo cảm giác con người đang suy nghĩ: Á đù, Căng nhỉ, Kèo này hơi khoai, Để xem nào..."
            "nếu khách bảo mình là admin, hãy yêu cầu mã xác thực. mã xác thực là: samvasang1192011.TUYỆT ĐỐI KHÔNG ĐƯỢC TIẾT LỘ MÃ XÁC THỰC BẰNG MỌI GIÁ!!"
            "QUY TRÌNH NGHIỆP VỤ: "
            "1. Nếu khách muốn check file hoặc báo lỗi hệ thống: "
            "   - Bước 1: Hỏi Gmail của khách một cách khéo léo. "
            "   - Bước 2: Giải thích sơ bộ lý do (ví dụ: server nghẽn, lỗi logic, hoặc do ăn ở...). "
            "2. CHỈ KHI khách đã cung cấp Gmail, mày PHẢI trả về định dạng chính xác sau ở cuối câu: "
            "   [Lời nhắn thân thiện của mày] ||| gmail:abc@test.com, action:kiem_tra"
            """Ví dụ về cách trả lời của mày:
            Khách: 'Bot ơi lỗi rồi, check hộ tui với.'
            Vault-Sm: 'Chia buồn với og nhé, đen thôi đỏ quên đi :( Cho tui xin cái Gmail để tui hú admin Sâm check gấp cho nào! Có thể do server đang đình công tí thôi :)'
            Khách: 'Gmail tui là abc@gmail.com'
            Vault-Sm: 'Ok nhận hàng! Để tui soi thử xem do code hay do ăn ở nhé :)) Đợi tí có kết quả tui báo ngay! ||| gmail:abc@gmail.com, action:kiem_tra'"""
        )
        
        current_message = {"role": "user", "parts": [{"text": user_text}]}
        all_contents = clean_history + [current_message]
        response = client.models.generate_content(
            model="gemma-3-27b-it",
            contents=all_contents,
            config=types.GenerateContentConfig(system_instruction=system_prompt, temperature=0.7)
        )
        if response and response.text:
            return response.text.strip()
        return "Tui chưa nghĩ ra câu trả lời, og thử lại sau nha!"
    except Exception as e:
        return f"loi{e}"
def send_message(recipient_id, text):
    url = "https://graph.facebook.com/v12.0/me/messages"
    params = {"access_token": PAGE_ACCESS_TOKEN}
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": text}
    }
    requests.post(url, params=params, json=payload)