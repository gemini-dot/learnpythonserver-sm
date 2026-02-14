// ===== POPUP NOTIFICATION SYSTEM =====
// Tất cả classes sử dụng prefix "mn-" (minimalist-notification) để tránh xung đột

const PopupNotification = {
    // Hiển thị popup cơ bản
    show: function(options) {
        const defaults = {
            type: 'info', // success, error, warning, info
            title: 'THÔNG BÁO',
            subtitle: 'Hệ thống',
            message: 'Đây là nội dung thông báo',
            primaryBtn: 'Xác nhận',
            secondaryBtn: null,
            onPrimary: null,
            onSecondary: null,
            closeOnOverlay: true
        };

        const settings = { ...defaults, ...options };

        // Tạo HTML cho popup
        const popupHTML = `
            <div class="mn-popup-overlay" id="mnPopupOverlay"></div>
            <div class="mn-popup-container mn-slide-down" id="mnPopupContainer">
                <div class="mn-popup-box mn-popup-${settings.type}">
                    <div class="mn-popup-header">
                        <h3>${settings.title}</h3>
                        <p>${settings.subtitle}</p>
                    </div>
                    <div class="mn-popup-body">
                        <p class="mn-popup-message">${settings.message}</p>
                    </div>
                    <div class="mn-popup-footer">
                        ${settings.secondaryBtn ? `<button class="mn-popup-btn mn-popup-btn-secondary" id="mnPopupSecondaryBtn">${settings.secondaryBtn}</button>` : ''}
                        <button class="mn-popup-btn mn-popup-btn-primary" id="mnPopupPrimaryBtn">${settings.primaryBtn}</button>
                    </div>
                </div>
            </div>
        `;

        // Thêm vào body
        const popupDiv = document.createElement('div');
        popupDiv.id = 'mnPopupWrapper';
        popupDiv.innerHTML = popupHTML;
        document.body.appendChild(popupDiv);

        // Lấy các elements
        const overlay = document.getElementById('mnPopupOverlay');
        const container = document.getElementById('mnPopupContainer');
        const primaryBtn = document.getElementById('mnPopupPrimaryBtn');
        const secondaryBtn = document.getElementById('mnPopupSecondaryBtn');

        // Hiển thị popup
        setTimeout(() => {
            overlay.classList.add('mn-active');
            container.classList.add('mn-active');
        }, 10);

        // Hàm đóng popup
        const closePopup = () => {
            overlay.classList.remove('mn-active');
            container.classList.remove('mn-active');
            setTimeout(() => {
                popupDiv.remove();
            }, 300);
        };

        // Xử lý sự kiện nút chính
        primaryBtn.addEventListener('click', () => {
            if (settings.onPrimary) {
                settings.onPrimary();
            }
            closePopup();
        });

        // Xử lý sự kiện nút phụ
        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', () => {
                if (settings.onSecondary) {
                    settings.onSecondary();
                }
                closePopup();
            });
        }

        // Đóng khi click overlay
        if (settings.closeOnOverlay) {
            overlay.addEventListener('click', closePopup);
        }
    },

    // Popup xác nhận (Confirm)
    confirm: function(options) {
        const defaults = {
            type: 'warning',
            title: 'XÁC NHẬN',
            subtitle: 'Vui lòng xác nhận hành động',
            message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
            primaryBtn: 'Xác nhận',
            secondaryBtn: 'Hủy bỏ',
            onConfirm: null,
            onCancel: null
        };

        const settings = { ...defaults, ...options };

        this.show({
            type: settings.type,
            title: settings.title,
            subtitle: settings.subtitle,
            message: settings.message,
            primaryBtn: settings.primaryBtn,
            secondaryBtn: settings.secondaryBtn,
            onPrimary: settings.onConfirm,
            onSecondary: settings.onCancel,
            closeOnOverlay: false
        });
    },

    // Popup thành công
    success: function(message, title = 'THÀNH CÔNG') {
        this.show({
            type: 'success',
            title: title,
            subtitle: 'Hoàn thành',
            message: message,
            primaryBtn: 'Đóng'
        });
    },

    // Popup lỗi
    error: function(message, title = 'LỖI') {
        this.show({
            type: 'error',
            title: title,
            subtitle: 'Có lỗi xảy ra',
            message: message,
            primaryBtn: 'Đóng'
        });
    },

    // Popup cảnh báo
    warning: function(message, title = 'CẢNH BÁO') {
        this.show({
            type: 'warning',
            title: title,
            subtitle: 'Lưu ý',
            message: message,
            primaryBtn: 'Đã hiểu'
        });
    },

    // Popup thông tin
    info: function(message, title = 'THÔNG TIN') {
        this.show({
            type: 'info',
            title: title,
            subtitle: 'Thông báo',
            message: message,
            primaryBtn: 'Đóng'
        });
    },

    // Toast notification (góc phải màn hình)
    toast: function(options) {
        const defaults = {
            type: 'info', // success, error, warning, info
            title: 'THÔNG BÁO',
            message: 'Đây là toast notification',
            duration: 3000 // milliseconds, 0 = không tự động đóng
        };

        const settings = { ...defaults, ...options };
        const uniqueId = Date.now() + Math.random();

        // Tạo HTML cho toast
        const toastHTML = `
            <div class="mn-popup-toast mn-toast-${settings.type}" id="mnPopupToast_${uniqueId}">
                <div class="mn-toast-header">
                    <span class="mn-toast-title">${settings.title}</span>
                    <button class="mn-toast-close" id="mnToastClose_${uniqueId}">×</button>
                </div>
                <div class="mn-toast-message">${settings.message}</div>
            </div>
        `;

        // Thêm vào body
        const toastDiv = document.createElement('div');
        toastDiv.innerHTML = toastHTML;
        const toast = toastDiv.firstElementChild;
        document.body.appendChild(toast);

        // Lấy nút đóng
        const closeBtn = toast.querySelector('.mn-toast-close');

        // Hiển thị toast
        setTimeout(() => {
            toast.classList.add('mn-active');
        }, 10);

        // Hàm đóng toast
        const closeToast = () => {
            toast.classList.remove('mn-active');
            setTimeout(() => {
                toast.remove();
            }, 400);
        };

        // Nút đóng
        closeBtn.addEventListener('click', closeToast);

        // Tự động đóng
        if (settings.duration > 0) {
            setTimeout(closeToast, settings.duration);
        }
    },

    // Loading popup
    loading: function(message = 'Đang xử lý...') {
        const loadingHTML = `
            <div class="mn-popup-overlay mn-active" id="mnLoadingOverlay"></div>
            <div class="mn-popup-container mn-active" id="mnLoadingContainer">
                <div class="mn-popup-box mn-popup-loading">
                    <div class="mn-popup-body">
                        <div class="mn-loading-spinner"></div>
                        <p class="mn-loading-text">${message}</p>
                    </div>
                </div>
            </div>
        `;

        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'mnLoadingWrapper';
        loadingDiv.innerHTML = loadingHTML;
        document.body.appendChild(loadingDiv);
    },

    // Đóng loading
    closeLoading: function() {
        const loadingWrapper = document.getElementById('mnLoadingWrapper');
        if (loadingWrapper) {
            const overlay = loadingWrapper.querySelector('.mn-popup-overlay');
            const container = loadingWrapper.querySelector('.mn-popup-container');
            
            overlay.classList.remove('mn-active');
            container.classList.remove('mn-active');
            
            setTimeout(() => {
                loadingWrapper.remove();
            }, 300);
        }
    }
};