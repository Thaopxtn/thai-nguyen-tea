# Hướng dẫn đưa website lên Internet miễn phí

Dưới đây là 3 cách phổ biến và miễn phí để đưa website tĩnh (HTML/CSS/JS) của bạn lên mạng.

## Cách 1: Sử dụng Netlify Drop (Đơn giản nhất - Kéo & Thả)
1. Truy cập [Netlify Drop](https://app.netlify.com/drop).
2. Kéo thư mục chứa dự án của bạn (thư mục `thai-nguyen-tea`) thả vào khu vực vòng tròn trên trang web.
3. Website của bạn sẽ được đưa lên mạng ngay lập tức. Bạn có thể đổi tên miền trong phần cài đặt.

## Cách 2: Sử dụng Surge.sh (Qua dòng lệnh)
Đây là cách nhanh chóng nếu bạn thoải mái với việc chạy lệnh.
1. Mở terminal tại thư mục dự án.
2. Chạy lệnh: `npx surge`
3. Nhập email và mật khẩu (lần đầu) để tạo tài khoản miễn phí.
4. Nhấn Enter để xác nhận đường dẫn và tên miền.

## Cách 3: GitHub Pages (Quản lý mã nguồn tốt nhất)
1. Tạo một repository mới trên GitHub.
2. Đẩy mã nguồn của bạn lên repository đó.
3. Vào **Settings** > **Pages**.
4. Chọn nhánh `main` (hoặc `master`) làm nguồn (Source) và lưu lại.
