document.addEventListener('DOMContentLoaded', function () {
  // Show hàng toàn bộ cookie ra console để og debug
  console.log('Danh sách Cookie hiện có:');
  console.table(document.cookie.split(';').map((c) => c.trim()));

  function getCookie(name) {
    let cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split('=');
      if (name == cookiePair[0].trim()) {
        // Giải mã và gọt dấu ngoặc kép
        return decodeURIComponent(cookiePair[1]).replace(/^"|"$/g, '');
      }
    }
    return null;
  }

  const nameFromCookie = getCookie('ten_nguoi_dung');
  const nameEl = document.querySelector('.am-name');

  if (nameFromCookie && nameEl) {
    nameEl.textContent = nameFromCookie;
    console.log('✅ Đã tìm thấy và thay tên: ' + nameFromCookie);
  } else {
    console.warn("❌ Vẫn không thấy cookie 'ten_nguoi_dung' đâu og ơi!");
  }
});
