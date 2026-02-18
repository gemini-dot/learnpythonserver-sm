function sortFiles(criteria) {
  switch (criteria) {
    case 'name-asc':
      sampleFiles.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'date-desc':
      // Giả sử date format là DD/MM/YYYY
      sampleFiles.sort((a, b) => {
        const parseDate = (d) => new Date(d.split('/').reverse().join('-'));
        return parseDate(b.date) - parseDate(a.date);
      });
      break;
    case 'size-desc':
      // Hàm phụ để đổi "MB", "KB" về số byte để so sánh
      const parseSize = (s) => {
        const num = parseFloat(s);
        if (s.includes('GB')) return num * 1024 * 1024 * 1024;
        if (s.includes('MB')) return num * 1024 * 1024;
        if (s.includes('KB')) return num * 1024;
        return num;
      };
      sampleFiles.sort((a, b) => parseSize(b.size) - parseSize(a.size));
      break;
    case 'type-asc':
      sampleFiles.sort((a, b) => a.type.localeCompare(b.type));
      break;
  }

  renderFiles(); // Vẽ lại giao diện sau khi sắp xếp
  toast(`Đã sắp xếp theo: ${criteria}`);
}
