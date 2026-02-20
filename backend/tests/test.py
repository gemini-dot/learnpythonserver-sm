import requests
import pytest

BASE_URL = "http://localhost:5000/auth/input-pass"


def test_dang_nhap_thanh_cong():
    payload = {"gmail": "samvasang1192011@gmail.com", "password": "Samvasang1192011#"}

    response = requests.post(BASE_URL, json=payload)
    assert response.status_code == 200
    print("\n✅ Test Đăng nhập thành công: PASS")


def test_dang_nhap_sai_pass():
    payload = {"gmail": "samvasang1192011@gmail.com", "password": "sai_roi_og_oi"}

    response = requests.post(BASE_URL, json=payload)

    assert response.status_code == 401
    print("\n✅ Test Sai mật khẩu: PASS (Bị chặn đúng)")


def test_dang_nhap_khong_ton_tai():
    payload = {"gmail": "email_ma@gmail.com", "password": "any_password"}

    response = requests.post(BASE_URL, json=payload)

    assert response.status_code == 401
    print("\n✅ Test Email không tồn tại: PASS (Bị chặn đúng)")
