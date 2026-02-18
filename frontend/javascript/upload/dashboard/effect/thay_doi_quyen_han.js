async function fetchUserPower() {
  const API_URL = 'https://learnpythonserver-sm.onrender.com/profile/get_power';

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Lỗi hệ thống: ${response.status}`);
    }

    const data = await response.json();
    const userPower = data.power || 'BASIC';
    const badge = document.querySelector('.am-badge-pro');

    if (badge) {
      const svgIcon = badge.querySelector('svg').outerHTML;
      badge.innerHTML = `${svgIcon} ${userPower.toUpperCase()}`;

      switch (userPower) {
        case 'ADMIN':
          badge.style.setProperty('color', '#FFD700', 'important');
          badge.style.setProperty('border', '1px solid #FFD700', 'important');
          badge.style.setProperty(
            'background',
            'rgba(255, 215, 0, 0.1)',
            'important'
          );
          break;
        case 'PREMIUM':
          badge.style.setProperty('color', '#00f2ff', 'important');
          badge.style.setProperty('border', '1px solid #00f2ff', 'important');
          badge.style.setProperty(
            'background',
            'rgba(0, 242, 255, 0.1)',
            'important'
          );
          break;
        default:
          badge.style.setProperty('color', '#888', 'important');
      }
      console.log(`Đã cập nhật quyền hạn: ${userPower}`);
    }
  } catch (error) {
    console.error('Nhưng! Có lỗi khi fetch quyền hạn:', error);
  }
}

// Gọi hàm ngay khi trang web load xong
document.addEventListener('DOMContentLoaded', fetchUserPower);
