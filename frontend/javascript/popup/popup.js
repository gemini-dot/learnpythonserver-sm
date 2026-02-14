export function showToast(type, message) {
  const container = document.getElementById('toast-container');

  // 1. Tạo thẻ div cho popup
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // 2. Chọn Icon tương ứng
  let iconSVG = '';
  if (type === 'success') {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'info') {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  } else {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  }

  // 3. Đổ nội dung vào
  toast.innerHTML = `
        <div class="icon-box">${iconSVG}</div>
        <div class="content">
            <div class="title">${type === 'success' ? 'Thành công' : type === 'info' ? 'Thông tin' : 'Thất bại'}</div>
            <div class="message">${message}</div>
        </div>
    `;

  // 4. Đưa vào màn hình
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'max-height') {
        toast.remove();
      }
    });
  }, 4000);
}
