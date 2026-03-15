/**
 * Reset giao diện về 0% khi mới vào trang (trong lúc chờ Backend phản hồi)
 */
function resetToZero() {
  // 1. Sidebar
  const storagePctEl = document.querySelector('.storage-pct');
  const storFillEl = document.getElementById('storFill');
  const storageInfoEl = document.querySelector('.storage-info');

  if (storagePctEl) storagePctEl.innerText = `0%`;
  if (storFillEl) storFillEl.style.width = `0%`; // Kéo thanh màu về 0
  if (storageInfoEl) {
    storageInfoEl.innerHTML = `Đang tính toán dung lượng...`;
  }

  // 2. Right Click Menu
  const ctxStorageValueEl = document.querySelector(
    '.context-menu-storage-value'
  );
  const ctxStorageFillEl = document.getElementById('ctxStorageFill');
  const ctxStorageTextEl = document.querySelector('.context-menu-storage-text');

  if (ctxStorageValueEl) ctxStorageValueEl.innerText = `0%`;
  if (ctxStorageFillEl) ctxStorageFillEl.style.width = `0%`;
  if (ctxStorageTextEl) {
    ctxStorageTextEl.innerHTML = `Đang tải...`;
  }

  // 3. Settings Modal
  const settingsStorageContainer = document.querySelector(
    '#settings-storage .settings-item > div:nth-child(2)'
  );
  if (settingsStorageContainer) {
    const textSpanInfo = settingsStorageContainer.querySelector(
      'div:first-child span:first-child'
    );
    const textSpanPct = settingsStorageContainer.querySelector(
      'div:first-child span:last-child'
    );
    const barFill = settingsStorageContainer.querySelector(
      'div:last-child > div'
    );

    if (textSpanInfo) textSpanInfo.innerText = `Đang tính toán...`;
    if (textSpanPct) textSpanPct.innerText = `0%`;
    if (barFill) barFill.style.width = `0%`;
  }
}
resetToZero();
