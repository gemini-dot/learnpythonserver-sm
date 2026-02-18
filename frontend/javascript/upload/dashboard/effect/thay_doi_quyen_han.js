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
            color: #D4AF37 !important; /* Màu vàng kim chuẩn, không phèn */
            background: rgba(212, 175, 55, 0.1) !important; /* Nền vàng cực nhạt */
            border: 1.5px solid #D4AF37 !important; /* Viền mỏng cho cứng cáp */
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            text-shadow: none !important; /* Bỏ sạch glow theo ý og */
            opacity: 1 !important;
          `;
          break;
        case 'PREMIUM':
          badge.style.cssText = `
            color: #A8A8A8 !important; /* Màu bạc cho Premium nếu thích */
            border: 1px solid #A8A8A8 !important;
            font-weight: 600 !important;
            text-shadow: none !important;
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
