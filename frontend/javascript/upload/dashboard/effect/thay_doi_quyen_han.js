async function updatePowerBadge() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/profile/get_power',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();
    if (response.ok && data.cap_nguoi_dung) {
      const badgeEl = document.querySelector('.am-badge-pro');

      if (badgeEl) {
        const svgIcon = badgeEl.querySelector('svg').outerHTML;
        badgeEl.innerHTML = `${svgIcon} ${data.cap_nguoi_dung.toUpperCase()}`;
      }
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật Badge quyền hạn:', error);
  }
}

// Chạy hàm này khi trang load
updatePowerBadge();
