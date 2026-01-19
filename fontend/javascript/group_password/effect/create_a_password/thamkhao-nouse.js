        function togglePassword(inputId) {
            const passwordInput = document.getElementById(inputId);
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        }

        // Kiểm tra độ mạnh mật khẩu
        document.getElementById('password').addEventListener('input', function(e) {
            const password = e.target.value;
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;
            
            const widths = ['0%', '25%', '50%', '75%', '100%'];
            const colors = ['#ff4444', '#ff8800', '#ffbb00', '#88cc00', '#00cc44'];
            const texts = ['', 'Yếu', 'Trung bình', 'Khá tốt', 'Mạnh'];
            
            strengthFill.style.width = widths[strength];
            strengthFill.style.backgroundColor = colors[strength];
            strengthText.textContent = texts[strength] || 'Độ mạnh mật khẩu';
        });

        function handleSignup() {
            const firstname = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            if (!firstname || !lastname || !email || !password || !confirmPassword) {
                alert('Vui lòng điền đầy đủ thông tin');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp');
                return;
            }
            
            if (!terms) {
                alert('Vui lòng đồng ý với điều khoản dịch vụ');
                return;
            }
            
            alert('Đăng ký thành công! Chào mừng ' + firstname + ' ' + lastname);
        }