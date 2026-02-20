import unittest
from backend.utils.hash_password import hash_password, make_salt
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))


class TestSecurity(unittest.TestCase):
    def test_hash_consistency(self):
        # Kiểm tra xem cùng 1 mật khẩu và salt thì phải ra cùng 1 hash
        password = "123"
        salt = make_salt()
        hash1 = hash_password(password, salt)
        hash2 = hash_password(password, salt)
        self.assertEqual(hash1, hash2)

    def test_salt_is_unique(self):
        # Kiểm tra xem 2 lần tạo salt phải ra 2 chuỗi khác nhau
        salt1 = make_salt()
        salt2 = make_salt()
        self.assertNotEqual(salt1, salt2)


if __name__ == "__main__":
    unittest.main()
