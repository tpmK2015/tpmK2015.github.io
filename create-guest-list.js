// Script tạo danh sách khách mời với mã mời
// Chạy trong browser console để tạo CSV

function createGuestList() {
    // Tạo 800 mã mời random
    const codes = new Set();
    while (codes.size < 800) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        codes.add(code);
    }
    const inviteCodes = Array.from(codes);
    
    // Tạo danh sách khách mời
    const guestList = [];
    
    // Header
    guestList.push('STT,Tên khách,Email,SĐT,Mã mời,Nhóm,Đã RSVP,Số người đi cùng,Đăng ký xe,Ghi chú');
    
    // Tạo 800 khách mời
    for (let i = 1; i <= 800; i++) {
        const guest = [
            i, // STT
            `Khách ${i}`, // Tên khách (bạn sẽ thay bằng tên thật)
            `guest${i}@example.com`, // Email (bạn sẽ thay bằng email thật)
            `012345678${i.toString().padStart(2, '0')}`, // SĐT (bạn sẽ thay bằng SĐT thật)
            inviteCodes[i-1], // Mã mời
            'Chưa phân loại', // Nhóm
            'No', // Đã RSVP
            '0', // Số người đi cùng
            'No', // Đăng ký xe
            '' // Ghi chú
        ];
        guestList.push(guest.join(','));
    }
    
    return guestList.join('\n');
}

// Chạy function và in ra CSV
const csvData = createGuestList();
console.log(csvData);

// Tạo file download
function downloadCSV() {
    const csvData = createGuestList();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guest-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

console.log('\n=== HƯỚNG DẪN ===');
console.log('1. Copy toàn bộ CSV data ở trên');
console.log('2. Mở Google Sheets');
console.log('3. Paste vào sheet');
console.log('4. Hoặc chạy downloadCSV() để tải file CSV');
console.log('5. Thay thế "Khách 1", "Khách 2"... bằng tên thật');
console.log('6. Thay thế email và SĐT bằng thông tin thật');
console.log('7. Phân loại nhóm (Gia đình, Bạn bè, Đồng nghiệp...)');
