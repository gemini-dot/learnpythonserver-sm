        document.getElementById("year").textContent = new Date().getFullYear();

        const emailBox = document.getElementById('emailBox');
        const otpBox = document.getElementById('otpBox');
        const emailForm = document.getElementById('emailForm');
        const otpForm = document.getElementById('otpForm');
        const emailInput = document.getElementById('email');
        const displayEmail = document.getElementById('displayEmail');
        const changeEmailBtn = document.getElementById('changeEmail');
        const resendBtn = document.getElementById('resendBtn');
        const timerText = document.querySelector('.timer-text');
        const timerSpan = document.getElementById('timer');

        let countdown;
        let correctOTP = ''; // Mã OTP được tạo

        // Xử lý form nhập email
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput.value;
            
            if (!email) {
                alert('Vui lòng nhập địa chỉ email!');
                return;
            }

            // Tạo mã OTP ngẫu nhiên 4 chữ số
            correctOTP = Math.floor(1000 + Math.random() * 9000).toString();
            console.log('Mã OTP của bạn là: ' + correctOTP); // Trong thực tế sẽ gửi qua email

            // Hiển thị email và chuyển sang form OTP
            displayEmail.textContent = email;
            emailBox.style.display = 'none';
            otpBox.style.display = 'block';

            // Bắt đầu đếm ngược
            startTimer();

            // Tự động focus vào ô đầu tiên
            document.getElementById('otp1').focus();

            alert('Mã xác thực đã được gửi đến email của bạn!\n(Mã demo: ' + correctOTP + ')');
        });

        // Xử lý OTP inputs
        const otpInputs = document.querySelectorAll('.otp-input');
        
        otpInputs.forEach((input, index) => {
            // Chỉ cho phép nhập số
            input.addEventListener('input', function(e) {
                const value = this.value;
                if (!/^\d*$/.test(value)) {
                    this.value = value.replace(/\D/g, '');
                }
                
                // Tự động chuyển sang ô tiếp theo
                if (this.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            // Xử lý phím backspace
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value === '' && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });

            // Xử lý paste
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
                
                pasteData.split('').forEach((char, i) => {
                    if (otpInputs[i]) {
                        otpInputs[i].value = char;
                    }
                });
                
                if (pasteData.length === 4) {
                    otpInputs[3].focus();
                }
            });
        });

        // Xử lý form OTP
        otpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const otp = Array.from(otpInputs).map(input => input.value).join('');
            
            if (otp.length !== 4) {
                alert('Vui lòng nhập đầy đủ mã xác thực!');
                return;
            }

            if (otp === correctOTP) {
                alert('Xác thực thành công! Chuyển đến trang đổi mật khẩu...');
                // Chuyển đến trang đổi mật khẩu
                window.location.href = 'admin_change_password.html';
            } else {
                alert('Mã xác thực không đúng! Vui lòng thử lại.');
                // Xóa các ô input
                otpInputs.forEach(input => input.value = '');
                otpInputs[0].focus();
            }
        });

        // Xử lý nút đổi email
        changeEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearInterval(countdown);
            otpBox.style.display = 'none';
            emailBox.style.display = 'block';
            otpInputs.forEach(input => input.value = '');
        });

        // Xử lý nút gửi lại mã
        resendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Tạo mã OTP mới
            correctOTP = Math.floor(1000 + Math.random() * 9000).toString();
            console.log('Mã OTP mới của bạn là: ' + correctOTP);
            
            alert('Mã xác thực mới đã được gửi!\n(Mã demo: ' + correctOTP + ')');
            
            // Reset timer
            startTimer();
            
            // Xóa các ô input
            otpInputs.forEach(input => input.value = '');
            otpInputs[0].focus();
        });

        // Hàm đếm ngược
        function startTimer() {
            let timeLeft = 60;
            timerSpan.textContent = timeLeft;
            timerText.style.display = 'block';
            resendBtn.style.display = 'none';
            
            clearInterval(countdown);
            
            countdown = setInterval(function() {
                timeLeft--;
                timerSpan.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    timerText.style.display = 'none';
                    resendBtn.style.display = 'inline-block';
                }
            }, 1000);
        }