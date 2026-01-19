function handleResetPassword() {
    const email = document.getElementById('email').value;    
    if (email) {
        document.getElementById('successModal').style.display = 'flex';
    } else {
        alert('Vui lòng nhập địa chỉ email');
    }
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

function goBack() {
    // Điều hướng về trang đăng nhập
    window.location.href = "input_pass.html";
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}