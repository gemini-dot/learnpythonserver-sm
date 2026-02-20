import hashlib
import os


def make_salt():
    return os.urandom(16).hex()


def hash_password(password, salt):
    newpass = password + salt
    return hashlib.sha256(newpass.encode()).hexdigest()


# kiểu kiểu như thêm muối rồi băm nó cho hacker không hack được á.
