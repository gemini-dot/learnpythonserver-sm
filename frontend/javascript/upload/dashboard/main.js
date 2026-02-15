// Generate background particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 15 + 's';
  particle.style.animationDuration = Math.random() * 10 + 10 + 's';
  particlesContainer.appendChild(particle);
}

// View toggle
let currentView = 'grid';

function setGridView() {
  currentView = 'grid';
  document.getElementById('filesGrid').classList.add('active');
  document.getElementById('filesList').classList.remove('active');
  document.querySelectorAll('.view-btn')[0].classList.add('active');
  document.querySelectorAll('.view-btn')[1].classList.remove('active');
}

function setListView() {
  currentView = 'list';
  document.getElementById('filesGrid').classList.remove('active');
  document.getElementById('filesList').classList.add('active');
  document.querySelectorAll('.view-btn')[0].classList.remove('active');
  document.querySelectorAll('.view-btn')[1].classList.add('active');
}

function toggleView() {
  if (currentView === 'grid') {
    setListView();
  } else {
    setGridView();
  }
}

// File selection
function toggleSelect(checkbox) {
  event.stopPropagation();
  checkbox.classList.toggle('checked');
}

// Filter files
function filterFiles(type) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => btn.classList.remove('active'));
  event.target.classList.add('active');

  const fileCards = document.querySelectorAll('.file-card, .file-row');
  fileCards.forEach((card) => {
    if (type === 'all' || card.dataset.type === type) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const fileCards = document.querySelectorAll('.file-card, .file-row');

  fileCards.forEach((card) => {
    const fileName = card
      .querySelector('.file-name, .file-row-name')
      .textContent.toLowerCase();
    if (fileName.includes(searchTerm)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
});

// Upload modal
function openUploadModal() {
  document.getElementById('uploadModal').classList.add('active');
}

function closeUploadModal() {
  document.getElementById('uploadModal').classList.remove('active');
}

// Close modal on outside click
document.getElementById('uploadModal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeUploadModal();
  }
});

// Drag and drop
const uploadArea = document.querySelector('.upload-area');

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.6)';
  uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
  uploadArea.style.background = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
  uploadArea.style.background = 'transparent';

  const files = e.dataTransfer.files;
  console.log('Files dropped:', files);
  alert(`Đã chọn ${files.length} file`);
});

// File input change
document.getElementById('fileInput').addEventListener('change', function (e) {
  const files = e.target.files;
  console.log('Files selected:', files);
  alert(`Đã chọn ${files.length} file`);
});
