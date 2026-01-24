const form = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');

form.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const emailValue = emailInput.value.trim();

    if (!emailValue) {
        alert('Vui lòng nhập địa chỉ email, og ơi!');
        return;
    }

    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerText = "Đang gửi...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://learnpythonsever-sm.onrender.com/auth/tim-mat-khau1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gmail: emailValue })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Server bảo: " + data.message);
            document.getElementById('successModal').style.display = 'flex';
        } else {
            alert("Lỗi: " + (data.message || "Có gì đó sai sai rồi og ơi!"));
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("Không kết nối được với server rồi!");
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// 1. Hàm lấy các tham số từ URL (như gmail và token)
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        gmail: params.get('gmail'),
        token: params.get('token')
    };
}

async function verifyToken() {
    const { gmail, token } = getQueryParams();

    if (!gmail || !token) {
        alert("Link này thiếu thông tin rồi og ơi, kiểm tra lại mail nhé!");
        return;
    }

    try {
        // 2. Gọi API xác thực (Bước 2 của og)
        // URL sẽ có dạng: /auth/tim-mat-khau2?gmail=...&token=...
        const response = await fetch(`https://learnpythonsever-sm.onrender.com/auth/tim-mat-khau2?gmail=${gmail}&token=${token}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log("Xác thực token thành công! Giờ cho phép đổi pass.");
            // Ở đây ông có thể hiện cái form nhập mật khẩu mới lên
            document.getElementById('reset-form-container').style.display = 'block';
        } else {
            alert("Lỗi rồi: " + (data.message || "Token hết hạn hoặc không đúng!"));
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không kết nối được server!");
    }
}

// Chạy hàm xác thực ngay khi vừa load trang này
window.onload = verifyToken;