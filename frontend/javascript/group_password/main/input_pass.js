import { showToast } from '../../popup/popup.js';

async function secretMaintenanceCheck() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/ping/khoi-dong'
    );
    if (response.status === 503) {
      window.location.href =
        'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/503.html'; // Chuyển hướng sang trang bảo trì
    }
  } catch (error) {
    console.log('Server đang khởi động hoặc gặp sự cố kết nối.');
  }
}

secretMaintenanceCheck();

// Thêm const vào trước các biến để khai báo nè og
const userpass = document.getElementById('password');
const useremail = document.getElementById('email');
const formDangNhap = document.getElementById('dang-nhap'); // Đổi tên cho đỡ nhầm với nút bấm

if (formDangNhap) {
  formDangNhap.addEventListener('submit', function (event) {
    // Chặn hành động reload mặc định của form
    event.preventDefault();

    showToast('info', 'Đang gửi xác thực...');

    const lay_gia_tri_pass = userpass.value;
    const lay_gia_tri_user = useremail.value;

    const goi_du_lieu = {
      gmail: lay_gia_tri_user,
      password: lay_gia_tri_pass,
    };

    console.log('Đang gửi dữ liệu:', goi_du_lieu);

    const API_URL =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000' //server test ở nhà:)
        : 'https://learnpythonserver-sm.onrender.com'; //

    fetch(`${API_URL}/auth/input-pass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(goi_du_lieu),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((data) => {
            showToast(
              'success',
              'Đăng nhập thành công! Chào mừng bạn quay trở lại.'
            );
            setTimeout(() => {
              window.location.href =
                'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/upload/web_upload/index.html';
            }, 2000); //
          });
        } else if (response.status === 401) {
          return response.json().then((data) => {
            showToast(
              'error',
              'Thất bại: ' + (data.message || 'Sai tài khoản hoặc mật khẩu!')
            );
          });
        } else {
          showToast('error', `Lỗi hệ thống: Mã lỗi ${response.status}`);
        }
      })
      .catch((error) => {
        console.error('Lỗi kết nối mạng rồi bạn ơi:', error);
        showToast('error', `Lỗi kết nối mạng rồi bạn ơi: ${error}`);
      });
  });
}
