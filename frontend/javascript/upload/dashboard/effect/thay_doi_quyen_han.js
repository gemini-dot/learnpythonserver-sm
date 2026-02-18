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
            background-color: #D4AF37 !important; /* Vàng kim đục hoàn toàn */
            color: #1a1a1a !important;            /* Chữ đen đậm cho tương phản */
            border: none !important;              /* Không cần viền vì nền đã đậm */
            font-weight: 800 !important;
            padding: 2px 10px !important;         /* Thêm tí đệm cho nó dày dặn */
            border-radius: 4px !important;
            opacity: 1 !important;                 /* Đục 100% */
            text-shadow: none !important;
            box-shadow: 2px 2px 0px rgba(0,0,0,0.2) !important; /* Đổ bóng cứng cho giống cái thẻ */
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
