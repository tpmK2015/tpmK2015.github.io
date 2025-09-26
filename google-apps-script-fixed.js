// Google Apps Script for Wedding RSVP Form
// Fixed version - không ghi đè header row

// Cấu hình email
var TO_ADDRESS = "your-email@gmail.com"; // Thay đổi email của bạn

// Danh sách mã mời hợp lệ
var VALID_INVITE_CODES = [
  "255905", "255906", "255907", "255908", "255909", "255910",
  "255911", "255912", "255913", "255914", "255915", "255916",
  "255917", "255918", "255919", "255920", "255921", "255922",
  "255923", "255924", "255925", "255926", "255927", "255928",
  "255929", "255930", "255931", "255932", "255933", "255934",
  "255935", "255936", "255937", "255938", "255939", "255940",
  "255941", "255942", "255943", "255944", "255945", "255946",
  "255947", "255948", "255949", "255950", "255951", "255952",
  "255953", "255954", "255955", "255956", "255957", "255958",
  "255959", "255960", "255961", "255962", "255963", "255964",
  "255965", "255966", "255967", "255968", "255969", "255970",
  "255971", "255972", "255973", "255974", "255975", "255976",
  "255977", "255978", "255979", "255980", "255981", "255982",
  "255983", "255984", "255985", "255986", "255987", "255988",
  "255989", "255990", "255991", "255992", "255993", "255994",
  "255995", "255996", "255997", "255998", "255999", "256000"
];

// Hàm xử lý POST request
function doPost(e) {
  try {
    Logger.log(e);
    
    var mailData = e.parameter;
    var name = mailData.name;
    var email = mailData.email;
    var extras = mailData.extras;
    var inviteCode = mailData.invite_code;
    var transportSeats = mailData.transport_seats;
    var transportPhone = mailData.transport_phone || '';
    var attendanceStatus = mailData.attendance_status || 'attending'; // New: Capture attendance status
    
    // Debug log
    Logger.log('Received data: ' + JSON.stringify(mailData));
    Logger.log('Attendance status: ' + attendanceStatus); // Debug log
    Logger.log('Transport seats: ' + transportSeats);
    Logger.log('Transport phone: ' + transportPhone);
    
    // Validate invite code cho RSVP
    if (!validateInviteCode(inviteCode)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Mã mời không hợp lệ"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Cập nhật Google Sheet - tìm khách theo mã mời và cập nhật thông tin
    var sheet = SpreadsheetApp.getActiveSheet();
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    // Debug: Log header row để kiểm tra cấu trúc
    if (values.length > 0) {
      Logger.log('Header row: ' + JSON.stringify(values[0]));
      Logger.log('Total rows: ' + values.length);
    }
    
    // Đảm bảo header row không bị ghi đè
    if (values.length === 0 || !values[0] || values[0].length === 0) {
      // Tạo header row nếu chưa có
      var headers = ['STT', 'Tên khách', 'Mối quan hệ', 'SĐT', 'Mã mời', 'Ghi chú', 'Đã RSVP', 'Số người đi cùng', 'Đăng ký xe', 'Thời gian RSVP'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      Logger.log('Created header row: ' + JSON.stringify(headers));
      
      // Reload data
      dataRange = sheet.getDataRange();
      values = dataRange.getValues();
    }
    
    // Tìm khách theo mã mời (cột E - index 4)
    // Lưu ý: Cả "có đi" và "không đi" đều lưu vào cùng 1 sheet
    // - "Có đi": Đã RSVP = "Đi", Số người đi cùng = "X người"
    // - "Không đi": Đã RSVP = "Không đi", Số người đi cùng = "0 người"
    var found = false;
    for (var i = 1; i < values.length; i++) { // Bỏ qua header row
      if (values[i][4] == inviteCode) { // Cột E (index 4) là mã mời
        Logger.log('Found guest at row: ' + (i + 1));
        
        // Cập nhật tên khách (cột B - index 1) nếu có
        if (name) {
          sheet.getRange(i + 1, 2, 1, 1).setValue(name);
          Logger.log('Updated name: ' + name);
        }
        
        // Cập nhật SĐT (cột D - index 3) nếu có
        if (transportPhone) {
          sheet.getRange(i + 1, 4, 1, 1).setValue(transportPhone);
          Logger.log('Updated phone: ' + transportPhone);
        }
        
        // Xác định trạng thái RSVP
        var rsvpStatus = (attendanceStatus === 'attending') ? 'Đi' : 'Không đi';
        var extrasValue = (attendanceStatus === 'attending') ? extras : 0;
        
        // Cập nhật cột "Đã RSVP" (index 6) - cẩn thận với index
        sheet.getRange(i + 1, 7, 1, 1).setValue(rsvpStatus);
        Logger.log('Updated RSVP status: ' + rsvpStatus);
        
        // Cập nhật cột "Số người đi cùng" (index 7) - thêm chữ "người"
        var extrasText = (attendanceStatus === 'attending' && extrasValue > 0) ? extrasValue + " người" : "0 người";
        sheet.getRange(i + 1, 8, 1, 1).setValue(extrasText);
        Logger.log('Updated extras: ' + extrasText);
        
        // Cập nhật cột "Đăng ký xe" (index 8) với số ghế (chỉ khi tham dự)
        var transportInfo = "";
        if (attendanceStatus === 'attending' && transportSeats) {
          transportInfo = transportSeats + " ghế";
        }
        Logger.log('Updating transport info: ' + transportInfo);
        sheet.getRange(i + 1, 9, 1, 1).setValue(transportInfo);
        
        // Cập nhật thời gian RSVP
        var timestamp = new Date().toLocaleString('vi-VN');
        sheet.getRange(i + 1, 10, 1, 1).setValue(timestamp);
        Logger.log('Updated timestamp: ' + timestamp);
        
        found = true;
        break;
      }
    }
    
    if (!found) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Không tìm thấy khách với mã mời: " + inviteCode
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Gửi email thông báo RSVP
    sendEmailNotification(name, email, extras, transportSeats, transportPhone, attendanceStatus); // New: Pass attendanceStatus
    
    var successMessage = (attendanceStatus === 'attending') 
      ? "Cảm ơn bạn đã xác nhận tham dự!" 
      : "Cảm ơn bạn đã phản hồi! Hẹn dịp khác nhé!";
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: successMessage
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log(error);
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: "Có lỗi xảy ra: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm validate mã mời
function validateInviteCode(inviteCode) {
  return VALID_INVITE_CODES.indexOf(inviteCode) !== -1;
}

// Hàm gửi email thông báo
function sendEmailNotification(name, email, extras, transportSeats, transportPhone, attendanceStatus) {
  var statusText = (attendanceStatus === 'attending') ? 'SẼ THAM DỰ' : 'KHÔNG THAM DỰ';
  var subject = "RSVP - " + name + " - " + statusText;
  var body = `
    <h2>Thông báo RSVP mới</h2>
    <p><strong>Tên:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Trạng thái:</strong> <span style="color: ${attendanceStatus === 'attending' ? 'green' : 'red'}; font-weight: bold;">${statusText}</span></p>
    <p><strong>Số người đi cùng:</strong> ${extras}</p>
    <p><strong>Số ghế đăng ký:</strong> ${transportSeats || 'Không có thông tin'}</p>
    <p><strong>Số điện thoại:</strong> ${transportPhone || 'Không có'}</p>
    <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
  `;
  
  MailApp.sendEmail({
    to: TO_ADDRESS,
    subject: subject,
    htmlBody: body
  });
}

// Hàm test để kiểm tra script
function testScript() {
  var testData = {
    name: "Test User",
    email: "test@example.com",
    extras: 1,
    invite_code: "255905",
    transport_seats: 2,
    transport_phone: "0123456789",
    attendance_status: "attending"
  };
  
  var mockEvent = {
    parameter: testData
  };
  
  var result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}

// Hàm khôi phục header row
function restoreHeaderRow() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var headers = ['STT', 'Tên khách', 'Mối quan hệ', 'SĐT', 'Mã mời', 'Ghi chú', 'Đã RSVP', 'Số người đi cùng', 'Đăng ký xe', 'Thời gian RSVP'];
  
  Logger.log('Khôi phục header row với format:');
  Logger.log('- Đã RSVP: "Đi" (có đi) hoặc "Không đi" (không đi)');
  Logger.log('- Số người đi cùng: "X người" (có đi) hoặc "0 người" (không đi)');
  Logger.log('- Đăng ký xe: "X ghế" (có đi) hoặc để trống (không đi)');
  
  // Đảm bảo có đủ cột
  if (sheet.getLastColumn() < headers.length) {
    sheet.insertColumnsAfter(sheet.getLastColumn(), headers.length - sheet.getLastColumn());
  }
  
  // Set header row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e8ca6f');
  headerRange.setFontColor('#333');
  
  Logger.log('Header row restored: ' + JSON.stringify(headers));
  return 'Header row đã được khôi phục thành công!';
}
