import secrets
import string

def tao_token_10_so():
    chu_so = string.digits 
    token = ''.join(secrets.choice(chu_so) for _ in range(10))
    return token
