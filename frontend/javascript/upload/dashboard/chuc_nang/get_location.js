function getViTri() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        localStorage.setItem('lat', lat);
        localStorage.setItem('lon', lon);
        localStorage.removeItem('location_denied');
        console.log(`Vĩ độ: ${lat}, Kinh độ: ${lon}`);
      },
      (error) => {
        console.error('Người dùng từ chối chia sẻ vị trí hoặc lỗi:', error);
        if (error.code === 1) {
          localStorage.setItem('location_denied', 'true');
        }
      }
    );
  } else {
    console.log('Trình duyệt của og không hỗ trợ Geolocation.');
  }
}

if (
  !localStorage.getItem('lat') &&
  !localStorage.getItem('lon') &&
  !localStorage.getItem('location_denied')
) {
  getViTri();
}
