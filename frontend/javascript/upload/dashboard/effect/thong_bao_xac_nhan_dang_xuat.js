function toggleLogoutModal(show) {
  console.log('[DEBUG] Hàm toggle được gọi với giá trị:', show); // Xem trong F12 Console
  const modal = document.getElementById('logoutModal');

  if (!modal) {
    console.error('Không tìm thấy cái bảng có id là logoutModal rồi og ơi!');
    return;
  }

  if (show === true) {
    modal.style.setProperty('display', 'flex', 'important');
  } else {
    modal.style.setProperty('display', 'none', 'important');
  }
}

function confirmLogout() {
  console.log('Đã xác nhận đăng xuất!');
  window.location.reload();
}
