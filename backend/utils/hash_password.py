import hashlib
import os
from configs.argon2 import ph
from logs import logger


def make_salt() -> str:
    return os.urandom(16).hex()


def hash_password(password, salt) -> str:
    if salt is None:
        logger.error("no salt", __file__)
        raise ValueError("Lỗi nặng: Không tìm thấy salt trong hệ thống!")
    newpass = password + salt
    return hashlib.sha256(newpass.encode()).hexdigest()


def hash_password_v2(passworld) -> str:
    newpass = passworld
    hash = ph.hash(str(newpass))
    return hash
