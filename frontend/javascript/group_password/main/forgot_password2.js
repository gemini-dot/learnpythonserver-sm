import { showToast } from '../../popup/popup.js';

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        gmail: params.get('gmail'),
        token: params.get('token')
    };
}

async function verifyToken() {
    const { gmail, token } = getQueryParams();

    if (!gmail && !token) {
        return; 
    }

    if (!gmail || !token) {
        showToast('error', 'Liên kết không hợp lệ.');
        return;
    }
    showToast('info', 'Đang xác thực liên kết...');
    try {
        const response = await fetch(`https://learnpythonsever-sm.onrender.com/auth/tim-mat-khau2?gmail=${gmail}&token=${token}`, {
            method: 'GET' 
        });
        
        const data = await response.json();

        if (response.ok && data.success) {
            console.log("Xác thực token thành công! Giờ cho phép đổi pass.");
            window.location.href = 'create_new_pass.html?gmail=' + encodeURIComponent(gmail) + '&token=' + encodeURIComponent(token);
        } else {
            showToast('error', "Lỗi rồi: " + (data.message || "Token hết hạn hoặc không đúng!"));
        }
    } catch (error) {
        console.error("Lỗi:", error);
        showToast('error', "Không kết nối được server!");
    }
}
window.onload = verifyToken;