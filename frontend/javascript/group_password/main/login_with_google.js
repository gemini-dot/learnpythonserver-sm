document.getElementById('google-login-btn').addEventListener('click', () => {
  window.location.href =
    'https://learnpythonserver-sm.onrender.com/auth/login_google';
});

window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const sid = params.get('sid');
  const gmail = params.get('gmail');

  if (sid && gmail) {
    window.history.replaceState({}, document.title, window.location.pathname);
    await handleVerifyUID(sid, gmail);
  }

  async function handleVerifyUID(uidVal, emailVal) {
    try {
      const response = await fetch(
        'https://learnpythonserver-sm.onrender.com/auth/google/verify_uid',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: uidVal,
            gmail: emailVal,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200 && data.trang_thai) {
        alert(data.mes);
        window.location.href =
          'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/upload/dashboard/index.html';
      } else {
        alert('Lỗi: ' + data.mes);
        window.location.href =
          'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/group_password/input_pass.html';
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
    }
  }
});
