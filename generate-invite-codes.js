// Script tạo 800 mã mời random
// Chạy trong browser console hoặc Node.js

function generateInviteCodes(count = 800) {
    const codes = new Set(); // Dùng Set để tránh trùng lặp
    const validCodes = [];
    
    while (codes.size < count) {
        // Tạo mã 6 số random
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        if (!codes.has(code)) {
            codes.add(code);
            validCodes.push(code);
        }
    }
    
    return validCodes;
}

// Tạo 800 mã mời
const inviteCodes = generateInviteCodes(800);

// In ra console để copy
console.log('// Mã mời cho 800 khách:');
console.log('var validCodes = [');
inviteCodes.forEach((code, index) => {
    const comma = index < inviteCodes.length - 1 ? ',' : '';
    console.log(`    "${code}"${comma}`);
});
console.log('];');

// Tạo array cho Google Apps Script
console.log('\n// Cho Google Apps Script:');
console.log('function validateInviteCode(code) {');
console.log('  var validCodes = [');
inviteCodes.forEach((code, index) => {
    const comma = index < inviteCodes.length - 1 ? ',' : '';
    console.log(`    "${code}"${comma}`);
});
console.log('  ];');
console.log('  return validCodes.includes(code);');
console.log('}');

// Tạo file CSV cho Google Sheets
console.log('\n// CSV cho Google Sheets:');
console.log('Tên khách,Email,Mã mời,Nhóm,Trạng thái RSVP,Ghi chú');
inviteCodes.forEach((code, index) => {
    console.log(`Khách ${index + 1},guest${index + 1}@example.com,${code},Chưa phân loại,Chưa RSVP,`);
});

// Export để copy
console.log('\n// Copy đoạn này vào Google Apps Script:');
const scriptCode = `function validateInviteCode(code) {
  var validCodes = [
${inviteCodes.map(code => `    "${code}"`).join(',\n')}
  ];
  return validCodes.includes(code);
}`;

console.log(scriptCode);
