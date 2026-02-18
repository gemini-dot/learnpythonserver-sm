async function updateAdminName() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/profile/get-profile',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (data.trang_thai && data.username) {
      const nameTarget = document.querySelector('.am-name');
      if (nameTarget) {
        nameTarget.textContent = data.username;
        console.log('✅ Đã đổi Anonymous thành: ' + data.username);
      }
    }
  } catch (err) {
    console.error('Lỗi fetch tên rồi og ơi:', err);
  }
}

document.addEventListener('DOMContentLoaded', updateAdminName);
