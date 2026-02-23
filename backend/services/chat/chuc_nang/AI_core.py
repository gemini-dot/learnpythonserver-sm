from google.genai import types
from configs.AI_clinet import client
from configs.prompt import system_prompt

def ask_gemini(user_text, doan_chat_truoc):
    try:
        if doan_chat_truoc is None:
            doan_chat_truoc = []

        clean_history = []
        for chat in doan_chat_truoc:
            role = chat.get("role")
            parts = chat.get("parts", [])
            if parts and isinstance(parts, list):
                t = (
                    parts[0].get("text", "")
                    if isinstance(parts[0], dict)
                    else str(parts[0])
                )
                if t and not t.startswith("loi"):
                    clean_history.append({"role": role, "parts": [{"text": t}]})
        model_ack = {
            "role": "model",
            "parts": [
                {
                    "text": "Đã rõ thưa admin Sâm! Tui sẽ là Vault-Sm hóm hỉnh, dùng :) :( và tuyệt đối bảo mật mã xác thực. Tui đã sẵn sàng! :)"
                }
            ],
        }
        current_message = {"role": "user", "parts": [{"text": user_text}]}
        instruction_msg = {
            "role": "user",
            "parts": [{"text": f"SYSTEM INSTRUCTION: {system_prompt}"}],
        }
        all_contents = [instruction_msg, model_ack] + clean_history + [current_message]
        response = client.models.generate_content(
            model="gemma-3-27b-it",
            contents=all_contents,
            config=types.GenerateContentConfig(temperature=0.7),
        )
        if response and response.text:
            return response.text.strip()
        return "Tui chưa nghĩ ra câu trả lời, og thử lại sau nha!"
    except Exception as e:
        return f"loi{e}"
