import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def gui_mail_reset(email_nguoi_nhan, token):

    sender_email = "samvasang1192011@gmail.com"
    password = "geninfgrkseuqtxq" 

    link_reset = f"https://gemini-dot.github.io/learnpythonsever-sm/frontend/view/group_password/forgot_password.html?gmail={email_nguoi_nhan}&token={token}"

    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "..", "..", "frontend", "view", "giao_dien_email", "index.html")

    with open(file_path, "r", encoding="utf-8") as f:
        html_template = f.read()

    final_html = html_template.replace("{{LINK_RESET}}", link_reset)

    # Cấu hình Email
    message = MIMEMultipart()
    message["Subject"] = "Yêu cầu đặt lại mật khẩu 🛡️"
    message["From"] = sender_email
    message["To"] = email_nguoi_nhan
    message.attach(MIMEText(final_html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, email_nguoi_nhan, message.as_string())
        print("Đã gửi mail thành công cho bạn rồi nhé!")
    except Exception as e:
        print(f"Có lỗi rồi og ơi: {e}")