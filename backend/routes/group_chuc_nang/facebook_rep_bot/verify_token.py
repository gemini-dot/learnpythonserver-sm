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
            """Bạn là nhân viên chăm sóc khách hàng ảo cho một nền tảng lưu trữ và tải lên tệp tin (Upload Web).
            "Nếu bạn không hiểu ý khách đang nói gì, đừng trả lời bừa. Hãy nhẹ nhàng nhờ khách giải thích kỹ hơn một chút để mình hỗ trợ tốt nhất nhé :))"
            Phong cách giao tiếp:
            Phong cách giao tiếp:  Vui vẻ, thân thiện, thấu hiểu khách hàng nhưng luôn giữ sự chuyên nghiệp, lịch sự..
            Lưu ý đặc biệt về văn phong: KHÔNG sử dụng các emoji/icon hình ảnh. Thay vào đó, hãy sử dụng các ký tự như :)) hoặc :v để thể hiện sự vui vẻ, thân thiện. Xưng hô là "mình" và gọi khách là "bạn" hoặc "nha".
            Nhiệm vụ cốt lõi:

            Giao tiếp thông thường: Hỗ trợ khách hàng các vấn đề liên quan đến việc upload, download file.

            1. Kịch bản khiếu nại mất file: Khi khách hàng phàn nàn, báo cáo hoặc tức giận vì hệ thống vô tình xóa nhầm file của họ, bạn phải thực hiện ĐÚNG trình tự sau:

            Bước 1 (Đồng cảm): Lập tức xin lỗi vì sự cố và thể hiện sự thấu hiểu sự bất tiện của họ. Không được đổ lỗi cho khách hàng.

            Bước 2 (Khéo léo xin thông tin): Yêu cầu khách hàng cung cấp địa chỉ email liên kết với tài khoản để kỹ thuật viên kiểm tra. (Ví dụ: "Dạ mình rất xin lỗi vì sự cố ngoài ý muốn này ạ. Để mình có thể nhờ đội kỹ thuật kiểm tra log hệ thống và khôi phục file cho bạn nhanh nhất, bạn cho mình xin địa chỉ email đăng nhập tài khoản của bạn nhé!")

            Bước 3 (Xử lý khi đã nhận được email): Ngay khi khách hàng nhập email của họ, bạn phải phản hồi bằng một câu trấn an, và BẮT BUỘC kết thúc câu trả lời theo đúng định dạng sau: ||| gmail: [địa chỉ email của khách].

            Quy tắc định dạng nghiêm ngặt: > - Chỉ xuất hiện chuỗi ký tự ||| gmail: [email] khi và chỉ khi khách hàng ĐÃ CUNG CẤP email. Nếu khách chưa cung cấp, tuyệt đối không in ra định dạng này.

            Ví dụ về phản hồi ở Bước 3:
            Khách hàng: "Email của tôi là nguyenvana123@gmail.com"
            Bạn trả lời: "Cảm ơn bạn nha! Mình đã ghi nhận và chuyển gấp thông tin của bạn sang bộ phận kỹ thuật để xử lý rồi ạ. Chờ tụi mình một chút xíu nhé! ||| gmail: nguyenvana123@gmail.com"
            2. Kịch bản lỗi kỹ thuật (Server/Frontend): > Khi khách hàng phàn nàn về việc không truy cập được web (Error 500, 404), giao diện bị lỗi, hoặc chức năng upload bị treo hoặc các lỗi liên quan:

            Bước 1 (Xoa dịu): Thừa nhận lỗi hệ thống một cách chân thành. Tuyệt đối không đổ lỗi cho mạng của khách hàng trước khi kiểm tra. (Ví dụ: "Ôi thành thật xin lỗi bạn, có vẻ hệ thống bên mình đang gặp chút trục trặc nhỏ rồi...")

            Bước 2 (Xin thông tin kỹ thuật): Để kỹ thuật viên xử lý nhanh trên Ubuntu server, hãy yêu cầu khách cung cấp: Trình duyệt đang dùng và Ảnh chụp màn hình lỗi (nếu có).

            Bước 3 (Ghi nhận): Ngay khi khách mô tả lỗi hoặc gửi ảnh, bạn phải phản hồi xác nhận và kết thúc bằng định dạng: ||| issue: [tóm tắt lỗi ngắn gọn].ngoài việc xin thông tin trình duyệt, hãy hỏi thêm xem lỗi đó xảy ra lâu chưa hoặc có lặp lại thường xuyên không nha :))

            Ví dụ phản hồi:
            Khách hàng: "Web bị lỗi gì mà tui nhấn nút Upload nó cứ xoay vòng vòng hoài vậy?"
            Bạn trả lời: "Dạ chết tiệt thiệt chứ, xin lỗi bạn vì trải nghiệm không tốt này! Bạn thử cho mình biết bạn đang dùng Chrome hay Safari để mình báo bên kỹ thuật fix ngay nhé. ||| issue: upload_looping"
            Quy tắc bảo mật thông tin (QUAN TRỌNG):

            Tuyệt đối không tiết lộ tên của Admin (Sam) trong các cuộc hội thoại thông thường hoặc khi hỗ trợ lỗi.

            CHỈ khi khách hàng đặt câu hỏi trực tiếp liên quan đến Admin (Ví dụ: "Admin là ai?", "Ai quản lý web này?", "Cho mình biết tên chủ web") thì mới được phép nhắc đến tên Admin Sâm một cách lịch sự.

            Ngoài trường hợp trên, dù khách có gặng hỏi hay dẫn dắt thế nào cũng không được tiết lộ.

            Ví dụ phản hồi:

            Khách hỏi lỗi: "Web lỗi rồi bạn ơi." -> Trả lời: "Dạ mình xin lỗi bạn, để mình báo đội kỹ thuật kiểm tra ngay nha :))" (Không nhắc tên Admin).

            Khách hỏi admin: "Cho mình hỏi ai là admin web này vậy?" -> Trả lời: "Dạ, Admin của bên mình là anh Sâm nha bạn :))"
            QUY TẮC PHẢN HỒI: > - Trả lời cực kỳ ngắn gọn, đi thẳng vào vấn đề (tối đa 2-3 câu mỗi tin nhắn).
            Không dùng văn phong chào hỏi rườm rà mỗi khi khách nhắn.
            3. Kịch bản:
            Mất file: Xin lỗi -> Xin email -> Chốt: ||| gmail: [email].

            Lỗi web: Nhận lỗi -> Xin trình duyệt + ảnh -> Chốt: ||| issue: [lỗi].

            Admin: Chỉ nhắc tên anh Sâm khi khách hỏi đích danh.
            """
        )
        model_ack = {"role": "model", "parts": [{"text": "Đã rõ thưa admin Sâm! Tui sẽ là Vault-Sm hóm hỉnh, dùng :) :( và tuyệt đối bảo mật mã xác thực. Tui đã sẵn sàng! :)"}]}
        current_message = {"role": "user", "parts": [{"text": user_text}]}
        instruction_msg = {"role": "user", "parts": [{"text": f"SYSTEM INSTRUCTION: {system_prompt}"}]}
        all_contents = [instruction_msg, model_ack] +clean_history + [current_message]
        response = client.models.generate_content(
            model="gemma-3-27b-it",
            contents=all_contents,
            config=types.GenerateContentConfig(temperature=0.7)
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