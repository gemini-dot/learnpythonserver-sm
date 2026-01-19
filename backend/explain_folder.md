. configs/ (Cấu hình hệ thống)
Chức năng: Chứa các thiết lập cố định cho toàn bộ ứng dụng.

Ví dụ: File db_config.py để thiết lập kết nối Database, hoặc settings.py để định nghĩa các hằng số (như thời gian hết hạn của token).

Tại sao cần: Để khi ông cần đổi mật khẩu database hoặc đổi cổng (port) server, ông chỉ cần sửa ở đúng 1 chỗ này thay vì lục tung cả dự án.

2. controllers/ (Bộ não điều khiển)
Chức năng: Tiếp nhận yêu cầu từ người dùng, gọi đến Database (Models) để lấy dữ liệu, xử lý tính toán và trả về kết quả.

Ví dụ: Chức năng đăng nhập sẽ nằm ở đây. Nó lấy username/password khách gửi lên, nhờ Models kiểm tra xem đúng không, rồi báo về cho người dùng.

Nguyên tắc: Controller chỉ nên nói "Làm cái gì", còn "Làm như thế nào" cụ thể thì nên để utils hoặc models lo.

3. middleware/ (Cảnh sát giao thông)
Chức năng: Là các bộ lọc nằm giữa đường đi từ Request đến Controller.

Ví dụ: auth_middleware.py kiểm tra xem người dùng đã đăng nhập chưa. Nếu chưa đăng nhập mà đòi vào trang Admin, middleware sẽ "chặn đứng" và đuổi ra trang Login ngay tại cửa, không cho vào tới Controller.

4. models/ (Dữ liệu & Cấu trúc)
Chức năng: Đại diện cho các bảng trong Database. Nó định nghĩa xem một đối tượng (như User, Password) gồm những thông tin gì (id, username, hashed_password...).

Tại sao cần: Giúp code của ông hiểu được cấu trúc dữ liệu và thực hiện các thao tác Thêm/Sửa/Xóa/Truy vấn vào Database một cách an toàn.

5. routes/ (Người chỉ đường)
Chức năng: Định nghĩa các đường dẫn URL (Endpoint).

Ví dụ: Khi người dùng truy cập vào /login, file route sẽ bảo: "À, đường này thì đi vào login_controller nhé".

Tác dụng: Giúp ông quản lý danh sách các tính năng của Web một cách hệ thống.

6. utils/ (Hòm công cụ)
Chức năng: Chứa các hàm hỗ trợ dùng chung cho toàn bộ dự án (như tôi đã giải thích ở câu trước).

Ví dụ: Hàm băm mật khẩu, hàm gửi email, hàm tạo chuỗi ngẫu nhiên.

7. validators/ (Người gác cổng dữ liệu)
Chức năng: Kiểm tra tính hợp lệ của dữ liệu người dùng gửi lên trước khi cho phép xử lý.

Ví dụ: Người dùng đăng ký tài khoản, validator sẽ kiểm tra: "Email có đúng định dạng không?", "Mật khẩu có đủ 8 ký tự không?". Nếu không đạt, nó trả lỗi luôn, giúp Controller không phải xử lý dữ liệu rác.