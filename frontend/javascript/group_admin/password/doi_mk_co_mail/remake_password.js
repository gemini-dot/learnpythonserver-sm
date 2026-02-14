        document.getElementById("year").textContent = new Date().getFullYear();

        // Password validation
        const newPassword = document.getElementById('newPassword');
        const requirements = {
            length: document.getElementById('length'),
            uppercase: document.getElementById('uppercase'),
            lowercase: document.getElementById('lowercase'),
            number: document.getElementById('number'),
            special: document.getElementById('special')
        };

        newPassword.addEventListener('input', function() {
            const value = this.value;
            
            // Check length
            if (value.length >= 8) {
                requirements.length.classList.add('valid');
            } else {
                requirements.length.classList.remove('valid');
            }
            
            // Check uppercase
            if (/[A-Z]/.test(value)) {
                requirements.uppercase.classList.add('valid');
            } else {
                requirements.uppercase.classList.remove('valid');
            }
            
            // Check lowercase
            if (/[a-z]/.test(value)) {
                requirements.lowercase.classList.add('valid');
            } else {
                requirements.lowercase.classList.remove('valid');
            }
            
            // Check number
            if (/[0-9]/.test(value)) {
                requirements.number.classList.add('valid');
            } else {
                requirements.number.classList.remove('valid');
            }
            
            // Check special character
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                requirements.special.classList.add('valid');
            } else {
                requirements.special.classList.remove('valid');
            }
        });

        // Form submission
        document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const current = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;
            
            // Check if new passwords match
            if (newPass !== confirm) {
                alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
                return;
            }
            
            // Check password requirements
            const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(newPass);
            
            if (!isValid) {
                alert('Mật khẩu mới không đáp ứng đủ yêu cầu!');
                return;
            }
            
            // If all validations pass
            alert('Mật khẩu đã được cập nhật thành công!');
            // Here you would typically send the data to your server
            // window.location.href = 'admin_dashboard.html';
        });