// Google Apps Script for Wedding RSVP Form
// Fixed version with improved guestbook handling

// Cấu hình email
var TO_ADDRESS = "trungnghiep.nt@gmail.com"; // Thay đổi email của bạn

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

// Hàm xử lý GET request
function doGet(e) {
  try {
    Logger.log('GET request received');
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Wedding RSVP API is running",
        timestamp: new Date().toLocaleString('vi-VN')
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: "Error: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm xử lý POST request
function doPost(e) {
  try {
    Logger.log('=== NEW REQUEST ===');
    Logger.log('Raw request: ' + JSON.stringify(e));
    
    var mailData = e.parameter;
    var action = mailData.action || 'rsvp';
    
    Logger.log('Action: ' + action);
    Logger.log('Mail data: ' + JSON.stringify(mailData));
    
    // PRIORITY: Check for guestbook submission FIRST
    if (action === 'guestbook' || 
        (mailData.guest_name && mailData.guest_message) ||
        (mailData.name && mailData.guest_message && !mailData.invite_code)) {
      
      Logger.log('*** PROCESSING AS GUESTBOOK ***');
      return handleGuestbookSubmission(mailData);
    }
    
    // Handle RSVP submission (requires invite code)
    Logger.log('*** PROCESSING AS RSVP ***');
    var name = mailData.name;
    var email = mailData.email;
    var extras = mailData.extras;
    var inviteCode = mailData.invite_code;
    var transportSeats = mailData.transport_seats;
    var transportPhone = mailData.transport_phone || '';
    var attendanceStatus = mailData.attendance_status || 'attending';
    var guestMessage = mailData.guest_message || '';
    
    Logger.log('RSVP Data - Name: ' + name + ', Invite Code: ' + inviteCode);
    
    // Validate invite code for RSVP
    if (!validateInviteCode(inviteCode)) {
      Logger.log('Invalid invite code: ' + inviteCode);
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Mã mời không hợp lệ"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Process RSVP submission
    return handleRSVPSubmission(mailData);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: "Có lỗi xảy ra: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm xử lý guestbook submission
function handleGuestbookSubmission(mailData) {
  try {
    Logger.log('=== GUESTBOOK SUBMISSION ===');
    
    // Handle both guestbook form and RSVP form with guest message
    var guestName = mailData.guest_name || mailData.name;
    var guestEmail = mailData.guest_email || mailData.email || '';
    var guestMessage = mailData.guest_message;
    
    Logger.log('Guestbook data - Name: ' + guestName + ', Email: ' + guestEmail + ', Message: ' + guestMessage);
    
    // Validate required fields
    if (!guestName || !guestMessage) {
      Logger.log('Missing required fields');
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Vui lòng điền đầy đủ tên và lời chúc"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Lưu vào Google Sheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet;
    
    // Tìm hoặc tạo sheet "Lời chúc khách mời"
    try {
      sheet = spreadsheet.getSheetByName("Lời chúc khách mời");
      if (!sheet) {
        throw new Error("Sheet not found");
      }
    } catch (e) {
      Logger.log('Creating new guestbook sheet');
      sheet = spreadsheet.insertSheet("Lời chúc khách mời");
      
      // Tạo header row
      var headers = ['STT', 'Tên khách', 'Email', 'Lời chúc', 'Thời gian'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#e8ca6f');
      headerRange.setFontColor('#333');
    }
    
    // Thêm dữ liệu mới
    var lastRow = sheet.getLastRow();
    var newRow = lastRow + 1;
    var stt = lastRow; // Bỏ qua header row
    var timestamp = new Date().toLocaleString('vi-VN');
    
    // Thêm dữ liệu
    sheet.getRange(newRow, 1, 1, 5).setValues([[
      stt,
      guestName,
      guestEmail,
      guestMessage,
      timestamp
    ]]);
    
    // Gửi email thông báo
    var subject = "Lời chúc mới từ " + guestName;
    var body = "Tên: " + guestName + "\n" +
               "Email: " + guestEmail + "\n" +
               "Lời chúc: " + guestMessage + "\n" +
               "Thời gian: " + timestamp;
    
    try {
      MailApp.sendEmail(TO_ADDRESS, subject, body);
      Logger.log('Email sent successfully');
    } catch (emailError) {
      Logger.log('Email error: ' + emailError.toString());
    }
    
    Logger.log('Guestbook submission successful');
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Cảm ơn bạn đã gửi lời chúc!"
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in handleGuestbookSubmission: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: "Có lỗi xảy ra khi lưu lời chúc: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm xử lý RSVP submission
function handleRSVPSubmission(mailData) {
  try {
    Logger.log('=== RSVP SUBMISSION ===');
    
    var name = mailData.name;
    var email = mailData.email;
    var extras = mailData.extras;
    var inviteCode = mailData.invite_code;
    var transportSeats = mailData.transport_seats;
    var transportPhone = mailData.transport_phone || '';
    var attendanceStatus = mailData.attendance_status || 'attending';
    var guestMessage = mailData.guest_message || '';
    
    // Cập nhật Google Sheet - tìm khách theo mã mời và cập nhật thông tin
    // Sử dụng sheet hiện tại (sheet đầu tiên - RSVP sheet)
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheets()[0]; // Lấy sheet đầu tiên (RSVP sheet)
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    // Debug: Log header row để kiểm tra cấu trúc
    if (values.length > 0) {
      Logger.log('Header row: ' + JSON.stringify(values[0]));
      Logger.log('Total rows: ' + values.length);
    }
    
    // Đảm bảo header row không bị ghi đè
    var headerRow = values[0];
    var inviteCodeColumn = -1;
    
    // Tìm cột mã mời
    for (var i = 0; i < headerRow.length; i++) {
      if (headerRow[i].toString().toLowerCase().includes('mã') || 
          headerRow[i].toString().toLowerCase().includes('code') ||
          headerRow[i].toString().toLowerCase().includes('invite')) {
        inviteCodeColumn = i;
        break;
      }
    }
    
    if (inviteCodeColumn === -1) {
      Logger.log('Could not find invite code column');
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Không tìm thấy cột mã mời trong bảng tính"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    Logger.log('Invite code column: ' + inviteCodeColumn);
    
    // Tìm hàng có mã mời tương ứng
    var targetRow = -1;
    for (var i = 1; i < values.length; i++) {
      if (values[i][inviteCodeColumn] && values[i][inviteCodeColumn].toString() === inviteCode.toString()) {
        targetRow = i + 1; // +1 vì sheet row bắt đầu từ 1
        break;
      }
    }
    
    if (targetRow === -1) {
      Logger.log('Could not find row with invite code: ' + inviteCode);
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Không tìm thấy thông tin khách mời với mã: " + inviteCode
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    Logger.log('Found target row: ' + targetRow);
    
    // Cập nhật thông tin
    var updateData = [];
    
    // Tìm các cột cần cập nhật
    for (var i = 0; i < headerRow.length; i++) {
      var header = headerRow[i].toString().toLowerCase();
      var currentValue = values[targetRow - 1][i]; // -1 vì array index
      
      if (header.includes('tên') || header.includes('name')) {
        updateData[i] = name || currentValue;
      } else if (header.includes('email')) {
        updateData[i] = email || currentValue;
      } else if (header.includes('số người') || header.includes('extras')) {
        updateData[i] = extras || currentValue;
      } else if (header.includes('trạng thái') || header.includes('status')) {
        updateData[i] = attendanceStatus || currentValue;
      } else if (header.includes('xe') || header.includes('transport')) {
        updateData[i] = transportSeats || currentValue;
      } else if (header.includes('sđt') || header.includes('phone')) {
        updateData[i] = transportPhone || currentValue;
      } else if (header.includes('lời chúc') || header.includes('message')) {
        updateData[i] = guestMessage || currentValue;
      } else if (header.includes('thời gian') || header.includes('time')) {
        updateData[i] = new Date().toLocaleString('vi-VN');
      } else {
        updateData[i] = currentValue; // Giữ nguyên giá trị cũ
      }
    }
    
    // Cập nhật hàng
    sheet.getRange(targetRow, 1, 1, updateData.length).setValues([updateData]);
    
    // Gửi email thông báo
    var subject = "RSVP từ " + name + " - " + (attendanceStatus === 'attending' ? 'Tham dự' : 'Không tham dự');
    var body = "Tên: " + name + "\n" +
               "Email: " + email + "\n" +
               "Mã mời: " + inviteCode + "\n" +
               "Trạng thái: " + (attendanceStatus === 'attending' ? 'Tham dự' : 'Không tham dự') + "\n" +
               "Số người: " + (extras || 1) + "\n" +
               "Xe đưa đón: " + (transportSeats || 0) + " ghế\n" +
               "SĐT: " + transportPhone + "\n" +
               "Lời chúc: " + guestMessage + "\n" +
               "Thời gian: " + new Date().toLocaleString('vi-VN');
    
    try {
      MailApp.sendEmail(TO_ADDRESS, subject, body);
      Logger.log('Email sent successfully');
    } catch (emailError) {
      Logger.log('Email error: ' + emailError.toString());
    }
    
    Logger.log('RSVP submission successful');
    var successMessage = (attendanceStatus === 'attending') 
      ? "Cảm ơn bạn đã xác nhận tham dự! " + (extras > 0 ? "(" + extras + " người đi cùng)" : "") + (transportSeats > 0 ? " - " + transportSeats + " ghế xe" : "")
      : "Cảm ơn bạn đã phản hồi! Hẹn dịp khác nhé!";
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: successMessage
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in handleRSVPSubmission: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: "Có lỗi xảy ra khi xử lý RSVP: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm kiểm tra mã mời hợp lệ
function validateInviteCode(code) {
  if (!code) return false;
  return VALID_INVITE_CODES.includes(code.toString());
}

// Hàm test
function testGuestbook() {
  var testData = {
    guest_name: "Test User",
    guest_email: "test@example.com",
    guest_message: "Test message",
    action: "guestbook"
  };
  
  var result = handleGuestbookSubmission(testData);
  Logger.log('Test result: ' + result.getContent());
}
