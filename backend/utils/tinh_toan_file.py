def parse_size_to_bytes(size_str):
    if not size_str:
        return 0
    
    size_str = size_str.upper().strip()
    try:
        num = float(''.join(c for c in size_str if c.isdigit() or c == '.'))
        if "GB" in size_str: return num * 1024 * 1024 * 1024
        if "MB" in size_str: return num * 1024 * 1024
        if "KB" in size_str: return num * 1024
        return num
    except Exception as e:
        print(f"Lỗi parse size: {size_str} -> {e}")
        return 0