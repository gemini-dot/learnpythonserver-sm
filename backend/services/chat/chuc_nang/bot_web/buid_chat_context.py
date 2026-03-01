from services.chat.chuc_nang.bot_web.get_chat_history import get_chat_history
from configs.prompt import system_prompt


def build_chat_context(user_id, current_message):
    history = get_chat_history(user_id)
    context_parts = [system_prompt, "\n\nLỊCH SỬ CHAT:"]

    for msg in history:
        if msg["role"] == "user":
            context_parts.append(f"User: {msg['content']}")
        else:
            context_parts.append(f"Bot: {msg['content']}")

    context_parts.append(f"\nUser: {current_message}")
    context_parts.append("Bot:")

    return "\n".join(context_parts)
