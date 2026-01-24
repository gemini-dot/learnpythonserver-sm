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
        alert("Link này thiếu thông tin rồi bạn ơi, kiểm tra lại mail nhé!");
        return;
    }

    try {
        const response = await fetch(`https://learnpythonsever-sm.onrender.com/auth/tim-mat-khau2?gmail=${gmail}&token=${token}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log("Xác thực token thành công! Giờ cho phép đổi pass.");
            document.getElementById('reset-form-container').style.display = 'block';
        } else {
            alert("Lỗi rồi: " + (data.message || "Token hết hạn hoặc không đúng!"));
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không kết nối được server!");
    }
}
window.onload = verifyToken;