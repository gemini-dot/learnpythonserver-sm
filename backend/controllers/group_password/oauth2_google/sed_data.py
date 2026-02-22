from configs.db import db
from services.group_mk.oauth2_google.verify_google import kiem_tra_db
from flask import redirect
import uuid
def kiem_tra_goole(dulieu):
    email = dulieu.get('email')
    full_name = dulieu.get('name')   
    avatar = dulieu.get('picture')          
    google_id = dulieu.get('sub')
    sid = str(uuid.uuid4())
    ket_qua = kiem_tra_db(full_name,email,avatar,sid)
    if ket_qua.get('trang_thai') == True:
        return redirect(f"https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/group_password/input_pass.html?sid={sid}&gmail={email}")
    
    return redirect("https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/500.html")