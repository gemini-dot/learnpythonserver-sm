import os
import requests
from pathlib import Path

def gui_mail_reset(email_nguoi_nhan, token):

    service_id = "service_xszjius"
    template_id = "template_h6t8562"
    public_key = "Z2nHUm0dY8tFSWlaB"

    link_reset = f"https://gemini-dot.github.io/learnpythonsever-sm/frontend/view/group_password/forgot_password.html?gmail={email_nguoi_nhan}&token={token}"

    try:
        url = "https://api.emailjs.com/api/v1.0/email/send"
        
        data = {
            'service_id': service_id,
            'template_id': template_id,
            'user_id': public_key,
            'template_params': {
                'user_email': email_nguoi_nhan,
                'LINK_RESET': link_reset
            }
        }
        #
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            print(f"Gửi mail cho {email_nguoi_nhan} thành công rồi og ơi! 🎉")
            return {"success": True}
        else:
            print(f"EmailJS báo lỗi: {response.text}")
            return {"success": False, "error": response.text}   
    except Exception as e:
        print(f"Có lỗi bất ngờ rồi og ơi: {e}")
        return False