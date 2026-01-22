userpass = document.getElementById("password")
useremail = document.getElementById("email")
buttonpass = document.getElementById("dang-nhap")

buttonpass.addEventListener('submit', function(event) { // Nếu là nút bấm thì nên dùng 'click'
    event.preventDefault();

    const lay_gia_tri_pass = userpass.value;
    const lay_gia_tri_user = useremail.value;

    const goi_du_lieu = {
        "gmail": lay_gia_tri_user,
        "password": lay_gia_tri_pass    
    };

    fetch("http://localhost:5000/auth/input-pass", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goi_du_lieu)
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                alert("Đăng nhập thành công! Chào mừng bạn quay trở lại.");
                window.location.href = "../../../view/upload/index.html"
            });
        } 
        else if (response.status === 401) {
            // Nếu là 401, Flask đang báo sai mật khẩu
            return response.json().then(data => {
                alert("Thất bại: " + (data.message || "Sai tài khoản hoặc mật khẩu!"));
            });
        } 
        else {
            // Các mã lỗi khác như 500, 404...
            alert("Lỗi hệ thống: Mã lỗi " + response.status);
        }
    })
    .catch(error => {
        console.error("Lỗi kết nối mạng rồi bạn ơi:", error);
    });
});

