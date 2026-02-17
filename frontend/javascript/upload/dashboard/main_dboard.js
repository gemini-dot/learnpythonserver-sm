// ─── DATA ─────────────────────────────────────────────────────────
const sampleFiles = [
  {
    id: 1,
    name: 'brand-identity.png',
    type: 'img',
    ext: 'PNG',
    size: '4.2 MB',
    date: '17/02/2026',
    res: '3840×2160',
    emoji: '🖼️',
    thumb: '#f0ece8',
  },
  {
    id: 2,
    name: 'report-2025.pdf',
    type: 'pdf',
    ext: 'PDF',
    size: '2.8 MB',
    date: '16/02/2026',
    res: 'A4 / 12 tr',
    emoji: '📄',
    thumb: '#f0f0ed',
  },
  {
    id: 3,
    name: 'demo-reel.mp4',
    type: 'vid',
    ext: 'MP4',
    size: '128 MB',
    date: '15/02/2026',
    res: '1920×1080',
    emoji: '🎬',
    thumb: '#e8ecf0',
  },
  {
    id: 4,
    name: 'source-code.zip',
    type: 'zip',
    ext: 'ZIP',
    size: '18.4 MB',
    date: '14/02/2026',
    res: '—',
    emoji: '📦',
    thumb: '#ede8f0',
  },
  {
    id: 5,
    name: 'proposal.docx',
    type: 'doc',
    ext: 'DOCX',
    size: '0.9 MB',
    date: '13/02/2026',
    res: '—',
    emoji: '📝',
    thumb: '#eef0e8',
  },
  {
    id: 6,
    name: 'cover-photo.jpg',
    type: 'img',
    ext: 'JPG',
    size: '6.1 MB',
    date: '12/02/2026',
    res: '4096×2048',
    emoji: '🖼️',
    thumb: '#f0ece8',
  },
  {
    id: 7,
    name: 'data-export.xlsx',
    type: 'doc',
    ext: 'XLSX',
    size: '1.4 MB',
    date: '11/02/2026',
    res: '—',
    emoji: '📊',
    thumb: '#eef0e8',
  },
  {
    id: 8,
    name: 'presentation.pptx',
    type: 'doc',
    ext: 'PPTX',
    size: '22 MB',
    date: '10/02/2026',
    res: '—',
    emoji: '📋',
    thumb: '#eef0e8',
  },
  {
    id: 9,
    name: 'background.mp4',
    type: 'vid',
    ext: 'MP4',
    size: '256 MB',
    date: '09/02/2026',
    res: '3840×2160',
    emoji: '🎬',
    thumb: '#e8ecf0',
  },
  {
    id: 10,
    name: 'logo-final.svg',
    type: 'img',
    ext: 'SVG',
    size: '0.3 MB',
    date: '08/02/2026',
    res: 'Scalable',
    emoji: '🎨',
    thumb: '#f0ece8',
  },
  {
    id: 11,
    name: 'backup-files.tar',
    type: 'zip',
    ext: 'TAR',
    size: '512 MB',
    date: '07/02/2026',
    res: '—',
    emoji: '📦',
    thumb: '#ede8f0',
  },
  {
    id: 12,
    name: 'invoice-q4.pdf',
    type: 'pdf',
    ext: 'PDF',
    size: '1.1 MB',
    date: '06/02/2026',
    res: 'A4 / 4 tr',
    emoji: '📄',
    thumb: '#f0f0ed',
  },
];

let files = [...sampleFiles];
let selectedId = null;
let viewMode = 'grid';

// ─── SIDEBAR / PANEL STATE ────────────────────────────────────────
const app = document.getElementById('app');
const sidebar = document.getElementById('sidebar');
const panel = document.getElementById('panel');

let leftOpen = false;
let rightOpen = false;
let leftCloseTimer, rightCloseTimer;
const CLOSE_DELAY = 180; // ms chờ trước khi đóng, tránh giật khi di nhanh

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
panel.addEventListener('mouseleave', closeRight);

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
  container.innerHTML = '';

  if (viewMode === 'grid') {
    container.className = 'file-grid';
    files.forEach((f, i) => {
      const div = document.createElement('div');
      div.className = 'file-card' + (selectedId === f.id ? ' selected' : '');
      div.style.animationDelay = i * 0.04 + 's';
      div.innerHTML = `
        <div class="file-thumb type-${f.type}" style="background:${f.thumb}">
          <span style="font-size:32px">${f.emoji}</span>
        </div>
        <div class="file-name" title="${f.name}">${f.name}</div>
        <div class="file-meta">${f.ext} · ${f.size}</div>
      `;
      div.onclick = () => selectFile(f.id);
      container.appendChild(div);
    });
  } else {
    container.className = 'file-list';
    files.forEach((f, i) => {
      const div = document.createElement('div');
      div.className = 'file-row' + (selectedId === f.id ? ' selected' : '');
      div.style.animationDelay = i * 0.03 + 's';
      div.innerHTML = `
        <div class="row-icon" style="background:${f.thumb}">${f.emoji}</div>
        <div class="row-name">${f.name}</div>
        <div class="row-type">${f.ext}</div>
        <div class="row-size">${f.size}</div>
        <div class="row-date">${f.date}</div>
      `;
      div.onclick = () => selectFile(f.id);
      container.appendChild(div);
    });
  }

  updateSelCount();
}

// ─── SELECT FILE ──────────────────────────────────────────────────
function selectFile(id) {
  selectedId = selectedId === id ? null : id;
  renderFiles();

  const f = files.find((x) => x.id === id);
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

  panelEmpty.style.display = 'none';
  panelContent.style.display = 'flex';
  panelActions.style.display = 'flex';

  document.getElementById('panelTitle').textContent = 'Chi tiết file';
  document.getElementById('panelSub').textContent = f.ext + ' · ' + f.size;
  document.getElementById('previewThumb').innerHTML =
    `<span style="font-size:60px">${f.emoji}</span>`;
  document.getElementById('previewThumb').style.background = f.thumb;
  document.getElementById('detName').textContent = f.name;
  document.getElementById('detType').textContent = f.ext;
  document.getElementById('detSize').textContent = f.size;
  document.getElementById('detDate').textContent = f.date;
  document.getElementById('detRes').textContent = f.res;
  document.getElementById('detPath').textContent = '/vault/uploads/' + f.name;

  // Mở panel phải khi chọn file (nếu đang đóng)
  if (!rightOpen) openRight();
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

// ─── NAV ──────────────────────────────────────────────────────────
function setNav(el) {
  document
    .querySelectorAll('.nav-item')
    .forEach((e) => e.classList.remove('active'));
  el.classList.add('active');
}

// ─── SELECTION COUNT ──────────────────────────────────────────────
function updateSelCount() {
  const sel = selectedId ? 1 : 0;
  document.getElementById('selCount').textContent = sel
    ? `${sel} file đã chọn`
    : `${files.length} file`;
  document.getElementById('deleteSelBtn').style.display = sel ? 'flex' : 'none';
}

function deleteSelected() {
  if (!selectedId) return;
  files = files.filter((f) => f.id !== selectedId);
  selectedId = null;
  renderFiles();
  selectFile(null);
  toast('Đã xóa file');
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
      files.unshift({
        ...item,
        id: Date.now() + i,
        date: new Date().toLocaleDateString('vi-VN'),
      });
      renderFiles();
      toast(`✓ ${item.name} đã tải lên`);
    }, i * 600);
  });
}

// ─── DRAG & DROP ──────────────────────────────────────────────────
const dropzone = document.getElementById('dropzone');
['dragenter', 'dragover'].forEach((ev) => {
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
});
['dragleave', 'drop'].forEach((ev) => {
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
  });
});
dropzone.addEventListener('drop', (e) => {
  const f = e.dataTransfer.files;
  if (f.length) {
    openModal();
    handleFiles(f);
  }
});

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

// ─── INIT ─────────────────────────────────────────────────────────
renderFiles();
