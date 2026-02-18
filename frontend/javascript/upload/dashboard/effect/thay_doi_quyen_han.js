async function updatePowerBadge() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/get_power',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();
    console.log('Dữ liệu quyền hạn:', data);
    const powerLevel = data.cap_nguoi_dung || data.ket_qua;

    if (powerLevel) {
      const badgeEl = document.querySelector('.am-badge-pro');
      if (badgeEl) {
        const svgIcon = badgeEl.querySelector('svg').outerHTML;
        badgeEl.innerHTML = `${svgIcon} ${powerLevel.toUpperCase()}`;
        badgeEl.style.color = '#00ff00';
      }
    }
  } catch (error) {
    console.error('Lỗi cập nhật badge:', error);
  }
}
window.addEventListener('DOMContentLoaded', updatePowerBadge);
