async function updatePowerBadge() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/profile/get_power',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      console.error('Lỗi HTTP:', response.status);
      return;
    }

    const data = await response.json();
    const powerText = data.cap_nguoi_dung || data.ket_qua;

    if (powerLevelFound(powerText)) {
      // Đợi cho đến khi phần tử tồn tại trong DOM
      let attempts = 0;
      const checkExist = setInterval(() => {
        const badgeEl = document.querySelector('.am-badge-pro');
        attempts++;

        if (badgeEl) {
          const svgIcon = badgeEl.querySelector('svg')
            ? badgeEl.querySelector('svg').outerHTML
            : '';
          badgeEl.innerHTML = `${svgIcon} ${powerText.toUpperCase()}`;

          // Nếu là Admin thì đổi luôn màu nền cho dễ nhận diện
          if (powerText.toLowerCase() === 'admin') {
            badgeEl.style.background = 'var(--ink)';
            badgeEl.style.color = '#FFD700';
          }

          clearInterval(checkExist);
        }

        if (attempts > 50) {
          // Sau 5 giây mà không thấy thì thôi
          console.log('Không tìm thấy class .am-badge-pro sau 5s');
          clearInterval(checkExist);
        }
      }, 100);
    }
  } catch (error) {
    // Nếu hiện cái alert này thì do lỗi kết nối/CORS
    alert('Lỗi kết nối tới Server rồi og ơi!');
    console.error(error);
  }
}

function powerLevelFound(val) {
  return val !== undefined && val !== null;
}

// Chạy luôn
updatePowerBadge();
