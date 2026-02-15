async function startGateway() {
  const progressBar = document.getElementById('progress');
  const statusText = document.getElementById('status');

  // 1. Giả lập quá trình khởi tạo (Tăng thanh load lên 30%)
  progressBar.style.width = '30%';

  // 2. Kiểm tra kết nối Server thực tế
  // Thay 'https://google.com' bằng server của ông
  const targetUrl = 'https://google.com';

  try {
    const response = await fetch(targetUrl, { mode: 'no-cors' });

    // Nếu kết nối OK, chạy nốt thanh load
    progressBar.style.width = '100%';
    statusText.innerText = 'CONNECTION ESTABLISHED. REDIRECTING...';

    // Đợi 1 giây để người dùng thấy thanh load 100% rồi chuyển trang
    setTimeout(() => {
      document.body.classList.add('fade-exit');
      window.location.href = targetUrl; // CHUYỂN ĐẾN WEB KHÁC
    }, 1500);
  } catch (error) {
    // Nếu không kết nối được
    progressBar.style.backgroundColor = 'red';
    statusText.innerText = 'SERVER UNREACHABLE. ACCESS DENIED.';
    statusText.style.color = 'red';
  }
}

// Chạy ngay khi mở trang
window.addEventListener('load', startGateway);
