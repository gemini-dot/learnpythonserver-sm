function getAvatarName(fullName) {
  const words = fullName.trim().split(/\s+/);
  const firstName = words.pop();
  return firstName.charAt(0).toUpperCase();
}

async function updateAdminName() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/profile/get_profile',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Server nhả về HTML thay vì JSON rồi ông giáo ơi!');
      return;
    }

    const data = await response.json();

    if (data.trang_thai && data.username) {
      const nameTarget = document.querySelector('.am-name');
      if (nameTarget) {
        nameTarget.textContent = data.username;
        const userName = data.username;
        const avatarChar = getAvatarName(userName);

        const avatarElement = document.querySelector('.am-avatar-big');
        if (avatarElement) {
          avatarElement.innerText = avatarChar;
        }
        console.log('[LOG] Đã đổi tên thành công');
        console.log('[LOG] Đã đổi avatar thành công');
      }
    }
  } catch (err) {
    console.error('Lỗi fetch tên:', err);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateAdminName);
} else {
  updateAdminName();
}
