import { showToast } from '../../popup/popup.js';

const nut_bam_reset = document.getElementById('btn-reset');

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    gmail: params.get('gmail'),
    token: params.get('token'),
  };
}

nut_bam_reset.addEventListener('submit', async function (event) {
  event.preventDefault();

  const { gmail, token } = getQueryParams();

  const mat_khau_moi = document.getElementById('mat-khau-moi').value;
  const mat_khau_xac_nhan = document.getElementById('mat-khau-xac-nhan').value;

  nut_bam_reset.disabled = true;
  nut_bam_reset.innerText = 'Đang xử lý...';

  if (mat_khau_moi !== mat_khau_xac_nhan) {
    showToast('error', 'Mật khẩu xác nhận không khớp!');
    return;
  }

  console.log('đến đoạn gửi rồi nè');

  const API_URL =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000' //server test ở nhà:)
      : 'https://learnpythonserver-sm.onrender.com';

  try {
    const response = await fetch(`${API_URL}/auth/tim-mat-khau3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gmail: gmail,
        token: token,
        new_password: mat_khau_moi,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      showToast(
        'success',
        'Đổi mật khẩu thành công! Bây giờ bạn có thể đăng nhập với mật khẩu mới.'
      );
      setTimeout(() => {
        window.location.href = 'input_pass.html';
      }, 3000);
    } else {
      const data = await response.json();
      showToast(
        'error',
        'Lỗi rồi: ' + (data.message || data.error || 'Không thể đổi mật khẩu!')
      );
      window.location.href = '../error/404.html';
    } //
  } catch (error) {
    console.error('Lỗi:', error);
    showToast('error', 'Không kết nối được server!');
  }
});
