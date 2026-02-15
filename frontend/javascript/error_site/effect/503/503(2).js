function toggleForm() {
  const form = document.getElementById('contact-form');
  form.classList.toggle('active');
}

function sendMail() {
  const content = document.querySelector('textarea').value;
  if (content.trim() === '') {
    alert('Og chưa nhập gì mà!');
    return;
  }
  // Giả lập gửi mail thành công
  alert('Đã gửi nội dung: ' + content + '\n(Tui sẽ phản hồi sớm nhất nhé!)');
  document.querySelector('textarea').value = '';
  toggleForm();
}
