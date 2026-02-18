/**
 * Hàm lấy quyền hạn từ Flask và cập nhật lên giao diện
 */
async function fetchUserPower() {
  // Đường dẫn route og đã định nghĩa trong Blueprint
  const API_URL = 'https://learnpythonserver-sm.onrender.com/profile/get_power';

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Lỗi hệ thống: ${response.status}`);
    }

    const data = await response.json();

    // Giả sử server trả về: { "power": "PREMIUM" }
    // Og kiểm tra lại trong get_power_controller() xem key chính xác là gì nhé
    const userPower = data.power || 'BASIC';

    // Tìm element chứa badge
    const badgeElement = document.querySelector('.am-badge-pro');

    if (badgeElement) {
      // Cách này giữ nguyên cái icon ngôi sao (thẻ <svg>) và chỉ đổi chữ
      // SVG là child đầu tiên, chữ là child thứ hai
      const svgIcon = badgeElement.querySelector('svg').outerHTML;
      badgeElement.innerHTML = `${svgIcon} ${userPower.toUpperCase()}`;

      // Log nhẹ một cái để og dễ debug trên Console của Ubuntu
      console.log(`Đã cập nhật quyền hạn: ${userPower}`);
    }
  } catch (error) {
    console.error('Nhưng! Có lỗi khi fetch quyền hạn:', error);
  }
}

// Gọi hàm ngay khi trang web load xong
document.addEventListener('DOMContentLoaded', fetchUserPower);
