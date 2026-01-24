import os
import requests
from pathlib import Path

def gui_mail_reset(email_nguoi_nhan, token):

    service_id = "service_xszjius"
    template_id = "template_h6t8562"
    public_key = "Z2nHUm0dY8tFSWlaB"

    link_reset = f"https://gemini-dot.github.io/learnpythonsever-sm/frontend/view/group_password/forgot_password.html?gmail={email_nguoi_nhan}&token={token}"

    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(current_dir) 
    file_path = os.path.join(base_dir, "frontend", "view", "giao_dien_email", "index.html")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            html_template = f.read()
        
        final_html = html_template.replace("{{LINK_RESET}}", link_reset)

        url = "https://api.emailjs.com/api/v1.0/email/send"
        
        data = {
            'service_id': service_id,
            'template_id': template_id,
            'user_id': public_key,
            'template_params': {
                'user_email': email_nguoi_nhan,
                'my_html_content': final_html
            }
        }

        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            print(f"Gửi mail cho {email_nguoi_nhan} thành công rồi og ơi! 🎉")
            return True
        else:
            print(f"EmailJS báo lỗi: {response.text}")
            return False

    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file HTML tại {file_path}")
    except Exception as e:
        print(f"Có lỗi bất ngờ rồi og ơi: {e}")
        return False