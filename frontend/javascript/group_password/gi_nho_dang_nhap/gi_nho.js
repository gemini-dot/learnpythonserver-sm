const loginForm = document.getElementById('dang-nhap');

loginForm.addEventListener('submit', function (event) {
  let isRemember = document.getElementById('remember').checked;
  let emailValue = document.querySelector('input[type="email"]').value;

  if (isRemember) {
    localStorage.setItem('saved_email', emailValue);
    localStorage.setItem('remember_status', 'true');
  } else {
    localStorage.removeItem('saved_email');
    localStorage.removeItem('remember_status');
  }
});

window.onload = function () {
  let savedEmail = localStorage.getItem('saved_email');
  let status = localStorage.getItem('remember_status');

  if (status === 'true' && savedEmail) {
    document.querySelector('input[type="email"]').value = savedEmail;
    document.getElementById('remember').checked = true;
  }
};
