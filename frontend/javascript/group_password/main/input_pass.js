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

userpass = document.getElementById("password")
useremail = document.getElementById("email")
buttonpass = document.getElementById("dang-nhap")

buttonpass.addEventListener('submit', function(event) {
    event.preventDefault();

    const lay_gia_tri_pass = userpass.value;
    const lay_gia_tri_user = useremail.value;

    const goi_du_lieu = {
        "gmail": lay_gia_tri_user,
        "password": lay_gia_tri_pass    
    };

    fetch("https://learnpythonsever-sm.onrender.com/auth/input-pass", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goi_du_lieu)
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                showToast('success','Đăng nhập thành công! Chào mừng bạn quay trở lại.')
                window.location.href = "../../../view/upload/index.html"
            });
        } 
        else if (response.status === 401) {
            // Nếu là 401, Flask đang báo sai mật khẩu
            return response.json().then(data => {
                showToast('error',"Thất bại: " + (data.message || "Sai tài khoản hoặc mật khẩu!"))
            });
        } 
        else {
            // Các mã lỗi khác như 500, 404...
            showToast('error',`Lỗi hệ thống: Mã lỗi ${response.status}`)
        }
    })
    .catch(error => {
        console.error("Lỗi kết nối mạng rồi bạn ơi:", error);
        showToast('error',`Lỗi kết nối mạng rồi bạn ơi:${error}`)
    });
});

