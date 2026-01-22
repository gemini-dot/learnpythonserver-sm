// Đợi HTML load xong rồi mới chạy
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
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }
            
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp');
        return;
    }
            
    if (!terms) {
        alert('Vui lòng đồng ý với điều khoản dịch vụ');
        return;
    }

    const fullname = firstname + " " + lastname;
    const goi_du_lieu = {
        username: fullname,
        gmail: email,
        password: password,
    };

    console.log("Đang gửi dữ liệu:", goi_du_lieu);

    fetch('http://localhost:5000/auth/create-a-pass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(goi_du_lieu)
    })
    .then(response => {
        return response.json().then(data => {
            if (response.ok) {
                alert(`Đăng ký thành công! Chào mừng ${fullname}`);
            } else {
                alert('Lỗi: ' + (data.message || 'Có lỗi xảy ra'));
            }
        });
    })
    .catch(error => {
        console.log("Lỗi kết nối", error);
    });
}