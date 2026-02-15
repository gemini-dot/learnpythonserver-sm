// Đặt ngày kết thúc bảo trì tại đây (Năm, Tháng-1, Ngày, Giờ, Phút)
const countDownDate = new Date('Feb 28, 2026 00:00:00').getTime();

const x = setInterval(function () {
  const now = new Date().getTime();
  const distance = countDownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').innerHTML = days.toString().padStart(2, '0');
  document.getElementById('hours').innerHTML = hours
    .toString()
    .padStart(2, '0');
  document.getElementById('minutes').innerHTML = minutes
    .toString()
    .padStart(2, '0');
  document.getElementById('seconds').innerHTML = seconds
    .toString()
    .padStart(2, '0');

  if (distance < 0) {
    clearInterval(x);
    document.querySelector('.countdown').innerHTML = 'ĐÃ HOÀN THÀNH!';
  }
}, 1000);
