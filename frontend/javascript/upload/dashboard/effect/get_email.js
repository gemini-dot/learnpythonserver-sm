function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Giả sử cookie của og tên là 'user_email'
const userEmail = getCookie('user_gmail');

if (userEmail) {
  // Tìm đến thẻ div có class am-email
  const emailContainer = document.querySelector('.am-email');
  if (emailContainer) {
    // Giải mã email nếu cần, hoặc đơn giản là ghi đè nội dung mới
    emailContainer.innerHTML = `<span style="color: var(--ink-4)">${decodeURIComponent(userEmail)}</span>`;
  }
}
