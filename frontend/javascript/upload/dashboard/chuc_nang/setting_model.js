// ═══════════════════════════════════════════════════════════════════
// SETTINGS MODAL - KHÔNG SỬA HTML GỐC
// Inject hoàn toàn bằng JavaScript
// ═══════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ─── INJECT CSS ────────────────────────────────────────────────
  const settingsCSS = `
    /* Settings Modal Overlay */
    .settings-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .settings-overlay.open {
      opacity: 1;
      pointer-events: all;
    }

    /* Settings Modal */
    .settings-modal {
      background: var(--surface, #ffffff);
      border-radius: 24px;
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
      display: flex;
      overflow: hidden;
      transform: scale(0.9) translateY(20px);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .settings-overlay.open .settings-modal {
      transform: scale(1) translateY(0);
    }

    /* Settings Sidebar */
    .settings-sidebar {
      width: 240px;
      background: var(--bg, #f5f5f3);
      border-right: 1px solid var(--border, #e0e0de);
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .settings-sidebar-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-4, #999);
      padding: 0 12px;
      margin-bottom: 8px;
    }

    .settings-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 12px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: var(--ink-2, #333);
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }

    .settings-nav-item:hover {
      background: var(--surface, #fff);
      color: var(--ink, #0a0a0a);
    }

    .settings-nav-item.active {
      background: var(--ink, #0a0a0a);
      color: #fff;
    }

    .settings-nav-item svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    /* Settings Content */
    .settings-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }

    .settings-content::-webkit-scrollbar {
      width: 6px;
    }

    .settings-content::-webkit-scrollbar-thumb {
      background: var(--border-dark, #c0c0be);
      border-radius: 99px;
    }

    .settings-section {
      display: none;
    }

    .settings-section.active {
      display: block;
    }

    .settings-header {
      margin-bottom: 32px;
    }

    .settings-title {
      font-size: 28px;
      font-weight: 800;
      color: var(--ink, #0a0a0a);
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .settings-subtitle {
      font-size: 14px;
      color: var(--ink-3, #666);
      line-height: 1.6;
    }

    /* Settings Group */
    .settings-group {
      margin-bottom: 32px;
    }

    .settings-group-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--ink-4, #999);
      margin-bottom: 16px;
    }

    .settings-item {
      background: var(--bg, #f5f5f3);
      border: 1px solid var(--border, #e0e0de);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 12px;
      transition: all 0.2s;
    }

    .settings-item:hover {
      border-color: var(--ink-3, #666);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .settings-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .settings-item-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--ink, #0a0a0a);
    }

    .settings-item-desc {
      font-size: 13px;
      color: var(--ink-3, #666);
      line-height: 1.5;
    }

    /* Avatar Upload */
    .avatar-upload-container {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-top: 16px;
    }

    .avatar-preview {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--ink, #0a0a0a);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 800;
      border: 3px solid var(--border-dark, #c0c0be);
      overflow: hidden;
      flex-shrink: 0;
    }

    .avatar-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-upload-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .avatar-upload-btn {
      padding: 8px 16px;
      background: var(--ink, #0a0a0a);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .avatar-upload-btn:hover {
      background: #333;
      transform: translateY(-1px);
    }

    .avatar-upload-btn.secondary {
      background: transparent;
      color: var(--ink-2, #333);
      border: 1px solid var(--border, #e0e0de);
    }

    .avatar-upload-btn.secondary:hover {
      background: var(--bg, #f5f5f3);
      border-color: var(--ink-3, #666);
    }

    /* Input Field */
    .settings-input {
      width: 100%;
      padding: 12px 16px;
      background: var(--surface, #fff);
      border: 1px solid var(--border, #e0e0de);
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      color: var(--ink, #0a0a0a);
      transition: all 0.2s;
      margin-top: 12px;
    }

    .settings-input:focus {
      outline: none;
      border-color: var(--ink, #0a0a0a);
      box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.08);
    }

    /* Toggle Switch */
    .settings-toggle {
      width: 48px;
      height: 26px;
      border-radius: 99px;
      background: var(--border-dark, #c0c0be);
      cursor: pointer;
      position: relative;
      transition: background 0.2s;
    }

    .settings-toggle.on {
      background: var(--ink, #0a0a0a);
    }

    .settings-toggle::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .settings-toggle.on::after {
      transform: translateX(22px);
    }

    /* Select Dropdown */
    .settings-select {
      width: 100%;
      padding: 12px 16px;
      background: var(--surface, #fff);
      border: 1px solid var(--border, #e0e0de);
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      color: var(--ink, #0a0a0a);
      cursor: pointer;
      margin-top: 12px;
    }

    /* Button */
    .settings-btn {
      padding: 10px 20px;
      background: var(--ink, #0a0a0a);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 16px;
    }

    .settings-btn:hover {
      background: #333;
      transform: translateY(-1px);
    }

    .settings-btn.danger {
      background: #c03030;
    }

    .settings-btn.danger:hover {
      background: #a02020;
    }

    /* Close Button */
    .settings-close {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg, #f5f5f3);
      border: 1px solid var(--border, #e0e0de);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 10;
    }

    .settings-close:hover {
      background: var(--surface, #fff);
      border-color: var(--ink-3, #666);
      transform: rotate(90deg);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .settings-modal {
        flex-direction: column;
        max-height: 95vh;
      }

      .settings-sidebar {
        width: 100%;
        flex-direction: row;
        overflow-x: auto;
        padding: 16px;
        border-right: none;
        border-bottom: 1px solid var(--border, #e0e0de);
      }

      .settings-sidebar-title {
        display: none;
      }

      .settings-nav-item {
        white-space: nowrap;
      }

      .settings-content {
        padding: 24px 16px;
      }
    }
  `;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = settingsCSS;
  document.head.appendChild(styleEl);

  // ─── CREATE SETTINGS MODAL HTML ────────────────────────────────
  const settingsHTML = `
    <div class="settings-overlay" id="settingsOverlay">
      <div class="settings-modal">
        <button class="settings-close" onclick="closeSettings()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Sidebar -->
        <div class="settings-sidebar">
          <div class="settings-sidebar-title">Cài đặt</div>
          
          <div class="settings-nav-item active" onclick="switchSettingsTab('profile')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Hồ sơ</span>
          </div>

          <div class="settings-nav-item" onclick="switchSettingsTab('appearance')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span>Giao diện</span>
          </div>

          <div class="settings-nav-item" onclick="switchSettingsTab('notifications')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span>Thông báo</span>
          </div>

          <div class="settings-nav-item" onclick="switchSettingsTab('security')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Bảo mật</span>
          </div>

          <div class="settings-nav-item" onclick="switchSettingsTab('storage')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
            <span>Lưu trữ</span>
          </div>

          <div class="settings-nav-item" onclick="switchSettingsTab('advanced')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Nâng cao</span>
          </div>
        </div>

        <!-- Content -->
        <div class="settings-content">
          <!-- Profile Section -->
          <div class="settings-section active" id="settings-profile">
            <div class="settings-header">
              <h2 class="settings-title">Hồ sơ cá nhân</h2>
              <p class="settings-subtitle">Quản lý thông tin tài khoản và avatar của bạn</p>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Avatar</div>
              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Ảnh đại diện</div>
                </div>
                <div class="settings-item-desc">Tải lên ảnh đại diện của bạn (PNG, JPG, tối đa 5MB)</div>
                
                <div class="avatar-upload-container">
                  <div class="avatar-preview" id="avatarPreview">T</div>
                  <div class="avatar-upload-actions">
                    <input type="file" id="avatarInput" accept="image/*" style="display:none" onchange="handleAvatarUpload(event)">
                    <button class="avatar-upload-btn" onclick="document.getElementById('avatarInput').click()">
                      Tải ảnh lên
                    </button>
                    <button class="avatar-upload-btn secondary" onclick="removeAvatar()">
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Thông tin cá nhân</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Tên hiển thị</div>
                </div>
                <div class="settings-item-desc">Tên này sẽ hiển thị trong dashboard</div>
                <input type="text" class="settings-input" id="displayNameInput" placeholder="Trần Minh Tuấn" value="Trần Minh Tuấn">
                <button class="settings-btn" onclick="saveDisplayName()">Lưu thay đổi</button>
              </div>

              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Email</div>
                </div>
                <div class="settings-item-desc">Email đăng nhập và nhận thông báo</div>
                <input type="email" class="settings-input" id="emailInput" placeholder="tuan@example.com" value="tuan@example.com" readonly>
                <p style="font-size:12px;color:var(--ink-4);margin-top:8px;">Không thể thay đổi email</p>
              </div>

              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Bio</div>
                </div>
                <div class="settings-item-desc">Giới thiệu ngắn về bạn</div>
                <textarea class="settings-input" id="bioInput" rows="3" placeholder="Nhập giới thiệu..."></textarea>
                <button class="settings-btn" onclick="saveBio()">Lưu bio</button>
              </div>
            </div>
          </div>

          <!-- Appearance Section -->
          <div class="settings-section" id="settings-appearance">
            <div class="settings-header">
              <h2 class="settings-title">Giao diện</h2>
              <p class="settings-subtitle">Tùy chỉnh giao diện dashboard</p>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Theme</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div>
                    <div class="settings-item-title">Chế độ tối</div>
                    <div class="settings-item-desc">Sử dụng giao diện tối cho mắt</div>
                  </div>
                  <div class="settings-toggle" id="darkModeToggle" onclick="toggleDarkModeSetting(this)"></div>
                </div>
              </div>

              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Ngôn ngữ</div>
                </div>
                <div class="settings-item-desc">Chọn ngôn ngữ hiển thị</div>
                <select class="settings-select" id="languageSelect" onchange="changeLanguage(this.value)">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>

              <div class="settings-item">
                <div class="settings-item-header">
                  <div>
                    <div class="settings-item-title">Hiệu ứng animation</div>
                    <div class="settings-item-desc">Bật/tắt hiệu ứng chuyển động</div>
                  </div>
                  <div class="settings-toggle on" id="animationToggle" onclick="toggleAnimation(this)"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications Section -->
          <div class="settings-section" id="settings-notifications">
            <div class="settings-header">
              <h2 class="settings-title">Thông báo</h2>
              <p class="settings-subtitle">Quản lý cách bạn nhận thông báo</p>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Email notifications</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div>
                    <div class="settings-item-title">Thông báo file mới</div>
                    <div class="settings-item-desc">Nhận email khi có file mới được upload</div>
                  </div>
                  <div class="settings-toggle on" id="emailNewFileToggle" onclick="toggleSetting(this)"></div>
                </div>
              </div>

              <div class="settings-item">
                <div class="settings-item-header">
                  <div>
                    <div class="settings-item-title">Thông báo chia sẻ</div>
                    <div class="settings-item-desc">Nhận email khi có người chia sẻ file cho bạn</div>
                  </div>
                  <div class="settings-toggle on" id="emailShareToggle" onclick="toggleSetting(this)"></div>
                </div>
              </div>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Push notifications</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div>
                    <div class="settings-item-title">Thông báo trình duyệt</div>
                    <div class="settings-item-desc">Nhận thông báo desktop</div>
                  </div>
                  <div class="settings-toggle" id="pushToggle" onclick="togglePushNotification(this)"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Section -->
          <div class="settings-section" id="settings-security">
            <div class="settings-header">
              <h2 class="settings-title">Bảo mật</h2>
              <p class="settings-subtitle">Bảo vệ tài khoản của bạn</p>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Mật khẩu</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Đổi mật khẩu</div>
                </div>
                <div class="settings-item-desc">Thay đổi mật khẩu đăng nhập</div>
                <input type="password" class="settings-input" placeholder="Mật khẩu hiện tại" id="currentPassword">
                <input type="password" class="settings-input" placeholder="Mật khẩu mới" id="newPassword">
                <input type="password" class="settings-input" placeholder="Xác nhận mật khẩu mới" id="confirmPassword">
                <button class="settings-btn" onclick="changePassword()">Đổi mật khẩu</button>
              </div>

              <div class="settings-item">
                <div class="settings-item-header">
                  <div>
                    <div class="settings-item-title">Xác thực 2 bước (2FA)</div>
                    <div class="settings-item-desc">Thêm lớp bảo mật với Google Authenticator</div>
                  </div>
                  <div class="settings-toggle" id="twoFactorToggle" onclick="toggle2FA(this)"></div>
                </div>
              </div>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Phiên đăng nhập</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Đăng xuất tất cả thiết bị</div>
                </div>
                <div class="settings-item-desc">Đăng xuất khỏi tất cả thiết bị khác ngoại trừ thiết bị này</div>
                <button class="settings-btn danger" onclick="logoutAllDevices()">Đăng xuất tất cả</button>
              </div>
            </div>
          </div>

          <!-- Storage Section -->
          <div class="settings-section" id="settings-storage">
            <div class="settings-header">
              <h2 class="settings-title">Lưu trữ</h2>
              <p class="settings-subtitle">Quản lý dung lượng lưu trữ</p>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Dung lượng</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Sử dụng lưu trữ</div>
                </div>
                <div style="margin-top:16px">
                  <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                    <span style="font-size:13px;color:var(--ink-2)">34.2 GB / 50 GB</span>
                    <span style="font-size:13px;font-weight:700;color:var(--ink)">68%</span>
                  </div>
                  <div style="height:8px;background:var(--border);border-radius:99px;overflow:hidden">
                    <div style="width:68%;height:100%;background:var(--ink);border-radius:99px"></div>
                  </div>
                </div>
                <button class="settings-btn" onclick="window.open('pricing.html', '_blank')" style="margin-top:20px">Nâng cấp gói</button>
              </div>

              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Dọn dẹp thùng rác</div>
                </div>
                <div class="settings-item-desc">Xóa vĩnh viễn tất cả file trong thùng rác</div>
                <button class="settings-btn danger" onclick="emptyTrash()">Dọn thùng rác</button>
              </div>
            </div>
          </div>

          <!-- Advanced Section -->
          <div class="settings-section" id="settings-advanced">
            <div class="settings-header">
              <h2 class="settings-title">Nâng cao</h2>
              <p class="settings-subtitle">Cài đặt dành cho người dùng nâng cao</p>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">Dữ liệu</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Xuất dữ liệu</div>
                </div>
                <div class="settings-item-desc">Tải xuống tất cả dữ liệu của bạn</div>
                <button class="settings-btn" onclick="exportData()">Xuất dữ liệu</button>
              </div>

              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">Xóa tài khoản</div>
                </div>
                <div class="settings-item-desc">Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu</div>
                <button class="settings-btn danger" onclick="deleteAccount()">Xóa tài khoản</button>
              </div>
            </div>

            <div class="settings-group">
              <div class="settings-group-title">API</div>
              
              <div class="settings-item">
                <div class="settings-item-header">
                  <div class="settings-item-title">API Key</div>
                </div>
                <div class="settings-item-desc">Key để truy cập API (chỉ gói Enterprise)</div>
                <input type="text" class="settings-input" value="sk_live_..." readonly>
                <button class="settings-btn" onclick="regenerateAPIKey()">Tạo key mới</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inject HTML vào body
  const container = document.createElement('div');
  container.innerHTML = settingsHTML;
  document.body.appendChild(container.firstElementChild);

  // ─── JAVASCRIPT FUNCTIONS ──────────────────────────────────────

  // Open settings modal
  window.openSettings = function () {
    const overlay = document.getElementById('settingsOverlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Load current settings
    loadCurrentSettings();
  };

  // Close settings modal
  window.closeSettings = function () {
    const overlay = document.getElementById('settingsOverlay');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close on outside click
  document
    .getElementById('settingsOverlay')
    .addEventListener('click', function (e) {
      if (e.target === this) {
        closeSettings();
      }
    });

  // Close on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSettings();
    }
  });

  // Switch tabs
  window.switchSettingsTab = function (tabName) {
    // Update nav items
    document.querySelectorAll('.settings-nav-item').forEach((item) => {
      item.classList.remove('active');
    });
    event.target.closest('.settings-nav-item').classList.add('active');

    // Update sections
    document.querySelectorAll('.settings-section').forEach((section) => {
      section.classList.remove('active');
    });
    document.getElementById('settings-' + tabName).classList.add('active');
  };

  // Load current settings
  function loadCurrentSettings() {
    // Load avatar
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      document.getElementById('avatarPreview').innerHTML =
        `<img src="${savedAvatar}" alt="Avatar">`;
    }

    // Load display name
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      document.getElementById('displayNameInput').value = savedName;
    }

    // Load bio
    async function get_bio_from_server() {
      try {
        const resp = await fetch(
          'https://learnpythonserver-sm.onrender.com/profile/setting/get_bio',
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        const da = await resp.json();
        if (!resp.ok) {
          console.error('[LOG] khong lay duoc bio' + da.mes);
        }
        document.getElementById('bioInput').value = da.mes;
        localStorage.setItem('user_bio', da.mes);
      } catch (error) {
        console.error(error);
      }
    }
    get_bio_from_server();

    // Load dark mode
    const darkMode = localStorage.getItem('dark_mode') === 'true';
    if (darkMode) {
      document.getElementById('darkModeToggle').classList.add('on');
    }
  }

  // Handle avatar upload
  window.handleAvatarUpload = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      if (typeof toast === 'function') {
        toast('Ảnh quá lớn! Tối đa 5MB');
      } else {
        alert('Ảnh quá lớn! Tối đa 5MB');
      }
      return;
    }

    const avatar = localStorage.getItem('user_avatar');

    if (avatar) {
      document.getElementById('avatarPreview').innerHTML =
        `<img src="${avatar}" alt="Avatar">`;
      updateMainAvatar(avatar);
    }

    const formData = new FormData();
    formData.append('avatar', file);

    async function uploadAvatar() {
      try {
        const res = await fetch(
          'https://learnpythonserver-sm.onrender.com/profile/setting/avatar',
          {
            method: 'POST',
            body: formData,
            credentials: 'include',
          }
        );

        const data = await res.json();
        console.log('Dữ liệu server trả về nè og:', data);
        if (res.ok) {
          if (typeof toast === 'function')
            toast('✓ Cập nhật ảnh đại diện thành công!');
          if (data.url) {
            const dataURL = data.mes[0];
            document.getElementById('avatarPreview').innerHTML =
              `<img src="${dataURL}" alt="Avatar">`;
            localStorage.setItem('user_avatar', dataURL);
            updateMainAvatar(dataURL);
            if (typeof toast === 'function') {
              toast('✓ Đã cập nhật avatar');
            }
          }
        } else {
          if (typeof toast === 'function') toast('❌ Lỗi: ' + data.mes);
        }
      } catch (error) {
        console.error('Lỗi upload:', error);
        if (typeof toast === 'function') toast('❌ Lỗi kết nối server!');
      }
    }

    uploadAvatar();
  };

  // Remove avatar
  window.removeAvatar = function () {
    const firstLetter = (localStorage.getItem('user_name') || 'T')
      .charAt(0)
      .toUpperCase();
    document.getElementById('avatarPreview').innerHTML = firstLetter;
    localStorage.removeItem('user_avatar');

    // Reset main avatar
    const mainAvatar = document.getElementById('avatarBtn');
    if (mainAvatar) mainAvatar.innerHTML = firstLetter;

    const bigAvatar = document.querySelector('.am-avatar-big');
    if (bigAvatar) bigAvatar.innerHTML = firstLetter;

    if (typeof toast === 'function') {
      toast('✓ Đã xóa avatar');
    }
  };

  // Update main avatar in dashboard
  function updateMainAvatar(dataURL) {
    const mainAvatar = document.getElementById('avatarBtn');
    if (mainAvatar) {
      mainAvatar.innerHTML = `<img src="${dataURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    }

    const bigAvatar = document.querySelector('.am-avatar-big');
    if (bigAvatar) {
      bigAvatar.innerHTML = `<img src="${dataURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    }
  }

  // Save display name
  window.saveDisplayName = function () {
    const name = document.getElementById('displayNameInput').value.trim();
    if (!name) {
      if (typeof toast === 'function') {
        toast('Vui lòng nhập tên');
      }
      return;
    }

    localStorage.setItem('user_name', name);

    // Update main dashboard
    const nameEl = document.querySelector('.am-name');
    if (nameEl) nameEl.textContent = name;

    // Update avatar letter
    const firstLetter = name.charAt(0).toUpperCase();
    if (!localStorage.getItem('user_avatar')) {
      document.getElementById('avatarPreview').innerHTML = firstLetter;
      const mainAvatar = document.getElementById('avatarBtn');
      if (mainAvatar) mainAvatar.innerHTML = firstLetter;
      const bigAvatar = document.querySelector('.am-avatar-big');
      if (bigAvatar) bigAvatar.innerHTML = firstLetter;
    }

    if (typeof toast === 'function') {
      toast('✓ Đã lưu tên hiển thị');
    }
  };

  // Save bio
  window.saveBio = function () {
    const bio = document.getElementById('bioInput').value.trim();
    localStorage.setItem('user_bio', bio);
    async function bio_server() {
      try {
        const res = await fetch(
          'https://learnpythonserver-sm.onrender.com/profile/setting/bio',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bio: bio }),
            credentials: 'include',
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error('Lỗi rồi og ơi:', data.mes);
          if (typeof toast === 'function') toast('Lỗi: ' + data.mes);
          return;
        }
        if (typeof toast === 'function') {
          console.log('Thành công:', data.mes);
          toast('✓ Đã lưu bio');
        }
      } catch (error) {
        console.error(error);
      }
    }
    bio_server();
  };

  // Toggle dark mode
  window.toggleDarkModeSetting = function (element) {
    element.classList.toggle('on');
    const isOn = element.classList.contains('on');

    localStorage.setItem('dark_mode', isOn);

    // Call existing dark mode function if available
    if (typeof toggleDark === 'function') {
      toggleDark();
    }

    if (typeof toast === 'function') {
      toast(isOn ? '🌙 Đã bật chế độ tối' : '☀️ Đã tắt chế độ tối');
    }
  };

  // Change language
  window.changeLanguage = function (lang) {
    localStorage.setItem('language', lang);
    if (typeof toast === 'function') {
      toast('✓ Đã đổi ngôn ngữ');
    }
  };

  // Toggle animation
  window.toggleAnimation = function (element) {
    element.classList.toggle('on');
    const isOn = element.classList.contains('on');
    localStorage.setItem('animation_enabled', isOn);

    if (typeof toast === 'function') {
      toast(isOn ? '✓ Đã bật hiệu ứng' : '✓ Đã tắt hiệu ứng');
    }
  };

  // Toggle generic setting
  window.toggleSetting = function (element) {
    element.classList.toggle('on');
    if (typeof toast === 'function') {
      toast('✓ Đã lưu cài đặt');
    }
  };

  // Toggle push notification
  window.togglePushNotification = function (element) {
    if (!element.classList.contains('on')) {
      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            element.classList.add('on');
            if (typeof toast === 'function') {
              toast('✓ Đã bật thông báo');
            }
          }
        });
      }
    } else {
      element.classList.remove('on');
      if (typeof toast === 'function') {
        toast('✓ Đã tắt thông báo');
      }
    }
  };

  // Change password
  window.changePassword = function () {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!current || !newPass || !confirm) {
      if (typeof toast === 'function') {
        toast('Vui lòng điền đầy đủ thông tin');
      }
      return;
    }

    if (newPass !== confirm) {
      if (typeof toast === 'function') {
        toast('Mật khẩu xác nhận không khớp');
      }
      return;
    }

    if (newPass.length < 8) {
      if (typeof toast === 'function') {
        toast('Mật khẩu phải có ít nhất 8 ký tự');
      }
      return;
    }

    // TODO: Call API to change password
    if (typeof toast === 'function') {
      toast('✓ Đã đổi mật khẩu');
    }

    // Clear inputs
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  };

  // Toggle 2FA
  window.toggle2FA = function (element) {
    element.classList.toggle('on');
    const isOn = element.classList.contains('on');

    if (isOn) {
      // TODO: Show 2FA setup modal with QR code
      if (typeof toast === 'function') {
        toast('✓ Đã bật xác thực 2 bước');
      }
    } else {
      if (typeof toast === 'function') {
        toast('✓ Đã tắt xác thực 2 bước');
      }
    }
  };

  // Logout all devices
  window.logoutAllDevices = function () {
    if (confirm('Đăng xuất khỏi tất cả thiết bị?')) {
      // TODO: Call API
      if (typeof toast === 'function') {
        toast('✓ Đã đăng xuất tất cả thiết bị');
      }
    }
  };

  // Empty trash
  window.emptyTrash = function () {
    if (confirm('Xóa vĩnh viễn tất cả file trong thùng rác?')) {
      // TODO: Call API
      if (typeof toast === 'function') {
        toast('✓ Đã dọn thùng rác');
      }
    }
  };

  // Export data
  window.exportData = function () {
    if (typeof toast === 'function') {
      toast('Đang chuẩn bị dữ liệu...');
    }
    // TODO: Call API to generate export
    setTimeout(() => {
      if (typeof toast === 'function') {
        toast('✓ Đã gửi link tải về email');
      }
    }, 2000);
  };

  // Delete account
  window.deleteAccount = function () {
    const confirmed = confirm(
      'XÓA TÀI KHOẢN?\n\nHành động này KHÔNG THỂ HOÀN TÁC!\nTất cả dữ liệu sẽ bị xóa vĩnh viễn.'
    );

    if (confirmed) {
      const doubleConfirm = prompt('Nhập "XÓA TÀI KHOẢN" để xác nhận:');
      if (doubleConfirm === 'XÓA TÀI KHOẢN') {
        // TODO: Call API
        if (typeof toast === 'function') {
          toast('Đã gửi yêu cầu xóa tài khoản');
        }
      }
    }
  };

  // Regenerate API key
  window.regenerateAPIKey = function () {
    if (confirm('Tạo API key mới? Key cũ sẽ không còn hoạt động.')) {
      // TODO: Call API
      if (typeof toast === 'function') {
        toast('✓ Đã tạo key mới');
      }
    }
  };

  console.log('[Settings Modal] Loaded successfully');
})();
