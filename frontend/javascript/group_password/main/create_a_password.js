import { showToast } from './../../popup/popup.js';

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('main-signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            // CHẶN reset trang ngay lập tức
            event.preventDefault(); 
            handleSignup(event);
        });
    }
});

function handleSignup(event) {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
        showToast('error','Vui lòng điền đầy đủ thông tin');
        return;
    }
            
    if (password !== confirmPassword) {
        showToast('error','Mật khẩu xác nhận không khớp')
        return;
    }
            
    if (!terms) {
        showToast('error','Vui lòng đồng ý với điều khoản dịch vụ')
        return;
    }

    const fullname = firstname + " " + lastname;
    const goi_du_lieu = {
        username: fullname,
        gmail: email,
        password: password,
    };

    showToast('info', 'Đang gửi yêu cầu...');
    console.log("Đang gửi dữ liệu:", goi_du_lieu);

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'//server test ở nhà:)
        : 'https://learnpythonserver-sm.onrender.com';

    fetch(`${API_URL}/auth/create-a-pass`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(goi_du_lieu)
    })
    .then(response => {
        return response.json().then(data => {
            if (response.ok) {
                showToast('success',`Đăng ký thành công! Chào mừng ${fullname}`)
            } else {
                showToast('error','Lỗi: ' + (data.message || 'Có lỗi xảy ra'))
            }
        });
    })
    .catch(error => {
        console.log("Lỗi kết nối", error);
        showToast('error',`Lỗi kết nối ${error}`)
    });
}//