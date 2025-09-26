// Google Apps Script for Wedding RSVP Form
// Fixed version - không ghi đè header row

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
    var action = e.parameter.action;
    
    if (action === 'get_messages') {
      return getGuestbookMessages();
    }
    
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

// Hàm lấy danh sách lời chúc
function getGuestbookMessages() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet;
    
    // Tìm sheet "Lời chúc khách mời"
    try {
      sheet = spreadsheet.getSheetByName("Lời chúc khách mời");
    } catch (e) {
      Logger.log('Guestbook sheet not found');
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "success",
          messages: []
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "success",
          messages: []
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    if (values.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "success",
          messages: []
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var messages = [];
    // Bỏ qua header row (index 0)
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (row.length >= 5 && row[1] && row[3]) { // Tên và lời chúc không rỗng
        // Xử lý timestamp
        var timestamp = row[4];
        if (!timestamp) {
          timestamp = new Date().toLocaleString('vi-VN');
        } else if (timestamp instanceof Date) {
          timestamp = timestamp.toLocaleString('vi-VN');
        } else if (typeof timestamp === 'string') {
          // Giữ nguyên string nếu đã format đúng
          timestamp = timestamp;
        } else {
          timestamp = new Date().toLocaleString('vi-VN');
        }
        
        messages.push({
          stt: row[0],
          name: row[1],
          email: row[2] || '',
          message: row[3],
          timestamp: timestamp
        });
      }
    }
    
    // Sắp xếp theo thời gian mới nhất
    messages.sort(function(a, b) {
      try {
        var timeA = parseTimestamp(a.timestamp);
        var timeB = parseTimestamp(b.timestamp);
        
        return timeB - timeA;
      } catch (e) {
        return 0; // Giữ nguyên thứ tự nếu có lỗi
      }
    });
    
    // Helper function để parse timestamp
    function parseTimestamp(timestamp) {
      if (!timestamp) return new Date();
      
      if (typeof timestamp === 'string') {
        // Xử lý format "HH:MM:SS DD/MM/YYYY"
        if (timestamp.includes(':') && timestamp.includes('/')) {
          var parts = timestamp.split(' ');
          if (parts.length === 2) {
            var timePart = parts[0]; // "01:55:15"
            var datePart = parts[1]; // "27/9/2025"
            
            // Chuyển đổi date format từ DD/MM/YYYY sang MM/DD/YYYY
            var dateParts = datePart.split('/');
            if (dateParts.length === 3) {
              var day = dateParts[0];
              var month = dateParts[1];
              var year = dateParts[2];
              var dateString = month + '/' + day + '/' + year + ' ' + timePart;
              return new Date(dateString);
            }
          }
        }
        return new Date(timestamp);
      } else {
        return new Date(timestamp);
      }
    }
    
    // Giới hạn 20 lời chúc gần nhất
    messages = messages.slice(0, 20);
    
    Logger.log('Retrieved ' + messages.length + ' messages');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        messages: messages
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in getGuestbookMessages: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: "Error retrieving messages: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm xử lý POST request
function doPost(e) {
  try {
    Logger.log(e);
    
    var mailData = e.parameter;
    var action = mailData.action || 'rsvp'; // 'rsvp' or 'guestbook'
    
    Logger.log('Action: ' + action);
    Logger.log('Mail data: ' + JSON.stringify(mailData));
    
    // PRIORITY: Check for guestbook submission FIRST
    if (action === 'guestbook' || 
        mailData.form_type === 'guestbook' ||
        mailData.source === 'guestbook_form' ||
        (mailData.guest_name && mailData.guest_message) ||
        (mailData.name && mailData.guest_message && !mailData.invite_code)) {
      
      Logger.log('*** PROCESSING AS GUESTBOOK ***');
      Logger.log('Guestbook indicators: action=' + action + ', form_type=' + mailData.form_type + ', source=' + mailData.source);
      return handleGuestbookSubmission(mailData);
    }
    
    // Handle RSVP submission (requires invite code)
    var name = mailData.name;
    var email = mailData.email;
    var extras = mailData.extras;
    var inviteCode = mailData.invite_code;
    var transportSeats = mailData.transport_seats;
    var transportPhone = mailData.transport_phone || '';
    var attendanceStatus = mailData.attendance_status || 'attending';
    var guestMessage = mailData.guest_message || ''; // Lời chúc từ khách mời
    
    // Check if this is actually a guestbook submission disguised as RSVP
    if (!inviteCode && (mailData.guest_name || mailData.guest_message)) {
      // This is actually a guestbook submission, redirect it
      return handleGuestbookSubmission(mailData);
    }
    
    // Debug log
    Logger.log('Received data: ' + JSON.stringify(mailData));
    Logger.log('Attendance status: ' + attendanceStatus); // Debug log
    Logger.log('Transport seats: ' + transportSeats);
    Logger.log('Transport phone: ' + transportPhone);
    
    // Validate invite code cho RSVP (chỉ khi không phải guestbook)
    if (action === 'rsvp' && !validateInviteCode(inviteCode)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Mã mời không hợp lệ"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
    if (values.length === 0 || !values[0] || values[0].length === 0) {
      // Tạo header row nếu chưa có (thêm 2 cột lời chúc)
      var headers = ['STT', 'Tên khách', 'Mối quan hệ', 'SĐT', 'Mã mời', 'Ghi chú', 'Đã RSVP', 'Số người đi cùng', 'Đăng ký xe', 'Thời gian RSVP', 'Lời chúc', 'Thời gian chúc'];
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
        if (attendanceStatus === 'attending' && transportSeats && transportSeats > 0) {
          transportInfo = transportSeats + " ghế";
        } else {
          transportInfo = "0 ghế"; // Explicitly set to 0 if no transport
        }
        Logger.log('Updating transport info: ' + transportInfo);
        sheet.getRange(i + 1, 9, 1, 1).setValue(transportInfo);
        
        // Cập nhật thời gian RSVP
        var timestamp = new Date().toLocaleString('vi-VN');
        sheet.getRange(i + 1, 10, 1, 1).setValue(timestamp);
        Logger.log('Updated timestamp: ' + timestamp);
        
        // Cập nhật lời chúc (nếu có)
        if (guestMessage) {
          sheet.getRange(i + 1, 11, 1, 1).setValue(guestMessage);
          sheet.getRange(i + 1, 12, 1, 1).setValue(timestamp);
          Logger.log('Updated guest message: ' + guestMessage);
        }
        
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
      ? "Cảm ơn bạn đã xác nhận tham dự! " + (extras > 0 ? "(" + extras + " người đi cùng)" : "") + (transportSeats > 0 ? " - " + transportSeats + " ghế xe" : "")
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

// Hàm xử lý guestbook submission (không cần mã mời)
function handleGuestbookSubmission(mailData) {
  try {
    // Handle both guestbook form and RSVP form with guest message
    var guestName = mailData.guest_name || mailData.name;
    var guestEmail = mailData.guest_email || mailData.email || '';
    var guestMessage = mailData.guest_message;
    
    Logger.log('Guestbook submission: ' + JSON.stringify(mailData));
    
    // Validate required fields
    if (!guestName || !guestMessage) {
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
    
    // Format row mới
    var newRowRange = sheet.getRange(newRow, 1, 1, 5);
    newRowRange.setBorder(true, true, true, true, true, true);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 5);
    
    Logger.log('Saved guestbook message: ' + guestName + ' - ' + guestMessage.substring(0, 50) + '...');
    
    // Gửi email thông báo
    sendGuestbookNotification(guestName, guestEmail, guestMessage);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Cảm ơn bạn đã gửi lời chúc! Chúng mình rất cảm động 💕"
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Guestbook error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: "Có lỗi xảy ra: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm gửi email thông báo lời chúc mới
function sendGuestbookNotification(name, email, message) {
  try {
    var subject = "💌 Lời chúc mới từ " + name;
    var body = `
      <h2>💌 Có lời chúc mới!</h2>
      <p><strong>Tên khách:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email || 'Không có'}</p>
      <p><strong>Lời chúc:</strong></p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #e8ca6f; margin: 10px 0;">
        <em>"${message}"</em>
      </div>
      <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        Lời chúc đã được lưu vào Google Sheet: "Lời chúc khách mời"
      </p>
    `;
    
    MailApp.sendEmail({
      to: TO_ADDRESS,
      subject: subject,
      htmlBody: body
    });
    
    Logger.log('Sent guestbook notification email');
    
  } catch (error) {
    Logger.log('Error sending guestbook notification: ' + error.toString());
  }
}

// Hàm khôi phục header row
function restoreHeaderRow() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var headers = ['STT', 'Tên khách', 'Mối quan hệ', 'SĐT', 'Mã mời', 'Ghi chú', 'Đã RSVP', 'Số người đi cùng', 'Đăng ký xe', 'Thời gian RSVP', 'Lời chúc', 'Thời gian chúc'];
  
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
