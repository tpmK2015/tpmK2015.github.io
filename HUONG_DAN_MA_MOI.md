# 🎫 Hướng Dẫn Sử Dụng Hệ Thống Mã Mời

## 📋 Tổng Quan

Hệ thống mã mời thông minh giúp khách mời chỉ thấy sự kiện họ được mời, tránh nhầm lẫn hoàn toàn.

---

## 🔗 Cách Sử Dụng

### 1. **Mời Khách Đến Tiệc Nhà Gái (19/12/2025)**

Gửi link này cho khách:
```
https://yourwebsite.com?invite=BRIDE19
```

**Khách sẽ thấy:**
- ✅ Chỉ hiển thị sự kiện "Tiệc Cưới Nhà Nữ" - Thứ Sáu, 19/12/2025, 16:30
- ✅ Countdown đếm ngược đến ngày 19/12
- ✅ Card sự kiện được highlight màu vàng
- ✅ Text mời rõ ràng: "Vào ngày Thứ Sáu, 19 tháng 12..."

---

### 2. **Mời Khách Đến Lễ Thành Hôn & Tiệc Nhà Nam (21/12/2025)**

Gửi link này cho khách:
```
https://yourwebsite.com?invite=GROOM21
```

**Khách sẽ thấy:**
- ✅ Hiển thị 2 sự kiện ngày 21/12:
  - Lễ Thành Hôn - 09:00
  - Tiệc Cưới Nhà Nam - 10:00
- ✅ Countdown đếm ngược đến ngày 21/12
- ✅ Cards được highlight màu xanh và tím
- ✅ Text mời rõ ràng: "Vào ngày Chủ Nhật, 21 tháng 12..."

---

### 3. **Link Mặc Định (Không Có Mã)**

Nếu truy cập không có mã:
```
https://yourwebsite.com
```

**Sẽ tự động chuyển thành:**
```
https://yourwebsite.com?invite=BRIDE19
```

Mặc định hiển thị sự kiện ngày 19/12.

---

## 🎨 Tính Năng

### ✨ Countdown Timer
- Hiển thị đếm ngược với **thứ trong tuần** rõ ràng
- Tự động chọn sự kiện phù hợp với mã mời
- Ẩn tabs chuyển đổi khi chỉ có 1 sự kiện

### 🎯 Event Cards
- Tự động ẩn sự kiện không liên quan
- Highlight border cho sự kiện được mời
- Layout tự động điều chỉnh (1 card = center, 2 cards = rộng hơn)

### 📱 Responsive
- Hoạt động tốt trên mọi thiết bị
- Mobile-friendly

---

## 💡 Ví Dụ Thực Tế

### Kịch bản 1: Bạn bè nhà gái
```
Gửi SMS/Zalo:
"Mời bạn đến dự tiệc cưới của Trung & Thư
📅 Thứ Sáu, 19/12/2025 lúc 16:30
📍 Tam Xuân 2, Núi Thành
🔗 Chi tiết: https://yourwebsite.com?invite=BRIDE19"
```

### Kịch bản 2: Bạn bè nhà trai
```
Gửi SMS/Zalo:
"Mời bạn đến dự lễ cưới của Trung & Thư
📅 Chủ Nhật, 21/12/2025 từ 09:00
📍 Tam Anh Nam, Núi Thành
🔗 Chi tiết: https://yourwebsite.com?invite=GROOM21"
```

---

## 🔧 Tùy Chỉnh (Nếu Cần)

### Thêm mã mời mới
Mở file `index.html`, tìm function `filterEventCards()` và thêm logic:

```javascript
if (inviteCode.includes('CUSTOM_CODE')) {
    // Logic của bạn
}
```

### Thay đổi mã mặc định
Tìm dòng:
```javascript
const inviteCode = urlParams.get('invite') || 'BRIDE19';
```

Đổi `'BRIDE19'` thành mã bạn muốn.

---

## ✅ Checklist Trước Khi Gửi

- [ ] Test link BRIDE19 - chỉ thấy sự kiện 19/12
- [ ] Test link GROOM21 - chỉ thấy sự kiện 21/12
- [ ] Test link không mã - hiển thị mặc định
- [ ] Kiểm tra countdown hiển thị đúng thứ
- [ ] Kiểm tra trên mobile

---

## 🎉 Kết Quả

✨ **Không còn nhầm lẫn!** Mỗi khách chỉ thấy sự kiện họ được mời.

🎯 **Chuyên nghiệp!** Giống các website cưới cao cấp.

💝 **Dễ sử dụng!** Chỉ cần copy link và gửi.
