async function updatePowerBadge() {
  try {
    console.log('Đang bắt đầu lấy quyền hạn...');
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/profile/get_power',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();
    console.log('Dữ liệu Backend trả về:', data);
    const powerText = data.cap_nguoi_dung || 'Basic';
    const checkExist = setInterval(() => {
      const badgeEl = document.querySelector('.am-badge-pro');

      if (badgeEl) {
        console.log('Đã tìm thấy thẻ Badge, đang cập nhật...');
        const svgIcon = badgeEl.querySelector('svg')
          ? badgeEl.querySelector('svg').outerHTML
          : '';
        badgeEl.innerHTML = `${svgIcon} ${powerText.toUpperCase()}`;
        if (powerText.toLowerCase() === 'admin-root') {
          badgeEl.style.color = '#FFD700';
          badgeEl.style.fontWeight = '800';
        }

        clearInterval(checkExist);
      }
    }, 100);
  } catch (error) {
    console.error('Lỗi fetch hoặc xử lý DOM:', error);
  }
}
updatePowerBadge();
