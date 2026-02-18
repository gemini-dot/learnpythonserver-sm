function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    let val = parts.pop().split(';').shift();
    // Decode và xóa dấu ngoặc kép nếu cookie bị bọc bởi ""
    return decodeURIComponent(val).replace(/^"|"$/g, '');
  }
  return null;
}

// Chạy ngay khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', function () {
  const realName = getCookie('ten_nguoi_dung');
  const emailFromCookie = getCookie('user_gmail');

  if (realName) {
    document.querySelector('.am-name').innerText = realName;
  }

  // Tiện tay thay luôn cả Email cho nó "Root"
  if (emailFromCookie) {
    const emailElement = document.querySelector('.am-email a');
    if (emailElement) {
      emailElement.innerText = emailFromCookie;
      emailElement.href = `mailto:${emailFromCookie}`;
    }
  }
});
