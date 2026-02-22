document.getElementById('google-login-btn').addEventListener('click', () => {
  window.location.href =
    'https://learnpythonserver-sm.onrender.com/auth/login_google';
});

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const sid = params.get('sid');

  if (sid) {
    localStorage.setItem('user_session', sid);
    alert('Đăng nhập thành công! Đang chuyển trang...');
    window.location.href = '#';
  }
});
