// ═══════════════════════════════════════════════════════════════════
// CONTEXT MENU - CHUỘT PHẢI
// Menu hiện toàn bộ thông tin user + cài đặt nhanh
// File độc lập, không sửa HTML gốc
// ═══════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ─── INJECT CSS ────────────────────────────────────────────────
  const contextMenuCSS = `
    /* Context Menu Container */
    .context-menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      pointer-events: none;
    }

    .context-menu {
      position: fixed;
      background: var(--surface, #ffffff);
      border: 1px solid var(--border, #e0e0de);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
      width: 320px;
      max-height: 90vh;
      overflow-y: auto;
      opacity: 0;
      transform: scale(0.92) translateY(-8px);
      pointer-events: none;
      transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .context-menu.show {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: all;
    }

    .context-menu::-webkit-scrollbar {
      width: 4px;
    }

    .context-menu::-webkit-scrollbar-thumb {
      background: var(--border-dark, #c0c0be);
      border-radius: 99px;
    }

    /* User Info Section */
    .context-menu-user {
      padding: 20px;
      background: var(--bg, #f5f5f3);
      border-bottom: 1px solid var(--border, #e0e0de);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }

    .context-menu-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--ink, #0a0a0a);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 800;
      border: 3px solid var(--border-dark, #c0c0be);
      overflow: hidden;
      position: relative;
    }

    .context-menu-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .context-menu-avatar::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: #2ecc71;
      border: 2px solid var(--surface, #fff);
      border-radius: 50%;
    }

    .context-menu-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--ink, #0a0a0a);
      line-height: 1.2;
    }

    .context-menu-email {
      font-size: 12px;
      color: var(--ink-4, #999);
      font-family: 'DM Mono', monospace;
    }

    .context-menu-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      background: var(--ink, #0a0a0a);
      color: #fff;
      border-radius: 99px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .context-menu-badge svg {
      width: 10px;
      height: 10px;
    }

    /* Stats Section */
    .context-menu-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      padding: 16px;
      background: var(--bg, #f5f5f3);
      border-bottom: 1px solid var(--border, #e0e0de);
    }

    .context-menu-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .context-menu-stat-value {
      font-size: 20px;
      font-weight: 800;
      color: var(--ink, #0a0a0a);
      font-family: 'DM Mono', monospace;
      line-height: 1;
    }

    .context-menu-stat-label {
      font-size: 10px;
      color: var(--ink-4, #999);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    /* Menu Section */
    .context-menu-section {
      padding: 8px;
    }

    .context-menu-divider {
      height: 1px;
      background: var(--border, #e0e0de);
      margin: 4px 0;
    }

    .context-menu-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-4, #999);
      padding: 8px 12px 4px;
    }

    /* Menu Item */
    .context-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      color: var(--ink-2, #333);
      cursor: pointer;
      transition: all 0.15s;
      user-select: none;
      position: relative;
    }

    .context-menu-item:hover {
      background: var(--bg, #f5f5f3);
      color: var(--ink, #0a0a0a);
    }

    .context-menu-item:active {
      transform: scale(0.98);
    }

    .context-menu-item.danger {
      color: #c03030;
    }

    .context-menu-item.danger:hover {
      background: #fff2f2;
      color: #b02020;
    }

    .context-menu-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--bg, #f5f5f3);
      border: 1px solid var(--border, #e0e0de);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s;
    }

    .context-menu-item:hover .context-menu-icon {
      background: var(--surface, #fff);
      border-color: var(--ink-3, #666);
    }

    .context-menu-item.danger .context-menu-icon {
      background: #fff2f2;
      border-color: #fdd;
      color: #c03030;
    }

    .context-menu-item.danger:hover .context-menu-icon {
      background: #ffe6e6;
      border-color: #ffcccc;
    }

    .context-menu-icon svg {
      width: 16px;
      height: 16px;
      color: var(--ink-3, #666);
    }

    .context-menu-item:hover .context-menu-icon svg {
      color: var(--ink, #0a0a0a);
    }

    .context-menu-item.danger .context-menu-icon svg {
      color: #c03030;
    }

    .context-menu-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .context-menu-title {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.2;
    }

    .context-menu-subtitle {
      font-size: 11px;
      color: var(--ink-4, #999);
      line-height: 1.3;
    }

    .context-menu-shortcut {
      font-size: 11px;
      font-family: 'DM Mono', monospace;
      color: var(--ink-4, #999);
      padding: 2px 6px;
      background: var(--bg, #f5f5f3);
      border: 1px solid var(--border, #e0e0de);
      border-radius: 4px;
      flex-shrink: 0;
    }

    .context-menu-item:hover .context-menu-shortcut {
      background: var(--surface, #fff);
      border-color: var(--ink-3, #666);
    }

    /* Toggle */
    .context-menu-toggle {
      width: 36px;
      height: 20px;
      border-radius: 99px;
      background: var(--border-dark, #c0c0be);
      position: relative;
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .context-menu-toggle.on {
      background: var(--ink, #0a0a0a);
    }

    .context-menu-toggle::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .context-menu-toggle.on::after {
      transform: translateX(16px);
    }

    /* Storage Bar */
    .context-menu-storage {
      padding: 12px 16px;
      background: var(--bg, #f5f5f3);
    }

    .context-menu-storage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .context-menu-storage-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--ink-3, #666);
    }

    .context-menu-storage-value {
      font-size: 11px;
      font-weight: 700;
      color: var(--ink, #0a0a0a);
      font-family: 'DM Mono', monospace;
    }

    .context-menu-storage-bar {
      height: 6px;
      background: var(--border, #e0e0de);
      border-radius: 99px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .context-menu-storage-fill {
      height: 100%;
      background: var(--ink, #0a0a0a);
      border-radius: 99px;
      transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .context-menu-storage-text {
      font-size: 11px;
      color: var(--ink-4, #999);
    }

    .context-menu-storage-text strong {
      color: var(--ink, #0a0a0a);
      font-weight: 700;
    }
  `;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = contextMenuCSS;
  document.head.appendChild(styleEl);

  // ─── CREATE CONTEXT MENU HTML ──────────────────────────────────
  const contextMenuHTML = `
    <div class="context-menu-overlay" id="contextMenuOverlay">
      <div class="context-menu" id="contextMenu">
        <!-- User Info -->
        <div class="context-menu-user">
          <div class="context-menu-avatar" id="ctxAvatar">T</div>
          <div class="context-menu-name" id="ctxName">Trần Minh Tuấn</div>
          <div class="context-menu-email" id="ctxEmail">tuan@example.com</div>
          <div class="context-menu-badge" id="ctxBadge">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            PRO
          </div>
        </div>

        <!-- Stats -->
        <div class="context-menu-stats">
          <div class="context-menu-stat">
            <div class="context-menu-stat-value" id="ctxStatFiles">47</div>
            <div class="context-menu-stat-label">Files</div>
          </div>
          <div class="context-menu-stat">
            <div class="context-menu-stat-value" id="ctxStatStorage">34</div>
            <div class="context-menu-stat-label">GB</div>
          </div>
          <div class="context-menu-stat">
            <div class="context-menu-stat-value" id="ctxStatFavorites">12</div>
            <div class="context-menu-stat-label">Favorites</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="context-menu-section">
          <div class="context-menu-label">Hành động nhanh</div>

          <div class="context-menu-item" onclick="ctxUploadFile()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Upload file</div>
              <div class="context-menu-subtitle">Tải file lên cloud</div>
            </div>
            <div class="context-menu-shortcut">⌘U</div>
          </div>

          <div class="context-menu-item" onclick="ctxNewFolder()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Tạo folder</div>
              <div class="context-menu-subtitle">Thư mục mới</div>
            </div>
            <div class="context-menu-shortcut">⌘N</div>
          </div>

          <div class="context-menu-item" onclick="ctxSearch()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Tìm kiếm</div>
              <div class="context-menu-subtitle">Tìm file nhanh</div>
            </div>
            <div class="context-menu-shortcut">⌘K</div>
          </div>
        </div>

        <div class="context-menu-divider"></div>

        <!-- Settings -->
        <div class="context-menu-section">
          <div class="context-menu-label">Cài đặt</div>

          <div class="context-menu-item" onclick="ctxSettings()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Cài đặt</div>
              <div class="context-menu-subtitle">Tùy chỉnh tài khoản</div>
            </div>
            <div class="context-menu-shortcut">,</div>
          </div>

          <div class="context-menu-item" onclick="ctxToggleDark()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Chế độ tối</div>
            </div>
            <div class="context-menu-toggle" id="ctxDarkToggle"></div>
          </div>

          <div class="context-menu-item" onclick="ctxToggleNotif()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Thông báo</div>
            </div>
            <div class="context-menu-toggle on" id="ctxNotifToggle"></div>
          </div>
        </div>

        <div class="context-menu-divider"></div>

        <!-- Storage -->
        <div class="context-menu-storage">
          <div class="context-menu-storage-header">
            <span class="context-menu-storage-label">Dung lượng</span>
            <span class="context-menu-storage-value">68%</span>
          </div>
          <div class="context-menu-storage-bar">
            <div class="context-menu-storage-fill" id="ctxStorageFill" style="width: 68%"></div>
          </div>
          <div class="context-menu-storage-text">
            <strong>34.2 GB</strong> / 50 GB
          </div>
        </div>

        <div class="context-menu-divider"></div>

        <!-- Account Actions -->
        <div class="context-menu-section">
          <div class="context-menu-item" onclick="ctxProfile()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Hồ sơ cá nhân</div>
            </div>
          </div>

          <div class="context-menu-item" onclick="ctxUpgradePlan()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Nâng cấp Pro</div>
              <div class="context-menu-subtitle">Thêm dung lượng & tính năng</div>
            </div>
          </div>

          <div class="context-menu-item" onclick="ctxHelp()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Trợ giúp</div>
            </div>
            <div class="context-menu-shortcut">?</div>
          </div>

          <div class="context-menu-item danger" onclick="ctxLogout()">
            <div class="context-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <div class="context-menu-text">
              <div class="context-menu-title">Đăng xuất</div>
            </div>
            <div class="context-menu-shortcut">⌘Q</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inject HTML
  const container = document.createElement('div');
  container.innerHTML = contextMenuHTML;
  document.body.appendChild(container.firstElementChild);

  // ─── VARIABLES ─────────────────────────────────────────────────
  const contextMenu = document.getElementById('contextMenu');
  const contextMenuOverlay = document.getElementById('contextMenuOverlay');
  let isContextMenuOpen = false;

  // ─── SHOW CONTEXT MENU ─────────────────────────────────────────
  function showContextMenu(x, y) {
    const menu = document.getElementById('contextMenu');
    const overlay = document.getElementById('contextMenuOverlay');

    // Load user data
    loadContextMenuData();

    // Calculate position
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust position to keep menu in viewport
    let posX = x;
    let posY = y;

    if (x + menuRect.width > viewportWidth) {
      posX = viewportWidth - menuRect.width - 16;
    }

    if (y + menuRect.height > viewportHeight) {
      posY = viewportHeight - menuRect.height - 16;
    }

    // Apply position
    menu.style.left = posX + 'px';
    menu.style.top = posY + 'px';

    // Show menu
    overlay.style.pointerEvents = 'all';
    setTimeout(() => {
      menu.classList.add('show');
    }, 10);

    isContextMenuOpen = true;
  }

  // ─── HIDE CONTEXT MENU ─────────────────────────────────────────
  function hideContextMenu() {
    const menu = document.getElementById('contextMenu');
    const overlay = document.getElementById('contextMenuOverlay');

    menu.classList.remove('show');
    setTimeout(() => {
      overlay.style.pointerEvents = 'none';
    }, 200);

    isContextMenuOpen = false;
  }

  // ─── LOAD USER DATA ────────────────────────────────────────────
  function loadContextMenuData() {
    // Avatar
    const savedAvatar = localStorage.getItem('user_avatar');
    const ctxAvatar = document.getElementById('ctxAvatar');
    if (savedAvatar) {
      ctxAvatar.innerHTML = `<img src="${savedAvatar}" alt="Avatar">`;
    } else {
      const name = localStorage.getItem('user_name') || 'T';
      ctxAvatar.textContent = name.charAt(0).toUpperCase();
    }

    // Name
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      document.getElementById('ctxName').textContent = savedName;
    }

    // Email (from URL params or localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const email =
      urlParams.get('useraccount') ||
      localStorage.getItem('user_email') ||
      'user@example.com';
    document.getElementById('ctxEmail').textContent = email;

    // Badge/Plan
    const plan = localStorage.getItem('user_plan') || 'PRO';
    document.getElementById('ctxBadge').innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      ${plan}
    `;

    // Stats (from global variables if available)
    if (typeof sampleFiles !== 'undefined') {
      const totalFiles = sampleFiles.filter((f) => !f.deleted).length;
      document.getElementById('ctxStatFiles').textContent = totalFiles;

      // Count favorites
      const favorites = sampleFiles.filter((f) => f.favorite).length;
      document.getElementById('ctxStatFavorites').textContent = favorites;
    }

    // Dark mode toggle
    const darkMode = localStorage.getItem('dark_mode') === 'true';
    const darkToggle = document.getElementById('ctxDarkToggle');
    if (darkMode && darkToggle) {
      darkToggle.classList.add('on');
    }

    // Notification toggle
    const notifEnabled =
      localStorage.getItem('notifications_enabled') !== 'false';
    const notifToggle = document.getElementById('ctxNotifToggle');
    if (notifToggle) {
      if (notifEnabled) {
        notifToggle.classList.add('on');
      } else {
        notifToggle.classList.remove('on');
      }
    }
  }

  // ─── EVENT LISTENERS ───────────────────────────────────────────

  // Right-click listener
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  });

  // Click outside to close
  contextMenuOverlay.addEventListener('click', function (e) {
    if (e.target === this || e.target === contextMenu) {
      hideContextMenu();
    }
  });

  // ESC to close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isContextMenuOpen) {
      hideContextMenu();
    }
  });

  // Close when clicking menu items
  contextMenu.addEventListener('click', function (e) {
    if (
      e.target.closest('.context-menu-item') &&
      !e.target.closest('.context-menu-toggle')
    ) {
      hideContextMenu();
    }
  });

  // ─── MENU ACTIONS ──────────────────────────────────────────────

  // Upload file
  window.ctxUploadFile = function () {
    if (typeof openModal === 'function') {
      openModal();
    } else {
      toast('Mở modal upload');
    }
  };

  // New folder
  window.ctxNewFolder = function () {
    const folderName = prompt('Tên folder:');
    if (folderName) {
      toast(`✓ Đã tạo folder "${folderName}"`);
    }
  };

  // Search
  window.ctxSearch = function () {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  };

  // Settings
  window.ctxSettings = function () {
    if (typeof openSettings === 'function') {
      openSettings();
    } else {
      toast('Mở cài đặt');
    }
  };

  // Toggle dark mode
  window.ctxToggleDark = function () {
    event.stopPropagation();
    const toggle = document.getElementById('ctxDarkToggle');
    toggle.classList.toggle('on');
    const isOn = toggle.classList.contains('on');

    localStorage.setItem('dark_mode', isOn);

    if (typeof toggleDark === 'function') {
      toggleDark();
    }

    if (typeof toast === 'function') {
      toast(isOn ? '🌙 Đã bật chế độ tối' : '☀️ Đã tắt chế độ tối');
    }
  };

  // Toggle notifications
  window.ctxToggleNotif = function () {
    event.stopPropagation();
    const toggle = document.getElementById('ctxNotifToggle');
    toggle.classList.toggle('on');
    const isOn = toggle.classList.contains('on');

    localStorage.setItem('notifications_enabled', isOn);

    if (typeof toggleNotif === 'function') {
      toggleNotif();
    }

    if (typeof toast === 'function') {
      toast(isOn ? '🔔 Đã bật thông báo' : '🔕 Đã tắt thông báo');
    }
  };

  // Profile
  window.ctxProfile = function () {
    if (typeof openSettings === 'function') {
      openSettings();
      // Switch to profile tab if function exists
      if (typeof switchSettingsTab === 'function') {
        setTimeout(() => switchSettingsTab('profile'), 100);
      }
    } else {
      toast('Mở hồ sơ cá nhân');
    }
  };

  // Upgrade plan
  window.ctxUpgradePlan = function () {
    window.open('pricing.html', '_blank');
  };

  // Help
  window.ctxHelp = function () {
    toast('Mở trung tâm trợ giúp');
  };

  // Logout
  window.ctxLogout = function () {
    if (confirm('Đăng xuất khỏi tài khoản?')) {
      // Clear user data
      localStorage.removeItem('user_avatar');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');

      // Redirect to login (hoặc reload)
      if (typeof toast === 'function') {
        toast('👋 Đã đăng xuất');
      }

      setTimeout(() => {
        window.location.href = '/login.html'; // Hoặc đường dẫn login của bạn
      }, 1000);
    }
  };

  // ─── KEYBOARD SHORTCUTS ────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    // CMD/CTRL + U - Upload
    if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault();
      ctxUploadFile();
    }

    // CMD/CTRL + N - New folder
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      ctxNewFolder();
    }

    // CMD/CTRL + K - Search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      ctxSearch();
    }

    // , - Settings
    if (e.key === ',' && !e.metaKey && !e.ctrlKey) {
      const activeElement = document.activeElement;
      // Chỉ trigger nếu không đang focus vào input
      if (
        activeElement.tagName !== 'INPUT' &&
        activeElement.tagName !== 'TEXTAREA'
      ) {
        ctxSettings();
      }
    }

    // ? - Help
    if (e.key === '?' && e.shiftKey) {
      e.preventDefault();
      ctxHelp();
    }

    // CMD/CTRL + Q - Logout
    if ((e.metaKey || e.ctrlKey) && e.key === 'q') {
      e.preventDefault();
      ctxLogout();
    }
  });

  console.log('[Context Menu] Loaded - Right-click anywhere to open');
})();
