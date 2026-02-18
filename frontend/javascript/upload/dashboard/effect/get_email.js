window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userAccount = urlParams.get('useraccount');

  if (userAccount) {
    const emailContainer = document.querySelector('.am-email');
    if (emailContainer) {
      const cleanEmail = decodeURIComponent(userAccount);

      // Thay thế toàn bộ nội dung bên trong div am-email
      // Cách này sẽ xóa sạch thẻ <a> cũ của Cloudflare
      emailContainer.innerHTML = `
                <a href="mailto:${cleanEmail}" style="color: var(--ink-4); text-decoration: none;">
                    ${cleanEmail}
                </a>`;

      console.log('✅ Đã thay thẻ a cũ bằng email: ' + cleanEmail);
    }
  } else {
    console.warn(
      '⚠️ URL thiếu ?useraccount=... nên không thay email được ông ơi!'
    );
  }
});
