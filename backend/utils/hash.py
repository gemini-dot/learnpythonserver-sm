import hashlib

def hash(hash_item):
    byte_data = hash_item.encode()
    hash_object = hashlib.sha256(byte_data)
    return hash_object.hexdigest()

