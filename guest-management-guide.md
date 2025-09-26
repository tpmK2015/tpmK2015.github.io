# Hướng dẫn tạo Google Sheet quản lý khách mời (1 sheet duy nhất)

## Bước 1: Tạo Google Sheet
1. Truy cập https://sheets.google.com
2. Tạo sheet mới với tên "Wedding Guest List"
3. Tạo các cột header như sau:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| STT | Tên khách | Email | SĐT | Mã mời | Nhóm | Đã RSVP | Số người đi cùng | Đăng ký xe | Ghi chú |
| 1 | Nguyễn Văn A | a@email.com | 0123456789 | 123456 | Gia đình | No | 0 | No | |
| 2 | Trần Thị B | b@email.com | 0987654321 | 234567 | Bạn bè | Yes | 2 | Yes | |

## Bước 2: Import danh sách khách mời
1. Copy danh sách 800 khách mời của bạn
2. Paste vào Google Sheet
3. Đảm bảo mỗi khách có mã mời riêng
4. Cột "Đã RSVP" để mặc định là "No"

## Bước 3: Cập nhật Google Apps Script
Script sẽ tự động cập nhật cột "Đã RSVP" và "Số người đi cùng" khi khách RSVP

## Bước 4: Test hệ thống
1. Mở website
2. Thử RSVP với mã mời hợp lệ
3. Kiểm tra Google Sheet có cập nhật không

## Bước 5: Phân phối mã mời
Có thể gửi mã mời qua:
- Email tự động
- SMS/WhatsApp  
- Thiệp mời in sẵn
- QR Code
