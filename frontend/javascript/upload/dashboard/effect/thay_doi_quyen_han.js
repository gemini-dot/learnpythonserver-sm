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

      console.log('Đang bắt đầu lên màu cho:', userPower); // Kiểm tra log này

      switch (userPower) {
        case 'admin-root':
          badge.style.cssText = `
            color: #FFD700 !important;
            background: rgba(255, 215, 0, 0.15) !important;
            border: 1px solid #FFD700 !important;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.8) !important;
            font-weight: 800 !important;
            opacity: 1 !important;
          `;
          break;
        case 'PREMIUM':
          badge.style.cssText = `
            color: #00f2ff !important;
            background: rgba(0, 242, 255, 0.1) !important;
            border: 1px solid #00f2ff !important;
            text-shadow: 0 0 10px rgba(0, 242, 255, 0.8) !important;
            font-weight: 800 !important;
            opacity: 1 !important;
          `;
          break;
        default:
          badge.style.cssText =
            'color: #888 !important; opacity: 1 !important;';
      }
    }
  } catch (error) {
    console.error('Nhưng! Có lỗi khi fetch quyền hạn:', error);
  }
}

// Gọi hàm ngay khi trang web load xong
document.addEventListener('DOMContentLoaded', fetchUserPower);
