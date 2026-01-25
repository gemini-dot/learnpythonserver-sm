import { showToast } from '../../popup/popup.js';

// Thêm const vào trước các biến để khai báo nè og
const userpass = document.getElementById("password");
const useremail = document.getElementById("email");
const formDangNhap = document.getElementById("dang-nhap"); // Đổi tên cho đỡ nhầm với nút bấm

if (formDangNhap) {
    formDangNhap.addEventListener('submit', function(event) {
        // Chặn hành động reload mặc định của form
        event.preventDefault();

        showToast('info', 'Đang gửi xác thực...');

        const lay_gia_tri_pass = userpass.value;
        const lay_gia_tri_user = useremail.value;

        const goi_du_lieu = {
            "gmail": lay_gia_tri_user,
            "password": lay_gia_tri_pass    
        };
        
        console.log("Đang gửi dữ liệu:", goi_du_lieu);
        
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
                return response.json().then(data => {
                    showToast('error',"Thất bại: " + (data.message || "Sai tài khoản hoặc mật khẩu!"))
                });
            } 
            else {
                showToast('error',`Lỗi hệ thống: Mã lỗi ${response.status}`)
            }
        })
        .catch(error => {
            console.error("Lỗi kết nối mạng rồi bạn ơi:", error);
            showToast('error',`Lỗi kết nối mạng rồi bạn ơi: ${error}`)
        });
    });
}