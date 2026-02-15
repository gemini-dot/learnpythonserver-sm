import { showToast } from '../../../javascript/popup/popup.js';

async function secretMaintenanceCheck() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/ping/khoi-dong'
    );
    if (response.status === 503) {
      window.location.href =
        'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/503.html'; // Chuyển hướng sang trang bảo trì
    }
  } catch (error) {
    console.log('Server đang khởi động hoặc gặp sự cố kết nối.');
  }
}

secretMaintenanceCheck();

// 1. Khai báo thông số toàn cục
const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get('gmail');
const userRole = urlParams.get('role');
const userToken = urlParams.get('token');

function checkGate() {
  console.log('Dữ liệu nhận được:', { email: userEmail, token: userToken });

  if (userEmail === null || userToken === null) {
    console.log('Phát hiện null! Đang chuyển hướng...');
    window.location.replace(
      'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/401.html'
    );
    return;
  }
  checkAccess();
}

checkGate();

async function checkAccess() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/security/upload',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gmail: userEmail,
          token: userToken,
        }),
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      showToast('success', 'Đăng nhập thành công! Chào mừng bạn quay trở lại.');
    } else {
      window.location.href =
        'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/401.html';
    }
  } catch (error) {
    console.error('Lỗi kết nối server:', error);
    window.location.href =
      'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/500.html';
  }
}

checkAccess();

let selectedFiles = [];
const maxFileSize = 10 * 1024 * 1024; // 10MB
const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'application/zip',
];

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const filesList = document.getElementById('filesList');
const uploadActions = document.getElementById('uploadActions');

// Ngăn chặn hành vi mặc định khi kéo file
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  uploadArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Hiệu ứng khi kéo file vào vùng upload
['dragenter', 'dragover'].forEach((eventName) => {
  uploadArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach((eventName) => {
  uploadArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  uploadArea.classList.add('highlight');
}

function unhighlight() {
  uploadArea.classList.remove('highlight');
}

// Xử lý khi thả file
uploadArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

// Xử lý khi chọn file qua input
fileInput.addEventListener('change', function () {
  handleFiles(this.files);
});

function handleFiles(files) {
  [...files].forEach((file) => {
    if (validateFile(file)) {
      selectedFiles.push(file);
    }
  });
  updateFilesList();
}

function validateFile(file) {
  // Kiểm tra kích thước
  if (file.size > maxFileSize) {
    showToast('error', `File "${file.name}" vượt quá giới hạn 10MB`);
    return false;
  }

  // Kiểm tra định dạng
  if (!allowedTypes.includes(file.type)) {
    showToast('error', `File "${file.name}" không đúng định dạng cho phép`);
    return false;
  }

  return true;
}

function updateFilesList() {
  if (selectedFiles.length === 0) {
    filesList.innerHTML = '';
    uploadActions.style.display = 'none';
    return;
  }

  uploadActions.style.display = 'grid';

  filesList.innerHTML = selectedFiles
    .map(
      (file, index) => `
                <div class="file-item">
                    <div class="file-icon">
                        ${getFileIcon(file.type)}
                    </div>
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                    <button class="remove-file" onclick="removeFile(${index})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `
    )
    .join('');
}

function getFileIcon(type) {
  if (type.includes('pdf')) {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
  } else if (type.includes('word')) {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b579a" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
  } else if (type.includes('excel') || type.includes('sheet')) {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#217346" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
  } else if (type.includes('image')) {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff8800" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
  } else if (type.includes('zip')) {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
  }
  return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  updateFilesList();
}

function clearFiles() {
  selectedFiles = [];
  updateFilesList();
  fileInput.value = '';
}

function uploadFiles() {
  if (selectedFiles.length === 0) {
    showToast('info', 'Vui lòng chọn file để tải lên');
    return;
  }
  const formData = new FormData();

  selectedFiles.forEach((file) => {
    formData.append('files[]', file);
  });

  if (userEmail) formData.append('gmail', userEmail);
  if (userRole) formData.append('role', userRole);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Có lỗi xảy ra khi upload!');
    })
    .then((data) => {
      console.log('Server response:', data);
      document.getElementById('fileCount').textContent = selectedFiles.length;
      document.getElementById('successModal').style.display = 'flex';
      setTimeout(() => {
        clearFiles();
      }, 500);
    })
    .catch((error) => {
      console.error('Error:', error);
      showToast('error', 'Không thể kết nối đến server!');
    });
}
function closeModal() {
  document.getElementById('successModal').style.display = 'none';
}

function goBack() {
  window.history.back();
}

// Đóng modal khi click bên ngoài
window.onclick = function (event) {
  const modal = document.getElementById('successModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
