function menuAction(action) {
  closeAvatarMenu();
  const msgs = {
    profile: '👤 Mở hồ sơ cá nhân',
    'storage-plan': '☁️ Quản lý gói lưu trữ',
    billing: '💳 Mở trang thanh toán',
    settings: '⚙️ Mở cài đặt',
    help: '❓ Mở trung tâm hỗ trợ',
    shortcut: '⌨️ Xem danh sách phím tắt',
    logout: '👋 Đã đăng xuất!',
  };
  toast(msgs[action] || action);
}
