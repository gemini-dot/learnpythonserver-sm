def lam_dep_thiet_bi(ua_string):
    if not ua_string:
        return "Thiết bị không xác định"

    ua_string = ua_string.lower()

    # 1. Xác định Hệ điều hành (OS)
    os = "Thiết bị lạ"
    if "windows" in ua_string:
        os = "Windows"
    elif "iphone" in ua_string or "ipad" in ua_string:
        os = "iOS"
    elif "android" in ua_string:
        os = "Android"
    elif "macintosh" in ua_string:
        os = "MacOS"
    elif "linux" in ua_string:
        os = "Linux"

    # 2. Xác định Trình duyệt (Browser)
    browser = "Trình duyệt"
    if "edg/" in ua_string:
        browser = "Edge"
    elif "chrome" in ua_string:
        browser = "Chrome"
    elif "firefox" in ua_string:
        browser = "Firefox"
    elif "safari" in ua_string:
        browser = "Safari"

    return f"{browser} on {os}"
