document.getElementById('google-login-btn').addEventListener('click', () => {
  window.location.href =
    'https://learnpythonserver-sm.onrender.com/auth/login_google';
});

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const sid = params.get('sid');
  const gmail = params.get('gmail');

  async function handleVerifyUID() {
    try {
      const response = await fetch(
        'https://learnpythonserver-sm.onrender.com/auth/google/verify_uid',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: sid,
            gmail: gmail,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200 && data.trang_thai) {
        alert(data.mes);
        window.location.href = '/dashboard'; // Chuyển vào trang quản lý file xịn sò của og
      } else {
        alert('Lỗi: ' + data.mes);
      }
    } catch (error) {
      console.error('Lỗi kết nối server:', error);
      alert('Server đang bận, og thử lại sau nhé!');
    }
  }
});
