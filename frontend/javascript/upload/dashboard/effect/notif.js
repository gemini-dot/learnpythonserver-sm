function toggleNotif() {
  const t = document.getElementById('notifToggle');
  const on = t.classList.toggle('on');
  toast(on ? '🔔 Đã bật thông báo' : '🔕 Đã tắt thông báo');
}
