# Hướng dẫn Setup Website Cưới

## 1. Setup Google Sheets & Apps Script

### Bước 1: Tạo Google Sheet
1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo sheet mới với tên "Wedding RSVP"
3. Tạo header với các cột:
   - A1: Thời gian
   - B1: Tên  
   - C1: Email
   - D1: Số người đi cùng
   - E1: Mã mời

### Bước 2: Tạo Google Apps Script
1. Trong Google Sheet, vào `Tools > Script Editor`
2. Copy toàn bộ code từ file `google-apps-script.js`
3. Thay đổi `TO_ADDRESS` thành email của bạn
4. Thay đổi các mã mời trong function `validateInviteCode()`
5. Lưu project với tên "Wedding RSVP Handler"

### Bước 3: Deploy Web App
1. Trong Script Editor, click `Deploy > New Deployment`
2. Chọn type: `Web app`
3. Execute as: `Me`
4. Who has access: `Anyone`
5. Click `Deploy`
6. Copy URL được tạo ra

### Bước 4: Cập nhật Website
1. Mở file `js/scripts.js`
2. Tìm dòng: `var scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';`
3. Thay `YOUR_SCRIPT_ID` bằng URL từ bước 3

## 2. Setup Uber Integration

### Bước 1: Tạo Uber App
1. Truy cập [Uber Developer](https://developer.uber.com)
2. Tạo app mới
3. Copy `Client ID`

### Bước 2: Cập nhật Website
1. Mở file `index.html`
2. Tìm dòng: `client_id=YOUR_UBER_CLIENT_ID`
3. Thay `YOUR_UBER_CLIENT_ID` bằng Client ID từ bước 1

## 3. Setup Google Maps

### Bước 1: Lấy Google Maps API Key
1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project hiện có
3. Enable `Maps JavaScript API`
4. Tạo API Key
5. Restrict API Key (optional nhưng recommended)

### Bước 2: Cập nhật Website
1. Mở file `index.html`
2. Tìm dòng: `src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlPw3GQYI3faa_9mRE6plWuM7xNEmrwH0&callback=initMap"`
3. Thay API key bằng key của bạn

## 4. Customization

### Thay đổi mã mời
1. Trong Google Apps Script, sửa array `validCodes`
2. Trong `js/scripts.js`, sửa array `validCodes` tương ứng

### Thay đổi thông tin liên hệ
1. Sửa số điện thoại trong `index.html`
2. Sửa email trong Google Apps Script

### Thay đổi địa điểm
1. Cập nhật tọa độ trong `js/scripts.js` (function `initMap()`)
2. Cập nhật địa chỉ trong Uber link
3. Cập nhật thông tin trong calendar events

## 5. Deploy Website

### Option 1: GitHub Pages (Free)
1. Tạo repository trên GitHub
2. Upload toàn bộ code
3. Vào Settings > Pages
4. Chọn source: `Deploy from a branch`
5. Chọn branch: `main`
6. Website sẽ có URL: `https://username.github.io/repository-name`

### Option 2: Netlify (Free)
1. Truy cập [Netlify](https://netlify.com)
2. Drag & drop folder project
3. Website sẽ có URL ngẫu nhiên
4. Có thể setup custom domain

## 6. Testing

### Test RSVP System
1. Mở website
2. Điền form RSVP với mã mời hợp lệ
3. Kiểm tra Google Sheet có data mới không
4. Kiểm tra email thông báo

### Test Calendar
1. Click các button "Add to Calendar"
2. Kiểm tra events được tạo đúng không

### Test Maps & Uber
1. Click "Xem bản đồ"
2. Click "Đặt Uber" để test deep link

## Troubleshooting

### RSVP không hoạt động
- Kiểm tra URL Google Apps Script
- Kiểm tra permissions của Google Apps Script
- Kiểm tra console browser để xem lỗi

### Maps không hiển thị
- Kiểm tra API Key Google Maps
- Kiểm tra billing account (nếu cần)

### Uber link không hoạt động
- Kiểm tra Client ID
- Test trên mobile device (Uber app cần có trên device)
