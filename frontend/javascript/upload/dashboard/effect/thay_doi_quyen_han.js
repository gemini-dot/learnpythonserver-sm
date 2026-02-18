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
    const badgeElement = document.querySelector('.am-badge-pro');

    if (badgeElement) {
      const svgIcon = badgeElement.querySelector('svg').outerHTML;
      badgeElement.innerHTML = `${svgIcon} ${userPower.toUpperCase()}`;
      if (power === 'ADMIN') {
        badgeElement.style.color = '#FFD700';
        badgeElement.style.fontWeight = 'bold';
        badgeElement.style.textShadow = '0 0 5px rgba(255, 215, 0, 0.5)';
        badgeElement.style.border = '1px solid #FFD700';
      } else if (power === 'PREMIUM') {
        badgeElement.style.color = '#00f2ff';
        badgeElement.style.border = '1px solid #00f2ff';
      } else {
        badgeElement.style.color = '';
        badgeElement.style.border = '';
      }
      console.log(`Đã cập nhật quyền hạn: ${userPower}`);
    }
  } catch (error) {
    console.error('Nhưng! Có lỗi khi fetch quyền hạn:', error);
  }
}

// Gọi hàm ngay khi trang web load xong
document.addEventListener('DOMContentLoaded', fetchUserPower);
