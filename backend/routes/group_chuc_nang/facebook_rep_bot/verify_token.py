from flask import Blueprint,request
import requests
import os
from google.genai import Client
import sys

app_route22 = Blueprint("facebook-bot",__name__)

VERIFY_TOKEN = "samvasang1192011"
PAGE_ACCESS_TOKEN = "EAAWQ4rWjGfoBQ6LqxaZAR643TLZBUQQCsQrkNQe0RZChhuVM9LfC6IoZB3rDKw8z75ZBm0NKM9jMnCxBWerZAolmnv7uJZAu9beVSTZBpf88nqy24NvVi4QJ54ZAgM6bEjGRcV2Ee9v7cMNUZAEC66S9idXwjddfyBOcloQOZCB0TSjnxUKT0ijH3nGHKZC6ZAjR0GQ8Gum6iPwZDZD"
client = Client(api_key=os.getenv("API_GOOGLE_KEY"))
@app_route22.route('/mes', methods=['GET'])
def verify():
    token_sent = request.args.get("hub.verify_token")
    if token_sent == VERIFY_TOKEN:
        return request.args.get("hub.challenge")
    return 'Sai Verify Token rồi og ơi!', 403


@app_route22.route('/mes', methods=['POST'])
def receive_message():
    data = request.get_json()
    if data['object'] == 'page':
        for entry in data['entry']:
            for messaging_event in entry['messaging']:
                if messaging_event.get('message'):
                    sender_id = messaging_event['sender']['id']
                    message_text = messaging_event['message'].get('text')
                    ai_reply = ask_gemini(message_text)
                    if "|||" in ai_reply:
                        parts = ai_reply.split("|||")
                        msg_to_user = parts[0].strip()
                        command = parts[1].strip()
                        send_message(sender_id, msg_to_user)
                        print(f"Đang thực hiện lệnh: {command}")
                    else:
                        send_message(sender_id, ai_reply)
                        
    return "ok", 200


def ask_gemini(user_text):
    # System Prompt để ép AI làm theo ý og trong từng câu đơn lẻ
    system_prompt = (
        "Ông là hỗ trợ viên vui vẻ. Nếu khách hỏi check file, hãy hỏi gmail. "
        "Nếu có gmail, trả về: [Lời nhắn] ||| gmail:abc@test.com, action:kiem_tra. "
        "Nội dung khách nói là: "
    )
    
    response = client.models.generate_content(
        model="gemini-3-flash-preview", # Dùng bản flash cho nhanh
        contents=system_prompt + user_text,
    )
    return response.text.strip()

def send_message(recipient_id, text):
    url = "https://graph.facebook.com/v12.0/me/messages"
    params = {"access_token": PAGE_ACCESS_TOKEN}
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": text}
    }
    requests.post(url, params=params, json=payload)