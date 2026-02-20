import hashlib


def get_sha256_hash(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()
