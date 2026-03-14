// ═══════════════════════════════════════════════════════════════════
// IMAGE PREVIEW POPUP - Xem trước ảnh với Zoom & Pan
// Tương thích 100% với VAULT Dashboard
// ═══════════════════════════════════════════════════════════════════

// ─── CSS (Thêm vào <style> hoặc file CSS) ─────────────────────────

const imagePreviewCSS = `
  /* ═══ IMAGE PREVIEW OVERLAY ═══ */
  .image-preview-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    display: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .image-preview-overlay.show {
    display: flex;
    opacity: 1;
  }

  /* ═══ HEADER ═══ */
  .preview-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    z-index: 10002;
  }

  .preview-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .preview-filename {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    font-family: 'Manrope', sans-serif;
  }

  .preview-meta {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-family: 'DM Mono', monospace;
    display: flex;
    gap: 12px;
  }

  .preview-actions {
    display: flex;
    gap: 8px;
  }

  .preview-btn {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: #fff;
  }

  .preview-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  .preview-btn svg {
    width: 18px;
    height: 18px;
    stroke: #fff;
    stroke-width: 2;
  }

  .preview-btn.close-btn:hover {
    background: #e74c3c;
    border-color: #e74c3c;
  }

  /* ═══ IMAGE CONTAINER ═══ */
  .preview-image-container {
    position: fixed;
    inset: 64px 0 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: grab;
  }

  .preview-image-container.grabbing {
    cursor: grabbing;
  }

  .preview-image-wrapper {
    position: relative;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: center;
  }

  .preview-image {
    max-width: 90vw;
    max-height: calc(100vh - 144px);
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
  }

  /* ═══ ZOOM CONTROLS ═══ */
  .zoom-controls {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 8px;
    display: flex;
    gap: 8px;
    z-index: 10002;
  }

  .zoom-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: #fff;
  }

  .zoom-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .zoom-btn svg {
    width: 18px;
    height: 18px;
    stroke: #fff;
    stroke-width: 2;
  }

  .zoom-level {
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    color: #fff;
    min-width: 60px;
    justify-content: center;
  }

  /* ═══ BOTTOM INFO PANEL ═══ */
  .preview-info-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 0 24px;
    z-index: 10001;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .info-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
  }

  .info-value {
    font-size: 14px;
    color: #fff;
    font-weight: 600;
    font-family: 'Manrope', sans-serif;
  }

  /* ═══ LOADING SPINNER ═══ */
  .preview-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  }

  .preview-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: preview-spin 1s linear infinite;
  }

  @keyframes preview-spin {
    to { transform: rotate(360deg); }
  }

  /* ═══ NAVIGATION ARROWS ═══ */
  .preview-nav {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 10002;
  }

  .preview-nav:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }

  .preview-nav.prev {
    left: 24px;
  }

  .preview-nav.next {
    right: 24px;
  }

  .preview-nav svg {
    width: 24px;
    height: 24px;
    stroke: #fff;
    stroke-width: 2.5;
  }

  /* ═══ KEYBOARD HINTS ═══ */
  .keyboard-hints {
    position: fixed;
    bottom: 100px;
    right: 24px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 16px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'DM Mono', monospace;
    z-index: 10002;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .image-preview-overlay:hover .keyboard-hints {
    opacity: 1;
  }

  .keyboard-hints div {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .keyboard-hints div:last-child {
    margin-bottom: 0;
  }

  .key {
    background: rgba(255, 255, 255, 0.15);
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 600;
    min-width: 24px;
    text-align: center;
  }

  /* ═══ RESPONSIVE ═══ */
  @media (max-width: 768px) {
    .preview-header {
      height: 56px;
      padding: 0 16px;
    }

    .preview-image-container {
      inset: 56px 0 60px;
    }

    .preview-image {
      max-width: 100vw;
      max-height: calc(100vh - 116px);
    }

    .preview-info-panel {
      height: 60px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .zoom-controls {
      bottom: 70px;
    }

    .keyboard-hints {
      display: none;
    }

    .preview-nav {
      width: 40px;
      height: 40px;
    }

    .preview-nav.prev {
      left: 16px;
    }

    .preview-nav.next {
      right: 16px;
    }
  }
`;

// Inject CSS
const styleElement = document.createElement('style');
styleElement.textContent = imagePreviewCSS;
document.head.appendChild(styleElement);

// ─── HTML MODAL ────────────────────────────────────────────────────

const imagePreviewHTML = `
  <div class="image-preview-overlay" id="imagePreviewOverlay">
    <!-- HEADER -->
    <div class="preview-header">
      <div class="preview-info">
        <div class="preview-filename" id="previewFilename">image.jpg</div>
        <div class="preview-meta">
          <span id="previewDimensions">1920×1080</span>
          <span id="previewSize">2.5 MB</span>
          <span id="previewDate">2026-03-14</span>
        </div>
      </div>
      <div class="preview-actions">
        <button class="preview-btn" onclick="downloadPreviewImage()" title="Tải xuống (D)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button class="preview-btn" onclick="sharePreviewImage()" title="Chia sẻ (S)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
        <button class="preview-btn close-btn" onclick="closeImagePreview()" title="Đóng (ESC)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- IMAGE CONTAINER -->
    <div class="preview-image-container" id="imageContainer">
      <div class="preview-loading" id="previewLoading">
        <div class="preview-spinner"></div>
      </div>
      <div class="preview-image-wrapper" id="imageWrapper">
        <img 
          src="" 
          alt="" 
          class="preview-image" 
          id="previewImage"
          draggable="false"
        >
      </div>
    </div>

    <!-- ZOOM CONTROLS -->
    <div class="zoom-controls">
      <button class="zoom-btn" onclick="zoomOut()" title="Zoom out (-)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
      <div class="zoom-level" id="zoomLevel">100%</div>
      <button class="zoom-btn" onclick="zoomIn()" title="Zoom in (+)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
      <button class="zoom-btn" onclick="resetZoom()" title="Đặt lại (0)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
      </button>
    </div>

    <!-- NAVIGATION ARROWS -->
    <button class="preview-nav prev" onclick="prevImage()" title="Ảnh trước (←)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button class="preview-nav next" onclick="nextImage()" title="Ảnh sau (→)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>

    <!-- BOTTOM INFO PANEL -->
    <div class="preview-info-panel">
      <div class="info-item">
        <div class="info-label">Tên file</div>
        <div class="info-value" id="infoFilename">-</div>
      </div>
      <div class="info-item">
        <div class="info-label">Kích thước</div>
        <div class="info-value" id="infoDimensions">-</div>
      </div>
      <div class="info-item">
        <div class="info-label">Dung lượng</div>
        <div class="info-value" id="infoSize">-</div>
      </div>
      <div class="info-item">
        <div class="info-label">Loại</div>
        <div class="info-value" id="infoType">-</div>
      </div>
      <div class="info-item">
        <div class="info-label">Ngày tạo</div>
        <div class="info-value" id="infoDate">-</div>
      </div>
    </div>

    <!-- KEYBOARD HINTS -->
    <div class="keyboard-hints">
      <div><span class="key">ESC</span> Đóng</div>
      <div><span class="key">+</span> Zoom in</div>
      <div><span class="key">-</span> Zoom out</div>
      <div><span class="key">0</span> Đặt lại</div>
      <div><span class="key">←</span> Trước</div>
      <div><span class="key">→</span> Sau</div>
      <div><span class="key">D</span> Tải xuống</div>
      <div><span class="key">S</span> Chia sẻ</div>
    </div>
  </div>
`;

// Inject HTML
document.body.insertAdjacentHTML('beforeend', imagePreviewHTML);

// ─── STATE ─────────────────────────────────────────────────────────

let currentImageIndex = 0;
let imagesList = [];
let zoomScale = 1;
let isPanning = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

// ─── MAIN FUNCTIONS ────────────────────────────────────────────────

/**
 * Mở popup xem ảnh
 * @param {Object} imageData - {url, name, size, type, date, width, height}
 * @param {Array} allImages - Danh sách tất cả ảnh để navigation
 */
function openImagePreview(imageData, allImages = []) {
  const overlay = document.getElementById('imagePreviewOverlay');
  const image = document.getElementById('previewImage');
  const loading = document.getElementById('previewLoading');

  // Reset state
  zoomScale = 1;
  translateX = 0;
  translateY = 0;
  isPanning = false;

  // Store images list for navigation
  imagesList = allImages.length > 0 ? allImages : [imageData];
  currentImageIndex = imagesList.findIndex((img) => img.url === imageData.url);
  if (currentImageIndex === -1) currentImageIndex = 0;

  // Show overlay
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';

  // Show loading
  loading.style.display = 'flex';
  image.style.opacity = '0';

  // Load image
  image.onload = function () {
    loading.style.display = 'none';
    image.style.opacity = '1';

    // Update info with actual dimensions
    updateImageInfo({
      ...imageData,
      width: this.naturalWidth,
      height: this.naturalHeight,
    });
  };

  image.src = imageData.url;

  // Update initial info (without dimensions)
  updateImageInfo(imageData);
  updateZoomDisplay();
}

/**
 * Đóng popup
 */
function closeImagePreview() {
  const overlay = document.getElementById('imagePreviewOverlay');
  overlay.classList.remove('show');
  document.body.style.overflow = '';

  // Reset
  setTimeout(() => {
    document.getElementById('previewImage').src = '';
    zoomScale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }, 300);
}

/**
 * Update thông tin ảnh
 */
function updateImageInfo(data) {
  // Header
  document.getElementById('previewFilename').textContent =
    data.name || 'image.jpg';
  document.getElementById('previewDimensions').textContent =
    data.width && data.height ? `${data.width}×${data.height}` : 'Loading...';
  document.getElementById('previewSize').textContent = formatFileSize(
    data.size || 0
  );
  document.getElementById('previewDate').textContent = data.date || '-';

  // Bottom panel
  document.getElementById('infoFilename').textContent = data.name || '-';
  document.getElementById('infoDimensions').textContent =
    data.width && data.height ? `${data.width} × ${data.height} px` : '-';
  document.getElementById('infoSize').textContent = formatFileSize(
    data.size || 0
  );
  document.getElementById('infoType').textContent = data.type || 'image/jpeg';
  document.getElementById('infoDate').textContent = data.date || '-';
}

// ─── ZOOM FUNCTIONS ────────────────────────────────────────────────

function zoomIn() {
  zoomScale = Math.min(zoomScale + 0.25, 5); // Max 500%
  updateTransform();
  updateZoomDisplay();
}

function zoomOut() {
  zoomScale = Math.max(zoomScale - 0.25, 0.25); // Min 25%
  updateTransform();
  updateZoomDisplay();
}

function resetZoom() {
  zoomScale = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
  updateZoomDisplay();
}

function updateZoomDisplay() {
  document.getElementById('zoomLevel').textContent =
    Math.round(zoomScale * 100) + '%';
}

function updateTransform() {
  const wrapper = document.getElementById('imageWrapper');
  wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
}

// ─── PAN (DRAG) FUNCTIONS ──────────────────────────────────────────

const container = document.getElementById('imageContainer');
const wrapper = document.getElementById('imageWrapper');

container.addEventListener('mousedown', function (e) {
  if (zoomScale <= 1) return; // Only pan when zoomed in

  isPanning = true;
  container.classList.add('grabbing');
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

document.addEventListener('mousemove', function (e) {
  if (!isPanning) return;

  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateTransform();
});

document.addEventListener('mouseup', function () {
  isPanning = false;
  container.classList.remove('grabbing');
});

// Mouse wheel zoom
container.addEventListener(
  'wheel',
  function (e) {
    e.preventDefault();

    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  },
  { passive: false }
);

// ─── NAVIGATION ────────────────────────────────────────────────────

function prevImage() {
  if (imagesList.length <= 1) return;

  currentImageIndex =
    (currentImageIndex - 1 + imagesList.length) % imagesList.length;
  loadImageAtIndex(currentImageIndex);
}

function nextImage() {
  if (imagesList.length <= 1) return;

  currentImageIndex = (currentImageIndex + 1) % imagesList.length;
  loadImageAtIndex(currentImageIndex);
}

function loadImageAtIndex(index) {
  const imageData = imagesList[index];
  const image = document.getElementById('previewImage');
  const loading = document.getElementById('previewLoading');

  // Reset zoom
  zoomScale = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
  updateZoomDisplay();

  // Show loading
  loading.style.display = 'flex';
  image.style.opacity = '0';

  // Load new image
  image.onload = function () {
    loading.style.display = 'none';
    image.style.opacity = '1';
    updateImageInfo({
      ...imageData,
      width: this.naturalWidth,
      height: this.naturalHeight,
    });
  };

  image.src = imageData.url;
  updateImageInfo(imageData);
}

// ─── ACTIONS ───────────────────────────────────────────────────────

function downloadPreviewImage() {
  const image = document.getElementById('previewImage');
  const link = document.createElement('a');
  link.href = image.src;
  link.download = imagesList[currentImageIndex].name || 'image.jpg';
  link.click();

  if (typeof toast === 'function') {
    toast('📥 Đang tải xuống...');
  }
}

function sharePreviewImage() {
  if (typeof openShareModal === 'function') {
    const imageData = imagesList[currentImageIndex];
    openShareModal({
      id: imageData.id || 'preview',
      name: imageData.name,
      type: imageData.type,
      url: imageData.url,
    });
  } else {
    if (typeof toast === 'function') {
      toast('🔗 Đã copy link');
    }
  }
}

// ─── KEYBOARD SHORTCUTS ────────────────────────────────────────────

document.addEventListener('keydown', function (e) {
  const overlay = document.getElementById('imagePreviewOverlay');
  if (!overlay.classList.contains('show')) return;

  switch (e.key) {
    case 'Escape':
      closeImagePreview();
      break;
    case '+':
    case '=':
      zoomIn();
      break;
    case '-':
    case '_':
      zoomOut();
      break;
    case '0':
      resetZoom();
      break;
    case 'ArrowLeft':
      prevImage();
      break;
    case 'ArrowRight':
      nextImage();
      break;
    case 'd':
    case 'D':
      downloadPreviewImage();
      break;
    case 's':
    case 'S':
      sharePreviewImage();
      break;
  }
});

// ─── CLICK OUTSIDE TO CLOSE ────────────────────────────────────────

document
  .getElementById('imagePreviewOverlay')
  .addEventListener('click', function (e) {
    if (e.target === this) {
      closeImagePreview();
    }
  });

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────

function formatFileSize(bytes) {
  if (typeof bytes === 'string' && /[a-zA-Z]/.test(bytes)) {
    return bytes;
  }
  if (!bytes || bytes === 0 || bytes === '—') return '0 B';

  const numBytes = Number(bytes);
  if (isNaN(numBytes)) return bytes;

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('[Image Preview Popup] Loaded successfully');
