from services.chat.chuc_nang.bot_web.save_message import chat_history


def get_chat_history(user_id, max_messages=10):
    if user_id not in chat_history:
        chat_history[user_id] = []
    return chat_history[user_id][-max_messages:]
