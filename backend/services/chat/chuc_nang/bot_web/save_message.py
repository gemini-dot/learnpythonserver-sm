from datetime import datetime

chat_history = {}

def save_message(user_id, role, content):
    if user_id not in chat_history:
        chat_history[user_id] = []
    
    chat_history[user_id].append({
        'role': role,
        'content': content,
        'timestamp': datetime.utcnow().isoformat()
    })

    if len(chat_history[user_id]) > 50:
        chat_history[user_id] = chat_history[user_id][-50:]
