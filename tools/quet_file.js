const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://gemini-dot.github.io/learnpythonserver-sm';
const ROOT_PROJECT = path.join(__dirname, '..'); // Quay lại thư mục gốc dự án

// Những thư mục "cấm cửa" - không quét vào đây để tránh file rác
const ignoreDirs = ['node_modules', '.git', 'venv', 'backend', 'tools'];

console.log(
  '--- 🗺️  Node.js đang tổng tiến công quét toàn bộ file HTML... ---'
);

function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Nếu không nằm trong danh sách cấm thì mới chui vào quét tiếp
      if (!ignoreDirs.includes(file)) {
        getAllHtmlFiles(fullPath, arrayOfFiles);
      }
    } else {
      // Chỉ lấy file .html
      if (path.extname(file) === '.html') {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllHtmlFiles(ROOT_PROJECT);

// Bắt đầu tạo nội dung XML
let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

allFiles.forEach((filePath) => {
  // Biến đường dẫn file trên máy thành đường dẫn web
  const relativePath = path
    .relative(ROOT_PROJECT, filePath)
    .replace(/\\/g, '/');
  const url = `${BASE_URL}/${relativePath}`;

  const stats = fs.statSync(filePath);
  const lastMod = stats.mtime.toISOString().split('T')[0];

  xmlContent += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.8</priority>
  </url>`;
});

xmlContent += '\n</urlset>';

// Ghi file sitemap.xml ra thư mục gốc
try {
  const outputPath = path.join(ROOT_PROJECT, 'sitemap.xml');
  fs.writeFileSync(outputPath, xmlContent);
  console.log(
    `✅ Thành công! Đã tìm thấy TẤT CẢ ${allFiles.length} file HTML và tạo Sitemap.`
  );
} catch (err) {
  console.error('Lỗi ghi file sitemap rồi og:', err);
}
