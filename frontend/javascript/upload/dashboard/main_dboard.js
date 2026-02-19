const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('useraccount');
if (userName) {
  const cleanName = decodeURIComponent(userName);
  toast(`chào mừng ${cleanName}`);
}
async function secretMaintenanceCheck() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/ping/khoi-dong'
    );
    if (response.status === 503) {
      window.location.replace(
        'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/503.html'
      );
    }
  } catch (error) {
    console.log('Server đang khởi động hoặc gặp sự cố kết nối.');
  }
}

secretMaintenanceCheck();

async function checkAccess() {
  try {
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/security/upload',
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      toast('thành công! Chào mừng bạn quay trở lại.');
    } else {
      window.location.replace(
        'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/401.html'
      );
    }
  } catch (error) {
    window.location.replace(
      'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/500.html'
    );
  }
}

checkAccess();

const sampleFiles = []; // Bắt đầu rỗng, sẽ được fill bởi loadFilesFromServer()
const trashFiles = [];
let isProcessing = false;

let files = [...sampleFiles]; // Không dùng nữa, giữ để tương thích
let selectedId = null;
let viewMode = 'grid';
let searchQuery = ''; // chuỗi tìm kiếm hiện tại
let activeFilter = 'all'; // filter từ nav: 'all','img','doc','vid','pdf','zip','today','fav','trash','shared'
// ─── HÀM LỌC TRUNG TÂM ───────────────────────────────────────────
// Luôn lọc từ sampleFiles gốc, kết hợp filter + search cùng lúc
function getFilteredFiles() {
  const today = new Date().toLocaleDateString('vi-VN');
  let result = [...sampleFiles];

  console.log(
    '[Filter Debug] activeFilter:',
    activeFilter,
    'searchQuery:',
    searchQuery,
    'sampleFiles:',
    sampleFiles.length
  );

  // 1. Lọc theo category nav
  switch (activeFilter) {
    case 'img':
      result = result.filter((f) => f.type === 'img');
      break;
    case 'doc':
      result = result.filter((f) => f.type === 'doc');
      break;
    case 'vid':
      result = result.filter((f) => f.type === 'vid');
      break;
    case 'pdf':
      result = result.filter((f) => f.type === 'pdf');
      break;
    case 'zip':
      result = result.filter((f) => f.type === 'zip');
      break;
    case 'today':
      result = result.filter((f) => f.date === today);
      break;
    case 'fav':
      result = [];
      break; // demo: chưa có yêu thích
    case 'trash':
      result = [...trashFiles];
      break; // demo: thùng rác trống
    case 'shared':
      result = [];
      break; // demo: chưa chia sẻ
    default:
      break; // 'all' — giữ nguyên
  }

  console.log('[Filter Debug] After category filter:', result.length);

  // 2. Lọc thêm theo search query (tên file + ext)
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    result = result.filter(
      (f) => f.name.toLowerCase().includes(q) || f.ext.toLowerCase().includes(q)
    );
  }

  console.log('[Filter Debug] After search filter:', result.length);
  return result;
}

// ─── SIDEBAR / PANEL STATE ────────────────────────────────────────
const app = document.getElementById('app');
const sidebar = document.getElementById('sidebar');
const panel = document.getElementById('panel');

let leftOpen = false;
let rightOpen = false;
let leftCloseTimer, rightCloseTimer;
const CLOSE_DELAY = 580; // ms chờ trước khi đóng, tránh giật khi di nhanh

function openLeft() {
  clearTimeout(leftCloseTimer);
  if (leftOpen) return;
  leftOpen = true;
  sidebar.classList.add('open');
  app.classList.add('left-open');
  const chevron = document.getElementById('sidebarChevron');
  if (chevron) chevron.style.transform = 'rotate(180deg)';
}
function closeLeft() {
  leftCloseTimer = setTimeout(() => {
    leftOpen = false;
    sidebar.classList.remove('open');
    app.classList.remove('left-open');
    const chevron = document.getElementById('sidebarChevron');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }, CLOSE_DELAY);
}

function openRight() {
  clearTimeout(rightCloseTimer);
  if (rightOpen) return;
  rightOpen = true;
  panel.classList.add('open');
  app.classList.add('right-open');
}

function closeRight() {
  rightCloseTimer = setTimeout(() => {
    if (isProcessing) return; // Nếu đang bận thì không đóng panel
    rightOpen = false;
    panel.classList.remove('open');
    app.classList.remove('right-open');
  }, CLOSE_DELAY);
}

// Hover events — sidebar trái
sidebar.addEventListener('mouseenter', openLeft);
sidebar.addEventListener('mouseleave', closeLeft);

// Hover events — panel phải
panel.addEventListener('mouseenter', openRight);
panel.addEventListener('mouseleave', () => {
  if (!isProcessing) {
    closeRight();
  }
});

// toggleLeft/toggleRight vẫn giữ để các nút bên trong có thể gọi
function toggleLeft() {
  leftOpen ? closeLeft() : openLeft();
  clearTimeout(leftCloseTimer); // nếu click thì không delay
  leftOpen = !sidebar.classList.contains('open');
  // force immediate
  if (!leftOpen) {
    sidebar.classList.remove('open');
    app.classList.remove('left-open');
    const chevron = document.getElementById('sidebarChevron');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }
}
function toggleRight() {
  if (rightOpen) {
    clearTimeout(rightCloseTimer);
    rightOpen = false;
    panel.classList.remove('open');
    app.classList.remove('right-open');
  } else {
    openRight();
  }
}

// ─── RENDER FILES ─────────────────────────────────────────────────
function renderFiles() {
  const container = document.getElementById('fileContainer');
  const titleEl = document.querySelector('#filesArea .section-title');
  container.innerHTML = '';

  const filtered = getFilteredFiles();

  // Cập nhật tiêu đề section
  if (searchQuery.trim()) {
    if (titleEl)
      titleEl.textContent = `Kết quả tìm kiếm "${searchQuery.trim()}"`;
  } else {
    const labels = {
      all: 'Tất cả',
      img: 'Hình ảnh',
      doc: 'Tài liệu',
      vid: 'Video',
      pdf: 'PDF',
      zip: 'Lưu trữ',
      today: 'Hôm nay',
      fav: 'Yêu thích',
      trash: 'Thùng rác',
      shared: 'Chia sẻ',
    };
    if (titleEl) titleEl.textContent = labels[activeFilter] || 'Tất cả';
  }

  // Empty state
  if (filtered.length === 0) {
    container.className = '';
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  gap:12px;padding:60px 24px;text-align:center;opacity:0.5;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <div style="font-size:14px;font-weight:600;color:var(--ink-3);">
          ${searchQuery.trim() ? `Không tìm thấy "${searchQuery.trim()}"` : 'Không có file nào'}
        </div>
        <div style="font-size:12px;color:var(--ink-4);">
          ${searchQuery.trim() ? 'Thử từ khóa khác hoặc kiểm tra chính tả' : 'Mục này đang trống'}
        </div>
      </div>`;
    updateSelCount(0);
    return;
  }

  if (viewMode === 'grid') {
    container.className = 'file-grid';
    filtered.forEach((f, i) => {
      const div = document.createElement('div');
      div.className = 'file-card' + (selectedId === f.id ? ' selected' : '');

      // Kiểm tra nếu là ảnh thì dùng URL, nếu không thì dùng màu thumb mặc định
      const bgStyle =
        f.type === 'img' && f.url
          ? `background-image: url('${f.url}'); background-size: cover; background-position: center;`
          : `background: ${f.thumb}`;

      // Nếu là ảnh thì không hiện Emoji đè lên (hoặc hiện nhỏ lại), tùy og thích
      const content =
        f.type === 'img' && f.url
          ? ''
          : `<span style="font-size:32px">${f.emoji}</span>`;

      div.innerHTML = `
    <div class="file-thumb type-${f.type}" style="${bgStyle}">
      ${content}
    </div>
    <div class="file-name" title="${f.name}">${highlight(f.name, searchQuery)}</div>
    <div class="file-meta">${f.ext} · ${f.size}</div>
  `;
      div.onclick = () => selectFile(f.id);
      container.appendChild(div);
    });
  } else {
    container.className = 'file-list';
    filtered.forEach((f, i) => {
      const div = document.createElement('div');
      div.className = 'file-row' + (selectedId === f.id ? ' selected' : '');
      div.style.animationDelay = i * 0.03 + 's';

      // Tạo logic kiểm tra ảnh giống như bên Grid Mode
      const isImg = f.type === 'img' && f.url;
      const rowBgStyle = isImg
        ? `background-image: url('${f.url}'); background-size: cover; background-position: center;`
        : `background: ${f.thumb}`;
      const rowContent = isImg ? '' : f.emoji;

      div.innerHTML = `
        <div class="row-icon" style="${rowBgStyle}">${rowContent}</div>
        <div class="row-name">${highlight(f.name, searchQuery)}</div>
        <div class="row-type">${f.ext}</div>
        <div class="row-size">${f.size}</div>
        <div class="row-date">${f.date}</div>
      `;
      div.onclick = () => selectFile(f.id);
      container.appendChild(div);
    });
  }

  updateSelCount(filtered.length);
  updateStats(); // Cập nhật stats cards
  updateBadges();
}

// Highlight từ khóa trong tên file
function highlight(text, query) {
  if (!query.trim()) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark style="background:rgba(10,10,10,0.12);border-radius:2px;padding:0 1px;">$1</mark>'
  );
}

// ─── SELECT FILE ──────────────────────────────────────────────────
function selectFile(id) {
  selectedId = selectedId === id ? null : id;
  renderFiles();

  const f =
    sampleFiles.find((x) => x.id === id) || trashFiles.find((x) => x.id === id);
  const panelEmpty = document.getElementById('panelEmpty');
  const panelContent = document.getElementById('panelContent');
  const panelActions = document.getElementById('panelActions');

  if (!f || selectedId === null) {
    panelEmpty.style.display = 'flex';
    panelContent.style.display = 'none';
    panelActions.style.display = 'none';
    document.getElementById('panelTitle').textContent = 'Chi tiết file';
    document.getElementById('panelSub').textContent = 'Chọn một file để xem';
    return;
  }

  const previewEl = document.getElementById('previewThumb');
  const isImg = f.type === 'img' && f.url;
  if (isImg) {
    previewEl.innerHTML = '';
    previewEl.style.backgroundImage = `url('${f.url}')`;
    previewEl.style.backgroundSize = 'cover';
    previewEl.style.backgroundPosition = 'center';
  } else {
    previewEl.innerHTML = `<span style="font-size:60px">${f.emoji}</span>`;
    previewEl.style.backgroundImage = 'none';
    previewEl.style.background = f.thumb;
  }
  panelEmpty.style.display = 'none';
  panelContent.style.display = 'flex';
  panelActions.style.display = 'flex';

  document.getElementById('panelSub').textContent = f.ext + ' · ' + f.size;
  document.getElementById('detName').textContent = f.name;
  document.getElementById('detType').textContent = f.ext;
  document.getElementById('detSize').textContent = f.size;
  document.getElementById('detDate').textContent = f.date;
  document.getElementById('detRes').textContent = f.res;
  document.getElementById('detPath').textContent = '/vault/uploads/' + f.name;

  if (!rightOpen) openRight();

  const isTrashMode =
    (typeof activeFilter !== 'undefined' && activeFilter === 'trash') ||
    f.deleted;

  const favBtn = document.getElementById('favoritePanelBtn');
  const normalActions = document.getElementById('normalActions');
  const trashActions = document.getElementById('trashActions');
  const dateLabel = document.getElementById('detDateLabel');

  if (isTrashMode) {
    if (favBtn) favBtn.style.display = 'none';
    if (normalActions) normalActions.style.display = 'none';
    if (trashActions) trashActions.style.display = 'block';
    if (dateLabel) dateLabel.textContent = 'Ngày xóa';
  } else {
    if (favBtn) favBtn.style.display = 'block';
    if (normalActions) normalActions.style.display = 'block';
    if (trashActions) trashActions.style.display = 'none';
    if (dateLabel) dateLabel.textContent = 'Ngày tải';
    updateFavoriteButton(f.id);
  }
}

// ─── VIEW MODE ────────────────────────────────────────────────────
function setView(mode) {
  viewMode = mode;
  document
    .getElementById('gridBtn')
    .classList.toggle('active', mode === 'grid');
  document
    .getElementById('listBtn')
    .classList.toggle('active', mode === 'list');

  const area = document.getElementById('filesArea');
  area.style.opacity = '0';
  area.style.transform = 'translateY(6px)';
  setTimeout(() => {
    renderFiles();
    area.style.opacity = '1';
    area.style.transform = 'translateY(0)';
  }, 150);
}

const filesArea = document.getElementById('filesArea');
filesArea.style.transition = 'opacity 0.2s, transform 0.25s';

// ─── NAV / FILTER ─────────────────────────────────────────────────
function setNav(el) {
  // Đổi active state
  document
    .querySelectorAll('.nav-item')
    .forEach((e) => e.classList.remove('active'));
  el.classList.add('active');

  // Lấy filter từ data-filter attribute
  activeFilter = el.dataset.filter || 'all';

  // Reset selection khi đổi filter
  selectedId = null;

  // Re-render với filter mới
  renderFiles();
  updateStats();
  // Reset panel về trạng thái trống
  const panelEmpty = document.getElementById('panelEmpty');
  const panelContent = document.getElementById('panelContent');
  const panelActions = document.getElementById('panelActions');
  if (panelEmpty) panelEmpty.style.display = 'flex';
  if (panelContent) panelContent.style.display = 'none';
  if (panelActions) panelActions.style.display = 'none';
  const titleEl = document.getElementById('panelTitle');
  const subEl = document.getElementById('panelSub');
  if (titleEl) titleEl.textContent = 'Chi tiết file';
  if (subEl) subEl.textContent = 'Chọn một file để xem';
}

// ─── SELECTION COUNT ──────────────────────────────────────────────
function updateSelCount(total) {
  const count = total !== undefined ? total : getFilteredFiles().length;
  const sel = selectedId ? 1 : 0;
  document.getElementById('selCount').textContent = sel
    ? `${sel} file đã chọn`
    : `${count} file`;
  document.getElementById('deleteSelBtn').style.display = sel ? 'flex' : 'none';
}

function deleteSelected() {
  if (!selectedId) return;

  // 1. Tìm file đang được chọn trong sampleFiles
  const fileIdx = sampleFiles.findIndex((f) => f.id === selectedId);

  if (fileIdx !== -1) {
    // 2. "Cất" file vào thùng rác trước khi xóa
    const deletedFile = sampleFiles[fileIdx];
    trashFiles.push(deletedFile);

    // 3. Xóa file khỏi mảng chính
    sampleFiles.splice(fileIdx, 1);

    // Reset trạng thái
    selectedId = null;
    renderFiles();

    // Thông báo cho vui vẻ
    toast(`Đã chuyển "${deletedFile.name}" vào thùng rác`);
  }
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────
let queuedFiles = [];

function openModal() {
  document.getElementById('uploadModal').classList.add('open');
}
function closeModal() {
  document.getElementById('uploadModal').classList.remove('open');
  queuedFiles = [];
  document.getElementById('uploadQueue').innerHTML = '';
}
document.getElementById('uploadModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('uploadModal')) closeModal();
});

function handleFiles(fl) {
  queuedFiles = Array.from(fl);
  const q = document.getElementById('uploadQueue');
  q.innerHTML = '';
  queuedFiles.forEach((f) => {
    const size =
      f.size > 1048576
        ? (f.size / 1048576).toFixed(1) + ' MB'
        : (f.size / 1024).toFixed(0) + ' KB';
    const div = document.createElement('div');
    div.className = 'queue-item';
    div.innerHTML = `
      <span style="font-size:18px">${getEmoji(f.name)}</span>
      <span class="queue-name">${f.name}</span>
      <span class="queue-size">${size}</span>
    `;
    q.appendChild(div);
  });
}

function getEmoji(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️';
  if (['pdf'].includes(ext)) return '📄';
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return '🎬';
  if (['zip', 'tar', 'gz', 'rar'].includes(ext)) return '📦';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
  if (['ppt', 'pptx'].includes(ext)) return '📋';
  return '📁';
}

function startUpload() {
  if (queuedFiles.length === 0) {
    simulateUpload([
      {
        name: 'demo-file.png',
        size: '2.4 MB',
        ext: 'PNG',
        type: 'img',
        thumb: '#f0ece8',
        emoji: '🖼️',
        res: '1920×1080',
      },
    ]);
    return;
  }
  const items = queuedFiles.map((f, i) => {
    const size =
      f.size > 1048576
        ? (f.size / 1048576).toFixed(1) + ' MB'
        : (f.size / 1024).toFixed(0) + ' KB';
    const ext = f.name.split('.').pop().toUpperCase();
    return {
      id: Date.now() + i,
      name: f.name,
      size,
      ext,
      type: 'doc',
      thumb: '#f0f0ed',
      emoji: getEmoji(f.name),
      res: '—',
      date: new Date().toLocaleDateString('vi-VN'),
    };
  });
  simulateUpload(items);
}

function simulateUpload(items) {
  closeModal();
  items.forEach((item, i) => {
    setTimeout(() => {
      // Thêm vào sampleFiles gốc để filter hoạt động đúng
      sampleFiles.unshift({
        ...item,
        id: Date.now() + i,
        date: new Date().toLocaleDateString('vi-VN'),
      });
      renderFiles();
      toast(`✓ ${item.name} đã tải lên`);
    }, i * 600);
  });
}

// ─── STATS UPDATE ─────────────────────────────────────────────────
function updateStats() {
  const source = activeFilter === 'trash' ? trashFiles : sampleFiles;

  const total = source.length;
  const imgs = source.filter((f) => f.type === 'img').length;
  const docs = source.filter((f) => f.type === 'doc').length;
  const vids = source.filter((f) => f.type === 'vid').length;
  const other = source.filter(
    (f) => !['img', 'doc', 'vid'].includes(f.type)
  ).length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statImg').textContent = imgs;
  document.getElementById('statDoc').textContent = docs;
  document.getElementById('statVid').textContent = vids;
  document.getElementById('statOther').textContent = other;
}

// ─── TOAST ────────────────────────────────────────────────────────
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${msg}`;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

// ─── AVATAR MENU ──────────────────────────────────────────────────
const avatarBtn = document.getElementById('avatarBtn');
const avatarMenu = document.getElementById('avatarMenu');

function toggleAvatarMenu() {
  avatarMenu.classList.contains('open') ? closeAvatarMenu() : openAvatarMenu();
}
function openAvatarMenu() {
  avatarMenu.classList.add('open');
  avatarBtn.classList.add('open');
  document.querySelectorAll('.am-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(8px)';
    setTimeout(
      () => {
        el.style.transition =
          'opacity 0.2s, transform 0.22s cubic-bezier(0.16,1,0.3,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      },
      60 + i * 28
    );
  });
}
function closeAvatarMenu() {
  avatarMenu.classList.remove('open');
  avatarBtn.classList.remove('open');
}
document.addEventListener('click', (e) => {
  if (!document.querySelector('.avatar-wrap').contains(e.target))
    closeAvatarMenu();
});

// ─── LOAD FILES FROM SERVER ───────────────────────────────────────
/**
 * HÀM NÀY LÀ TÂM ĐIỂM - LẤY TẤT CẢ FILES TỪ SERVER VÀ LƯU VÀO RAM
 *
 * Flow:
 * 1. Hiển thị loading spinner
 * 2. Gọi API GET /api/files
 * 3. Server trả về JSON { files: [...], total: 1000 }
 * 4. Loop qua từng file, push vào sampleFiles[]
 * 5. Render UI
 *
 * LƯU Ý: sampleFiles[] sẽ chứa TOÀN BỘ files (có thể 1000+)
 * → Filter/search hoạt động trên client-side (nhanh)
 * → Không cần gọi lại server khi filter
 */
async function loadFilesFromServer() {
  console.log('[Load] Bắt đầu fetch files từ server...');

  // 1. Hiển thị loading
  showLoadingState();

  try {
    // 2. Gọi API (THAY ĐỔI URL NÀY THEO SERVER CỦA BẠN)
    const response = await fetch(
      'https://learnpythonserver-sm.onrender.com/upload_sv/upload_get_file',
      {
        method: 'GET',
        credentials: 'include', // Gửi cookies (session/auth)
        headers: {
          'Content-Type': 'application/json',
          // Nếu dùng JWT: 'Authorization': 'Bearer ' + token
        },
      }
    );

    console.log('[Load] Response status:', response.status);

    // 3. Xử lý lỗi HTTP
    if (!response.ok) {
      if (response.status === 401) {
        // Chưa đăng nhập → Chuyển sang trang login
        toast('Phiên đăng nhập hết hạn');
        setTimeout(() => {
          window.location.href =
            'https://gemini-dot.github.io/learnpythonserver-sm/frontend/view/error/401.html';
        }, 1500);
        return;
      }

      if (response.status === 500) {
        toast('Lỗi server, vui lòng thử lại sau');
        console.error('[Load] Server error 500');
        return;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 4. Parse JSON
    // 4. Parse JSON
    const data = await response.json();
    console.log('[Load] Dữ liệu thô từ server:', data);

    // 5. Xóa hết dữ liệu cũ trên RAM để nạp mới
    sampleFiles.length = 0;
    trashFiles.length = 0;
    const actualData = data.files;
    if (
      actualData &&
      actualData.danh_sach_file &&
      Array.isArray(actualData.danh_sach_file)
    ) {
      sampleFiles.push(
        ...actualData.danh_sach_file.map((f, i) => ({
          id: f.id || f._id || `f_a_${i}`,
          name: f.name || 'Unnamed',
          type: mapFileType(f.type, f.ext),
          ext: (f.ext || '').toUpperCase(),
          size: f.size || '—',
          date: f.date || new Date().toLocaleDateString('vi-VN'),
          url: f.url || '',
          emoji: getEmojiForType(mapFileType(f.type, f.ext)),
          thumb: getThumbColor(mapFileType(f.type, f.ext)),
          path: f.path || '',
        }))
      );
    }

    // Xử lý File rác (Trash)
    if (
      actualData &&
      actualData.danh_sach_file_da_xoa &&
      Array.isArray(actualData.danh_sach_file_da_xoa)
    ) {
      trashFiles.push(
        ...actualData.danh_sach_file_da_xoa.map((f, i) => ({
          id: f.id || f._id || `f_t_${i}`,
          name: f.name || 'Unnamed',
          type: mapFileType(f.type, f.ext),
          ext: (f.ext || '').toUpperCase(),
          size: f.size || '—',
          date: f.date || new Date().toLocaleDateString('vi-VN'),
          url: f.url || '',
          emoji: getEmojiForType(mapFileType(f.type, f.ext)),
          thumb: getThumbColor(mapFileType(f.type, f.ext)),
          path: f.path || '',
        }))
      );
    }

    // 7. Cập nhật giao diện
    renderFiles();
    updateStats();
    updateBadges(); // Nếu og có hàm đếm số lượng file thì gọi ở đây

    console.log(
      `[Load] Đã nạp: ${sampleFiles.length} file active, ${trashFiles.length} file trash`
    );
    toast(
      `Tải xong: ${sampleFiles.length} file hoạt động, ${trashFiles.length} file rác`
    );
  } catch (error) {
    console.error('[Load] Error:', error);

    // Hiển thị error cho user
    showErrorState(error.message);
    toast('Không thể tải danh sách file');
  }
}

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────

/**
 * Hiển thị loading spinner
 */
function showLoadingState() {
  const container = document.getElementById('fileContainer');
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                gap:16px;padding:80px 24px;text-align:center;">
      <div style="width:40px;height:40px;border:3px solid var(--border);
                  border-top-color:var(--ink);border-radius:50%;
                  animation:spin 0.8s linear infinite;"></div>
      <div style="font-size:14px;color:var(--ink-3);font-weight:500;">
        Đang tải danh sách file...
      </div>
    </div>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
}

/**
 * Hiển thị error state
 */
function showErrorState(message) {
  const container = document.getElementById('fileContainer');
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                gap:12px;padding:60px 24px;text-align:center;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c03030" 
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div style="font-size:14px;font-weight:600;color:#c03030;">Lỗi tải dữ liệu</div>
      <div style="font-size:12px;color:var(--ink-4);max-width:300px;">${message}</div>
      <button onclick="loadFilesFromServer()" style="margin-top:8px;padding:8px 16px;
              background:var(--ink);color:#fff;border:none;border-radius:8px;
              font-size:13px;font-weight:600;cursor:pointer;">
        Thử lại
      </button>
    </div>
  `;
}

/**
 * Map type từ server (có thể là 'image', 'document', ...)
 * sang type dashboard ('img', 'doc', 'vid', 'pdf', 'zip')
 */
function mapFileType(serverType, ext) {
  // Nếu server đã trả đúng format → giữ nguyên
  if (['img', 'doc', 'vid', 'pdf', 'zip'].includes(serverType)) {
    return serverType;
  }

  // Map từ tên dài → tên ngắn
  const typeMap = {
    image: 'img',
    picture: 'img',
    photo: 'img',
    document: 'doc',
    text: 'doc',
    spreadsheet: 'doc',
    presentation: 'doc',
    video: 'vid',
    movie: 'vid',
    archive: 'zip',
    compressed: 'zip',
  };

  if (typeMap[serverType?.toLowerCase()]) {
    return typeMap[serverType.toLowerCase()];
  }

  // Fallback: Đoán theo extension
  return guessTypeFromExt(ext);
}

/**
 * Đoán type từ extension
 */
function guessTypeFromExt(ext) {
  if (!ext) return 'doc';
  ext = ext.toLowerCase().replace('.', '');

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext))
    return 'img';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'vid';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'zip';
  return 'doc'; // Default
}

/**
 * Extract extension từ filename
 */
function extractExt(filename) {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Format bytes thành human-readable (3.2 MB)
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
}

/**
 * Format ISO timestamp thành DD/MM/YYYY
 */
function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN');
  } catch {
    return '';
  }
}

/**
 * Lấy emoji theo type
 */
function getEmojiForType(type, ext) {
  const map = {
    img: '🖼️',
    pdf: '📄',
    doc: '📝',
    vid: '🎬',
    zip: '📦',
  };
  return map[type] || '📁';
}

/**
 * Lấy màu thumb theo type
 */
function getThumbColor(type) {
  const map = {
    img: '#f0ece8',
    pdf: '#f0f0ed',
    doc: '#eef0e8',
    vid: '#e8ecf0',
    zip: '#ede8f0',
  };
  return map[type] || '#f5f5f3';
}

// ─── SEARCH ───────────────────────────────────────────────────────
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  // Hiện/ẩn nút clear
  searchClear.style.display = searchQuery.length > 0 ? 'flex' : 'none';
  // Reset selection khi search
  selectedId = null;
  renderFiles();
});

// Phím Escape: xóa search
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') clearSearch();
});

function clearSearch() {
  searchInput.value = '';
  searchQuery = '';
  searchClear.style.display = 'none';
  selectedId = null;
  renderFiles();
  searchInput.focus();
}

function updateBadges() {
  document.getElementById('all_file').textContent = sampleFiles.length;
  const imgCount = sampleFiles.filter((f) => f.type === 'img').length;
  const docCount = sampleFiles.filter((f) => f.type === 'doc').length;
  const vidCount = sampleFiles.filter((f) => f.type === 'vid').length;
  if (document.getElementById('hinh_anh'))
    document.getElementById('hinh_anh').textContent = imgCount;
  if (document.getElementById('tai_lieu'))
    document.getElementById('tai_lieu').textContent = docCount;
  if (document.getElementById('video'))
    document.getElementById('video').textContent = vidCount;
}

loadFilesFromServer();

async function downloadCurrentFile() {
  if (!selectedId) return;
  const fileToDownload = sampleFiles.find((f) => f.id === selectedId);
  if (!fileToDownload || !fileToDownload.url) return;
  if (!selectedId) {
    toast('Vui lòng chọn một file để tải!');
    return;
  }
  if (fileToDownload && fileToDownload.url) {
    toast(`Đang chuẩn bị tải: ${fileToDownload.name}...`);

    try {
      isProcessing = true;
      const response = await fetch(fileToDownload.url);
      if (!response.ok) throw new Error('Không thể kết nối server');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileToDownload.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast(`Đã tải xong: ${fileToDownload.name}`);
    } catch (error) {
      console.error(error);
      toast('Lỗi khi tải file, thử lại sau nhé og!'); //
    } finally {
      // Đợi 1 chút sau khi tải xong mới mở khóa để tránh panel đóng sầm lại ngay
      setTimeout(() => {
        isProcessing = false;
      }, 500);
    }
  } else {
    toast('Lỗi: Link file không tồn tại!');
  }
}
