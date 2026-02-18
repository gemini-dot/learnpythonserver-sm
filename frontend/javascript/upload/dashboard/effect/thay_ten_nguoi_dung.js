document.addEventListener('DOMContentLoaded', function () {
  // 1. Công thức lấy cookie và gọt sạch dấu ngoặc kép
  function getCleanCookie(name) {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    if (match) {
      // Giải mã và xóa dấu ngoặc kép ở đầu/cuối chuỗi
      return decodeURIComponent(match[2]).replace(/^"|"$/g, '');
    }
    return null;
  }

  // 2. Lấy tên và thực hiện thay thế
  const userRealName = getCleanCookie('ten_nguoi_dung');

  if (userRealName) {
    const nameElement = document.querySelector('.am-name');
    if (nameElement) {
      nameElement.textContent = userRealName;
      console.log('ADMIN-ROOT: Đã đổi tên thành ' + userRealName);
    }
  } else {
    console.log("ADMIN-ROOT: Không tìm thấy cookie 'ten_nguoi_dung'");
  }
});
