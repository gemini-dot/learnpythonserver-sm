function toggleDark() {
  const t = document.getElementById('darkToggle');
  const on = t.classList.toggle('on');
  const set = (k, dark, light) =>
    document.documentElement.style.setProperty(k, on ? dark : light);
  set('--bg', '#111111', '#f5f5f3');
  set('--surface', '#1a1a1a', '#ffffff');
  set('--border', '#2a2a2a', '#e0e0de');
  set('--border-dark', '#3a3a3a', '#c0c0be');
  set('--ink', '#f0f0ee', '#0a0a0a');
  set('--ink-2', '#cccccc', '#333332');
  set('--ink-3', '#999999', '#666664');
  set('--ink-4', '#666666', '#999997');
  toast(on ? '🌙 Giao diện tối đã bật' : '☀️ Giao diện sáng đã bật');
}
