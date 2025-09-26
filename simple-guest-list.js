// Script tạo danh sách khách mời đơn giản
// Chạy trong browser console

function createSimpleGuestList() {
    // Tạo 800 mã mời random
    const codes = new Set();
    while (codes.size < 800) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        codes.add(code);
    }
    const inviteCodes = Array.from(codes);
    
    console.log('=== HEADER (Copy dòng này vào A1) ===');
    console.log('STT\tTên khách\tEmail\tSĐT\tMã mời\tNhóm\tĐã RSVP\tSố người đi cùng\tĐăng ký xe\tGhi chú');
    
    console.log('\n=== DATA (Copy từng phần nhỏ) ===');
    
    // Tạo data theo từng phần 50 khách
    for (let i = 0; i < 800; i += 50) {
        console.log(`\n--- Phần ${Math.floor(i/50) + 1} (Khách ${i+1} đến ${Math.min(i+50, 800)}) ---`);
        
        for (let j = i; j < Math.min(i + 50, 800); j++) {
            const guest = [
                j + 1, // STT
                `Khách ${j + 1}`, // Tên khách
                `guest${j + 1}@example.com`, // Email
                `012345678${(j + 1).toString().padStart(2, '0')}`, // SĐT
                inviteCodes[j], // Mã mời
                'Chưa phân loại', // Nhóm
                'No', // Đã RSVP
                '0', // Số người đi cùng
                'No', // Đăng ký xe
                '' // Ghi chú
            ];
            console.log(guest.join('\t'));
        }
    }
    
    console.log('\n=== HƯỚNG DẪN ===');
    console.log('1. Copy header vào A1');
    console.log('2. Copy từng phần data vào các dòng tiếp theo');
    console.log('3. Thay thế tên, email, SĐT bằng thông tin thật');
    console.log('4. Phân loại nhóm');
    
    return inviteCodes;
}

// Chạy function
const codes = createSimpleGuestList();

// Tạo danh sách mã mời cho Google Apps Script
console.log('\n=== MÃ MỜI CHO GOOGLE APPS SCRIPT ===');
console.log('function validateInviteCode(code) {');
console.log('  var validCodes = [');
codes.forEach((code, index) => {
    const comma = index < codes.length - 1 ? ',' : '';
    console.log(`    "${code}"${comma}`);
});
console.log('  ];');
console.log('  return validCodes.includes(code);');
console.log('}');
