import { showToast } from '../../popup/popup.js';

(function () {
  const socket = io('https://learnpythonserver-sm.onrender.com');

  socket.on('global_notification', (data) => {
    console.log('📡 Đã nhận thông báo hệ thống:', data.message);

    if (typeof toast === 'function') {
      showToast('info', `THÔNG BÁO: ${data.message}`);
    } else {
      showToast('info', 'Thông báo hệ thống: ' + data.message);
    }
  });
  socket.on('connect_error', (err) => {
    console.error('❌ Lỗi kết nối Socket:', err.message);
  });

  socket.on('connect', () => {
    console.log('✅ Đã kết nối thành công với trạm phát sóng Python!');
  });
})();

async function secretMaintenanceCheck() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/ping/khoi-dong'
    );
    if (response.status === 503) {
      window.location.href =
        'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/503.html';
    }
  } catch (error) {
    console.log('Server đang khởi động hoặc gặp sự cố kết nối.');
  }
}

secretMaintenanceCheck();

const form = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');

let time = 300;

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  let isSuccess = false;
  const emailValue = emailInput.value.trim();

  if (!emailValue) {
    showToast('error', 'Vui lòng nhập địa chỉ email của bạn!');
    return;
  }

  const submitBtn = form.querySelector('.submit-btn');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerText = 'Đang gửi...';
  submitBtn.disabled = true;
  showToast('info', 'Đang gửi yêu cầu...');

  const API_URL =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000' //server test ở nhà:)
      : 'https://learnpythonserver-sm.onrender.com';

  try {
    const response = await fetch(`${API_URL}/auth/tim-mat-khau1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gmail: emailValue }),
    });

    const data = await response.json();

    if (response.ok) {
      isSuccess = true;
      console.log('Status code nè bạn:', response.status);
      console.log('Server bảo: ' + data.message);
      document.getElementById('successModal').style.display = 'flex';

      submitBtn.disabled = true;
      let timeLeft = time;
      const timer = setInterval(() => {
        timeLeft--;
        submitBtn.innerText = `Chờ (${timeLeft}s)`;

        if (timeLeft <= 0) {
          clearInterval(timer);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }, 1000);
      return;
    } else {
      showToast(
        'error',
        'Lỗi: ' + (data.message || 'Có gì đó sai sai rồi og ơi!')
      );
    }
  } catch (error) {
    console.error('Lỗi kết nối:', error);
    showToast('error', 'Không kết nối được với server rồi!');
  } finally {
    if (!isSuccess) {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  }
});

function closeModal() {
  document.getElementById('successModal').style.display = 'none';
} //
