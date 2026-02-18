// Hàm fetch dữ liệu từ Backend
async function getPowerFromServer() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/profile/get_power',
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    const data = await response.json();
    return data.cap_nguoi_dung || data.ket_qua;
  } catch (e) {
    console.error('Server tèo rồi og:', e);
    return null;
  }
}

// Hàm thực thi thay đổi
async function forceUpdateBadge() {
  const powerText = await getPowerFromServer();
  if (!powerText) return;

  // "Camera giám sát" DOM
  const observer = new MutationObserver((mutations, obs) => {
    const badgeEl = document.querySelector('.am-badge-pro');

    if (badgeEl) {
      console.log('Tìm thấy đối tượng! Đang ép cập nhật...');
      const svgIcon = badgeEl.querySelector('svg')?.outerHTML || '';

      // Ép nội dung mới vào
      badgeEl.innerHTML = `${svgIcon} ${powerText.toUpperCase()}`;

      // Đánh dấu để không lặp vô tận
      badgeEl.setAttribute('data-updated', 'true');

      // Dừng giám sát khi đã xong việc
      obs.disconnect();
    }
  });

  // Bắt đầu giám sát toàn bộ body để đợi cái badge xuất hiện
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Chạy sau khi mọi thứ đã sẵn sàng
window.addEventListener('load', forceUpdateBadge);
