# HƯỚNG DẪN HIỂN THỊ FILE TỪ SERVER

## 1. CẤU TRÚC DỮ LIỆU FILE TRẢ VỀ TỪ SERVER

Server của bạn cần trả về JSON với cấu trúc như sau:

```json
{
  "files": [
    {
      "id": "unique_id_123",
      "name": "document.pdf",
      "type": "pdf",
      "ext": "PDF",
      "size": "2.8 MB",
      "date": "17/02/2026",
      "url": "https://your-server.com/files/document.pdf",
      "metadata": {
        "resolution": "A4",
        "pages": 12,
        "path": "/uploads/2026/02/document.pdf"
      }
    }
  ],
  "total": 156
}
```

### Trường bắt buộc:
- `id` (string): ID duy nhất của file
- `name` (string): Tên file
- `type` (string): Loại file - **'img'**, **'doc'**, **'vid'**, **'pdf'**, **'zip'**
- `ext` (string): Extension viết hoa (PNG, PDF, MP4, etc.)
- `size` (string): Kích thước đã format (4.2 MB, 128 KB)
- `date` (string): Ngày tải lên theo format 'DD/MM/YYYY'

### Trường tùy chọn:
- `url` (string): Link download trực tiếp
- `thumb` (string): Màu nền thumbnail (hex color, vd: '#f0ece8')
- `emoji` (string): Icon emoji hiển thị (🖼️, 📄, 🎬, 📦, etc.)
- `metadata.resolution` (string): Độ phân giải ('1920×1080', 'A4', etc.)
- `metadata.path` (string): Đường dẫn server

---

## 2. GỌI API VÀ HIỂN THỊ FILE

### A. Thêm hàm fetch files vào JS (đặt sau phần INIT):

```javascript
// ─── LOAD FILES FROM SERVER ───────────────────────────────────────
async function loadFilesFromServer() {
  try {
    const response = await fetch('https://your-server.com/api/files', {
      method: 'GET',
      credentials: 'include',  // gửi cookies nếu cần auth
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Chưa đăng nhập
        window.location.href = '/login';
        return;
      }
      throw new Error('Không thể tải danh sách file');
    }

    const data = await response.json();
    
    // Map dữ liệu server về format dashboard
    sampleFiles.length = 0;  // Xóa data mẫu
    data.files.forEach(file => {
      sampleFiles.push({
        id:    file.id,
        name:  file.name,
        type:  file.type,
        ext:   file.ext,
        size:  file.size,
        date:  file.date,
        url:   file.url || '',
        emoji: file.emoji || getDefaultEmoji(file.type),
        thumb: file.thumb || getDefaultThumb(file.type),
        res:   file.metadata?.resolution || '—',
        path:  file.metadata?.path || `/uploads/${file.name}`
      });
    });

    // Render lại UI
    renderFiles();
    toast('Đã tải ' + sampleFiles.length + ' file');

  } catch (error) {
    console.error('Load files error:', error);
    toast('Lỗi: Không thể tải danh sách file');
  }
}

// Helper: Lấy emoji mặc định theo type
function getDefaultEmoji(type) {
  const map = { img: '🖼️', pdf: '📄', doc: '📝', vid: '🎬', zip: '📦' };
  return map[type] || '📁';
}

// Helper: Lấy màu thumb mặc định
function getDefaultThumb(type) {
  const map = {
    img: '#f0ece8',
    pdf: '#f0f0ed',
    doc: '#eef0e8',
    vid: '#e8ecf0',
    zip: '#ede8f0'
  };
  return map[type] || '#f5f5f3';
}
```

### B. Gọi hàm load khi trang load xong:

Thay dòng `renderFiles();` cuối file JS bằng:

```javascript
// ─── INIT ─────────────────────────────────────────────────────────
loadFilesFromServer();  // Load file thật từ server
// renderFiles();       // Bỏ dòng này nếu dùng server
```

---

## 3. XỬ LÝ UPLOAD FILE LÊN SERVER

Sửa hàm `simulateUpload()` thành upload thật:

```javascript
function simulateUpload(items) {
  closeModal();
  
  // Tạo FormData với files thật
  const formData = new FormData();
  queuedFiles.forEach(file => {
    formData.append('files[]', file);
  });

  // Upload lên server
  fetch('https://your-server.com/api/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
    .then(response => {
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    })
    .then(data => {
      console.log('Upload success:', data);
      
      // Server trả về list file đã upload, thêm vào UI
      data.uploaded.forEach(file => {
        sampleFiles.unshift({
          id:    file.id,
          name:  file.name,
          type:  file.type,
          ext:   file.ext,
          size:  file.size,
          date:  new Date().toLocaleDateString('vi-VN'),
          url:   file.url,
          emoji: getDefaultEmoji(file.type),
          thumb: getDefaultThumb(file.type),
          res:   '—',
          path:  file.path
        });
      });
      
      renderFiles();
      toast(`✓ Đã upload ${data.uploaded.length} file`);
    })
    .catch(error => {
      console.error('Upload error:', error);
      toast('Lỗi: Không thể upload file');
    });
}
```

---

## 4. XỬ LÝ DELETE FILE

Sửa hàm `deleteSelected()`:

```javascript
function deleteSelected() {
  if (!selectedId) return;
  
  const file = sampleFiles.find(f => f.id === selectedId);
  if (!file) return;

  if (!confirm(`Xóa file "${file.name}"?`)) return;

  // Gọi API delete
  fetch(`https://your-server.com/api/files/${selectedId}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(response => {
      if (!response.ok) throw new Error('Delete failed');
      return response.json();
    })
    .then(data => {
      // Xóa khỏi UI
      const idx = sampleFiles.findIndex(f => f.id === selectedId);
      if (idx !== -1) sampleFiles.splice(idx, 1);
      
      selectedId = null;
      renderFiles();
      
      // Reset panel
      const panelEmpty = document.getElementById('panelEmpty');
      const panelContent = document.getElementById('panelContent');
      const panelActions = document.getElementById('panelActions');
      if (panelEmpty)   panelEmpty.style.display   = 'flex';
      if (panelContent) panelContent.style.display = 'none';
      if (panelActions) panelActions.style.display = 'none';
      
      toast('Đã xóa file');
    })
    .catch(error => {
      console.error('Delete error:', error);
      toast('Lỗi: Không thể xóa file');
    });
}
```

---

## 5. XỬ LÝ DOWNLOAD FILE

Thêm vào panel actions (sửa onclick của nút Download):

```javascript
// Trong HTML, thay:
// onclick="toast('Đang tải xuống...')"
// Thành:
// onclick="downloadFile()"

// Thêm hàm JS:
function downloadFile() {
  if (!selectedId) {
    toast('Chọn file trước');
    return;
  }
  
  const file = sampleFiles.find(f => f.id === selectedId);
  if (!file || !file.url) {
    toast('File không có link download');
    return;
  }

  // Mở link download trong tab mới
  window.open(file.url, '_blank');
  toast('Đang tải xuống...');
}
```

---

## 6. LƯU Ý QUAN TRỌNG

### A. CORS (Cross-Origin Resource Sharing)
Nếu frontend và backend khác domain, server phải config CORS:

**Python Flask:**
```python
from flask_cors import CORS
CORS(app, supports_credentials=True)
```

**Node.js Express:**
```javascript
app.use(cors({ origin: 'https://frontend-domain.com', credentials: true }));
```

### B. Authentication
Nếu dùng cookie/session auth:
- Frontend: `credentials: 'include'` trong fetch
- Backend: Header `Access-Control-Allow-Credentials: true`

### C. Error Handling
Luôn handle:
- Network errors (server down)
- Auth errors (401 Unauthorized)
- Validation errors (400 Bad Request)
- Server errors (500 Internal Server Error)

### D. Loading States
Thêm spinner khi loading:

```javascript
function showLoading() {
  document.getElementById('fileContainer').innerHTML = `
    <div style="display:flex;justify-content:center;padding:60px;">
      <div style="color:var(--ink-4)">Đang tải...</div>
    </div>`;
}

// Gọi trước khi fetch:
async function loadFilesFromServer() {
  showLoading();
  try {
    // ... fetch code
  } catch (error) {
    // ... error handling
  }
}
```

---

## 7. FULL WORKFLOW VÍ DỤ

```javascript
// 1. User vào trang → Tự động load files
loadFilesFromServer();

// 2. User upload file → Gọi API upload → Refresh UI
// (Xem phần 3)

// 3. User click file → Hiển thị detail panel
// (Code sẵn có, không cần sửa)

// 4. User click Download → Mở link file.url
downloadFile();

// 5. User click Delete → Gọi API delete → Xóa khỏi UI
// (Xem phần 4)

// 6. User search/filter → Chạy local (không cần server)
// (Code sẵn có)
```

---

## 8. TROUBLESHOOTING

**Lỗi: "Không tải được file"**
- Check console.log xem API trả về gì
- Kiểm tra CORS headers
- Xác nhận auth token/cookie đúng

**Lỗi: "File hiển thị sai loại"**
- Đảm bảo server trả đúng `type` field: 'img', 'doc', 'vid', 'pdf', 'zip'
- Không dùng 'image', 'document' — phải đúng 5 giá trị trên

**Lỗi: "Upload không hoạt động"**
- Check `queuedFiles` có file thật không (console.log)
- Kiểm tra server có nhận FormData không
- Xem server có validate file type/size không

---

## 9. API ENDPOINTS MẪU

Server của bạn cần implement các endpoint sau:

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/files` | Lấy danh sách tất cả file |
| POST | `/api/upload` | Upload file mới |
| DELETE | `/api/files/:id` | Xóa file theo ID |
| GET | `/api/files/:id/download` | Download file (optional) |

Response format:
```json
// GET /api/files
{
  "files": [...],
  "total": 156
}

// POST /api/upload
{
  "uploaded": [
    { "id": "...", "name": "...", "url": "..." }
  ]
}

// DELETE /api/files/:id
{
  "success": true,
  "message": "File deleted"
}
```

---

**Hoàn tất!** Nếu có lỗi cụ thể, check console.log và gửi error message để debug.
