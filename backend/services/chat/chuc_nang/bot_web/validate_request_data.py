def validate_request_data(data):
    if not data:
        return False, "No data provided"
    
    if 'message' not in data:
        return False, "Message is required"
    
    message = data.get('message', '').strip()
    if not message:
        return False, "Message cannot be empty"
    
    if len(message) > 2000:
        return False, "Message too long (max 2000 characters)"
    
    return True, None
