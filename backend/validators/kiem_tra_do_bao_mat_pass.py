import re

def check_password_strength(password):
    # Ban đầu cho là 0 điểm
    score = 0
    remarks = []

    # 1. Kiểm tra độ dài (Ít nhất 8 ký tự)
    if len(password) >= 8:
        score += 1
    else:
        remarks.append("Mật khẩu quá ngắn (ít nhất 8 ký tự).")

    # 2. Kiểm tra xem có chữ hoa không
    if re.search(r"[A-Z]", password):
        score += 1
    else:
        remarks.append("Thiếu chữ viết HOA.")

    # 3. Kiểm tra xem có số không
    if re.search(r"[0-9]", password):
        score += 1
    else:
        remarks.append("Thiếu con số.")

    # 4. Kiểm tra ký tự đặc biệt (@, #, $, %,...)
    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        score += 1
    else:
        remarks.append("Thiếu ký tự đặc biệt (ví dụ: @, #, !).")

    # Xếp hạng dựa trên điểm số
    if score == 4:
        return True, "Mạnh"
    elif score >= 2:
        return False, f"Trung bình. Cần thêm: {', '.join(remarks)}"
    else:
        return False, f"Yếu. Lưu ý: {', '.join(remarks)}"