        // Lấy token từ URL (được chuyển từ trang verify code)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        
        // Kiểm tra token khi load trang
        window.addEventListener('DOMContentLoaded', function() {
            if (!token) {
                alert('Liên kết không hợp lệ. Vui lòng thử lại.');
                window.location.href = 'forgot-password.html';
                return;
            }
            
            console.log('Reset password for:', email);
            console.log('With token:', token);
        });
        
        // Toggle password visibility
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const button = event.currentTarget;
            const icon = button.querySelector('.eye-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `;
            } else {
                input.type = 'password';
                icon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
            }
        }
        
        // Kiểm tra yêu cầu mật khẩu
        const requirements = {
            length: { regex: /.{8,}/, element: 'req-length' },
            uppercase: { regex: /[A-Z]/, element: 'req-uppercase' },
            lowercase: { regex: /[a-z]/, element: 'req-lowercase' },
            number: { regex: /[0-9]/, element: 'req-number' },
            special: { regex: /[!@#$%^&*(),.?":{}|<>]/, element: 'req-special' }
        };
        
        document.getElementById('password').addEventListener('input', function(e) {
            const password = e.target.value;
            let metRequirements = 0;
            
            // Kiểm tra từng yêu cầu
            for (const [key, req] of Object.entries(requirements)) {
                const element = document.getElementById(req.element);
                const icon = element.querySelector('.req-icon');
                
                if (req.regex.test(password)) {
                    element.classList.add('met');
                    icon.innerHTML = '<polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>';
                    metRequirements++;
                } else {
                    element.classList.remove('met');
                    icon.innerHTML = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>';
                }
            }
            
            // Cập nhật thanh độ mạnh
            updateStrengthBar(metRequirements);
            
            // Kiểm tra khớp với confirm password
            checkPasswordMatch();
        });
        
        function updateStrengthBar(metRequirements) {
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            
            const percentage = (metRequirements / 5) * 100;
            const colors = ['#ff4444', '#ff8800', '#ffbb00', '#88cc00', '#00cc44'];
            const texts = ['Rất yếu', 'Yếu', 'Trung bình', 'Khá tốt', 'Mạnh'];
            const colorIndex = Math.min(Math.floor(percentage / 20), 4);
            
            strengthFill.style.width = percentage + '%';
            strengthFill.style.backgroundColor = colors[colorIndex];
            strengthText.textContent = texts[colorIndex] || 'Độ mạnh mật khẩu';
        }
        
        document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);
        
        function checkPasswordMatch() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const matchStatus = document.getElementById('matchStatus');
            
            if (!confirmPassword) {
                matchStatus.innerHTML = '';
                return;
            }
            
            if (password === confirmPassword) {
                matchStatus.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00cc44" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style="color: #00cc44;">Mật khẩu khớp</span>
                `;
            } else {
                matchStatus.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span style="color: #ff4444;">Mật khẩu không khớp</span>
                `;
            }
        }
        
        function handleSubmit(event) {
            event.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Kiểm tra tất cả yêu cầu
            let allRequirementsMet = true;
            for (const req of Object.values(requirements)) {
                if (!req.regex.test(password)) {
                    allRequirementsMet = false;
                    break;
                }
            }
            
            if (!allRequirementsMet) {
                alert('Vui lòng đảm bảo mật khẩu đáp ứng tất cả yêu cầu');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp');
                return;
            }
            
            // Disable button và hiển thị loading
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                <span>Đang xử lý...</span>
            `;
            
            // Gọi API để reset password
            fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Hiển thị modal thành công
                    document.getElementById('successModal').style.display = 'flex';
                } else {
                    alert(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `
                        <span>Đặt lại mật khẩu</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Không thể kết nối đến server. Vui lòng thử lại sau.');
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span>Đặt lại mật khẩu</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
            });
        }
        
        function redirectToLogin() {
            window.location.href = 'login.html';
        }
        
        // Đóng modal khi click bên ngoài
        window.onclick = function(event) {
            const modal = document.getElementById('successModal');
            if (event.target == modal) {
                redirectToLogin();
            }
        }
        
        // Prevent back button sau khi reset thành công
        window.addEventListener('popstate', function(event) {
            if (document.getElementById('successModal').style.display === 'flex') {
                event.preventDefault();
                redirectToLogin();
            }
        });