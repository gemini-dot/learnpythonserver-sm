window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userAccount =
    localStorage.getItem('user_email') || urlParams.get('useraccount');

  if (userAccount) {
    const emailContainer = document.querySelector('.am-email');
    if (emailContainer) {
      const cleanEmail = decodeURIComponent(userAccount);
      emailContainer.innerHTML = `
                <a href="mailto:${cleanEmail}" style="color: var(--ink-4); text-decoration: none;">
                    ${cleanEmail}
                </a>`;
      if (!localStorage.getItem('user_email')) {
        localStorage.setItem('user_email', cleanEmail);
      }
      console.log('[REPLACE] Đã thay thẻ a cũ bằng email: ' + cleanEmail);
    }
  } else {
    console.warn(
      'URL thiếu ?useraccount=... nên không thay email được ông ơi!'
    );
  }
});
