async function updateAdminName() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/api/get-profile',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Server nhả về HTML thay vì JSON rồi ông giáo ơi!');
      return;
    }

    const data = await response.json();

    if (data.trang_thai && data.username) {
      const nameTarget = document.querySelector('.am-name');
      if (nameTarget) {
        nameTarget.textContent = data.username;
        console.log('✅ [VAULT] Đã đổi tên thành: ' + data.username);
      }
    }
  } catch (err) {
    console.error('⚠️ Lỗi fetch tên:', err);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateAdminName);
} else {
  updateAdminName();
}
