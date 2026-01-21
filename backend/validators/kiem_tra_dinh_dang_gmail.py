import re 

def kiem_tra_dinh_dang_gmail(email):
    email_format = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if re.match(email_format, email):
        return True
    else:
        return False