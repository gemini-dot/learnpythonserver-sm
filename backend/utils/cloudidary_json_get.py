def make_json_cloud(upload_result, user_email, ten_goc):
    ext = upload_result.get('format', '')
    original_name = upload_result.get('original_filename', upload_result.get('public_id', 'unnamed_file'))
    
    if ten_goc and ten_goc != "":
        full_name = ten_goc
    else:
        original_name = upload_result.get('original_filename', upload_result.get('public_id', 'unnamed_file'))
        full_name = f"{original_name}.{ext.lower()}" if ext else original_name

    file_info = {
        "public_id": upload_result.get('public_id'),
        "name": full_name,
        "url": upload_result.get('secure_url'),
        "size": upload_result.get('bytes', 0), 
        "ext": ext.upper(),
        "type": upload_result.get('resource_type', 'raw'),
        "created_at": upload_result.get('created_at'),
        "user_gmail":user_email
    }
    if file_info["type"] == "image":
        file_info["thumb"] = file_info["url"].replace("/upload/", "/upload/w_200,c_fill/")
    else:
        file_info["thumb"] = None
        
    return file_info