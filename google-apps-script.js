// Google Apps Script for Wedding RSVP Form
// Fixed version with improved guestbook handling

// Cấu hình email
var TO_ADDRESS = "trungnghiep.nt@gmail.com"; // Thay đổi email của bạn

// Danh sách mã mời hợp lệ
var VALID_INVITE_CODES = [
    "255905",
    "631087", "553561", "860249", "907302", "155229", "503686", "402523",
    "747219", "497338", "912202", "913328", "579656", "738196", "261896",
    "701417", "843859", "611416", "827806", "360299", "751132", "240249",
    "208504", "170673", "451148", "698400", "133575", "857092", "301685",
    "954364", "978386", "551296", "468849", "961923", "251762", "592505",
    "862268", "236058", "528300", "642065", "464802", "425871", "352820",
    "326207", "913424", "148540", "484414", "392496", "370136", "900313",
    "319107", "186968", "558084", "165338", "672241", "795931", "471123",
    "313114", "712836", "496625", "251507", "672959", "585030", "469899",
    "907341", "100928", "385799", "756964", "512663", "313507", "232953",
    "703929", "312586", "877297", "106707", "867944", "756225", "631550",
    "761486", "660337", "487202", "833456", "760281", "700629", "252070",
    "489249", "662028", "299740", "958413", "198826", "302959", "794400",
    "603331", "652788", "895601", "362317", "505164", "236048", "162665",
    "589369", "350036", "259123", "985014", "595758", "449686", "128265",
    "577443", "497223", "562422", "268767", "278727", "397732", "656873",
    "486041", "148492", "901631", "850428", "886901", "635562", "706196",
    "444363", "223163", "478945", "684497", "461494", "437179", "990757",
    "299764", "671271", "454148", "919738", "977082", "976630", "519656",
    "513190", "729961", "509066", "746512", "546077", "343832", "718503",
    "872092", "787546", "441955", "384687", "989334", "755780", "405816",
    "724114", "177038", "617952", "904463", "583128", "113421", "241748",
    "144144", "234380", "328200", "459970", "474419", "547740", "639559",
    "750207", "758324", "678633", "310740", "812016", "612750", "317285",
    "731114", "763872", "409355", "739692", "159671", "472823", "950229",
    "431319", "101202", "169076", "934124", "964112", "653420", "213578",
    "454720", "625920", "201225", "913573", "476001", "385809", "175275",
    "694874", "712115", "314216", "255376", "466708", "905867", "306266",
    "192028", "289578", "868154", "688881", "856765", "565334", "909942",
    "797259", "775741", "796580", "474935", "721454", "571781", "960852",
    "505352", "435018", "281313", "504473", "800092", "835180", "180538",
    "796496", "875769", "727375", "152210", "417775", "492011", "928653",
    "757877", "248383", "203044", "213225", "850313", "869912", "815021",
    "112117", "526169", "494879", "491722", "563039", "697972", "235243",
    "359680", "235660", "697257", "698808", "110861", "241911", "868267",
    "127197", "358412", "560528", "344654", "484950", "884523", "578499",
    "369511", "494055", "104870", "657474", "673436", "750785", "975625",
    "201817", "696547", "280929", "609039", "794048", "418319", "472706",
    "248324", "723466", "989785", "295388", "956881", "928868", "765151",
    "897080", "898667", "813120", "809932", "397820", "606931", "943123",
    "494123", "837012", "895511", "587722", "808760", "953286", "935738",
    "512951", "474186", "447247", "724532", "336747", "225827", "376017",
    "513328", "715776", "381751", "145377", "461201", "515256", "488215",
    "477820", "172982", "280925", "659127", "333397", "159348", "984282",
    "927081", "863279", "944607", "136959", "301560", "959615", "468482",
    "715608", "474107", "811966", "994566", "108411", "179024", "381992",
    "965811", "232747", "337619", "173888", "293943", "688644", "139538",
    "362094", "599466", "226242", "697580", "258478", "116889", "945187",
    "887720", "907112", "430915", "694403", "146909", "449296", "339522",
    "457457", "274168", "788552", "858754", "761850", "962278", "477454",
    "199983", "668142", "820058", "215991", "700585", "168122", "675558",
    "177305", "653831", "303477", "312744", "455325", "657746", "626973",
    "631306", "596253", "439032", "384942", "810463", "293568", "179760",
    "697218", "409570", "842554", "479303", "643642", "246815", "638935",
    "366220", "859628", "810501", "857875", "873545", "172230", "177032",
    "535009", "881203", "815530", "808755", "829833", "300340", "998549",
    "998358", "308520", "799094", "241353", "699524", "480922", "418148",
    "717163", "885008", "721394", "650958", "331218", "747135", "497792",
    "639968", "286013", "320100", "244473", "927264", "991808", "308198",
    "755880", "395083", "992426", "572969", "908161", "847635", "680985",
    "850624", "415538", "963302", "969508", "999852", "250334", "843955",
    "446160", "617387", "144513", "761252", "923518", "575009", "830490",
    "432938", "267898", "245879", "566954", "110816", "519703", "542213",
    "749168", "105555", "815983", "943789", "501563", "478689", "794421",
    "782282", "905366", "215159", "827226", "882793", "578387", "461203",
    "661381", "474178", "374561", "294356", "381222", "938601", "367647",
    "343643", "971694", "605170", "824963", "768125", "657799", "197728",
    "638431", "411397", "505451", "792663", "969861", "692304", "435968",
    "622252", "396643", "574578", "602707", "797027", "196593", "618641",
    "781521", "737822", "228904", "424140", "118624", "973928", "832418",
    "984571", "754271", "535273", "629396", "289342", "781503", "385375",
    "183678", "737635", "149770", "469605", "642270", "963106", "922076",
    "260412", "798324", "235735", "150974", "340188", "564852", "443730",
    "491983", "967160", "276093", "591360", "958885", "631340", "148979",
    "604049", "924401", "569954", "235678", "699906", "311760", "409851",
    "926232", "457307", "195043", "845325", "835553", "697676", "892529",
    "621090", "540255", "870590", "455812", "223321", "209762", "883381",
    "664898", "595379", "322127", "960140", "714096", "840225", "630836",
    "444999", "697548", "152867", "288839", "896116", "416946", "487458",
    "614185", "669444", "599528", "492369", "318487", "621597", "142042",
    "602162", "637792", "488119", "368550", "222665", "925475", "856764",
    "728144", "951508", "741505", "787526", "554912", "895179", "304808",
    "447661", "677134", "880746", "176435", "762239", "594894", "120884",
    "739173", "236425", "470723", "168197", "153980", "547463", "770882",
    "748431", "806353", "366853", "388736", "787759", "744109", "520331",
    "770689", "197028", "282699", "827599", "419881", "327424", "515775",
    "560232", "111239", "251599", "430655", "955130", "113812", "277661",
    "825515", "232932", "466248", "994800", "979001", "689615", "459138",
    "904927", "747074", "796230", "205830", "612374", "234069", "347867",
    "119139", "757536", "162747", "437383", "956310", "473346", "946812",
    "213715", "913055", "671450", "307863", "335392", "137070", "751078",
    "121094", "891980", "715800", "922735", "231553", "277782", "799411",
    "549588", "253291", "641367", "147909", "782053", "678219", "367620",
    "131450", "576161", "967953", "340117", "124920", "812559", "363808",
    "150534", "905122", "821698", "994261", "550551", "245093", "799813",
    "691746", "465179", "342880", "734926", "665382", "367805", "996605",
    "539725", "311668", "428492", "385379", "878248", "785254", "365813",
    "319860", "962054", "602368", "392054", "104848", "487490", "744193",
    "981611", "638197", "205107", "990658", "745143", "195522", "536424",
    "554610", "533243", "510252", "195865", "600799", "133631", "652062",
    "887577", "889323", "304020", "446613", "887157", "133140", "455877",
    "307617", "630981", "299089", "353774", "743133", "142761", "805897",
    "270255", "718492", "141153", "556000", "462260", "846884", "647130",
    "259561", "431548", "513558", "693000", "617108", "484992", "952883",
    "601978", "508459", "348727", "705024", "508337", "445889", "136027",
    "235921", "847231", "124353", "809310", "830724", "802245", "680422",
    "429929", "336930", "776467", "644783", "368191", "277656", "875331",
    "801467", "184863", "975081", "440548", "819539", "309097", "619272",
    "988905", "312312", "460702", "217726", "256411", "405193", "595840",
    "654877", "276357", "402900", "172456", "613709", "730630", "610550",
    "819523", "473995", "431025", "311439", "966536", "532900", "895046",
    "103405", "779430", "490405", "839072", "225108", "146928", "902611",
    "190626", "850236", "409228", "235856", "959385", "434253", "977644",
    "660255", "105912", "108893", "163732", "609021", "460998", "630916",
    "815924"
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
    Logger.log('=== NEW REQUEST ===');
    Logger.log('Raw request: ' + JSON.stringify(e));
    
    var mailData = e.parameter;
    var action = mailData.action || 'rsvp';
    
    Logger.log('Action: ' + action);
    Logger.log('Mail data: ' + JSON.stringify(mailData));
    
    // Handle like action
    if (action === 'like') {
      Logger.log('*** PROCESSING LIKE ACTION ***');
      return handleLikeAction(mailData);
    }
    
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
      Logger.log('Invite code not found in sheet: ' + inviteCode);
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Mã mời không tồn tại trong danh sách khách mời. Vui lòng kiểm tra lại mã mời hoặc liên hệ chủ tiệc."
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
        // Nếu không tham dự thì số người đi cùng = 0
        var extrasValue = (attendanceStatus === 'attending') ? (extras || 0) : 0;
        updateData[i] = extrasValue;
      } else if (header.includes('trạng thái') || header.includes('status') || header.includes('rsvp') || header.includes('đã rsvp')) {
        // Convert attendanceStatus to Yes/No
        var rsvpValue = (attendanceStatus === 'attending') ? 'Yes' : 'No';
        updateData[i] = rsvpValue;
      } else if (header.includes('xe') || header.includes('transport')) {
        // Nếu không tham dự thì số ghế xe = 0
        var transportValue = (attendanceStatus === 'attending') ? (transportSeats || 0) : 0;
        updateData[i] = transportValue;
      } else if (header.includes('sđt') || header.includes('phone')) {
        updateData[i] = transportPhone || currentValue;
      } else if (header.includes('lời chúc') || header.includes('message')) {
        updateData[i] = guestMessage || currentValue;
      } else if (header.includes('thời gian rsvp') || header.includes('time rsvp')) {
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

// Hàm xử lý like action
function handleLikeAction(mailData) {
  try {
    Logger.log('=== LIKE ACTION ===');
    
    var messageId = mailData.messageId;
    var isLiked = mailData.isLiked === 'true' || mailData.isLiked === true;
    var userAgent = mailData.userAgent || 'Unknown';
    var timestamp = new Date();
    
    Logger.log('Like data - MessageId: ' + messageId + ', IsLiked: ' + isLiked);
    
    if (!messageId) {
      Logger.log('Missing messageId');
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Thiếu thông tin message ID"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Lưu vào Google Sheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet;
    
    // Tìm hoặc tạo sheet "Likes"
    try {
      sheet = spreadsheet.getSheetByName("Likes");
      if (!sheet) {
        Logger.log('Creating new Likes sheet');
        sheet = spreadsheet.insertSheet("Likes");
        
        // Tạo header
        var headers = [
          "Timestamp",
          "MessageId", 
          "IsLiked",
          "UserAgent",
          "IPAddress"
        ];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      }
    } catch (error) {
      Logger.log('Error accessing Likes sheet: ' + error.toString());
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Không thể truy cập sheet Likes"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Thêm dữ liệu like
    var newRow = [
      timestamp,
      messageId,
      isLiked,
      userAgent,
      "Unknown" // IP address không có sẵn trong Apps Script
    ];
    
    sheet.appendRow(newRow);
    Logger.log('Like data saved to sheet');
    
    // Tính tổng số likes cho message
    var likeCount = calculateLikeCount(sheet, messageId);
    
    Logger.log('Like action completed successfully. Total likes: ' + likeCount);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Like đã được cập nhật",
        likeCount: likeCount
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in handleLikeAction: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: "Có lỗi xảy ra khi xử lý like: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm tính tổng số likes cho một message
function calculateLikeCount(sheet, messageId) {
  try {
    var data = sheet.getDataRange().getValues();
    var likeCount = 0;
    
    // Bỏ qua header row
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowMessageId = row[1]; // MessageId column
      var isLiked = row[2]; // IsLiked column
      
      if (rowMessageId === messageId && isLiked === true) {
        likeCount++;
      }
    }
    
    // Đảm bảo không bao giờ có số âm
    if (likeCount < 0) {
      likeCount = 0;
    }
    
    Logger.log('Calculated like count for ' + messageId + ': ' + likeCount);
    return likeCount;
    
  } catch (error) {
    Logger.log('Error calculating like count: ' + error.toString());
    return 0;
  }
}

// Hàm lấy tổng số likes cho tất cả messages
function getAllLikeCounts() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("Likes");
    
    if (!sheet) {
      Logger.log('Likes sheet not found');
      return {};
    }
    
    var data = sheet.getDataRange().getValues();
    var likeCounts = {};
    
    // Bỏ qua header row
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var messageId = row[1]; // MessageId column
      var isLiked = row[2]; // IsLiked column
      
      if (!likeCounts[messageId]) {
        likeCounts[messageId] = 0;
      }
      
      if (isLiked === true) {
        likeCounts[messageId]++;
      }
      
      // Đảm bảo không bao giờ có số âm
      if (likeCounts[messageId] < 0) {
        likeCounts[messageId] = 0;
      }
    }
    
    Logger.log('All like counts: ' + JSON.stringify(likeCounts));
    return likeCounts;
    
  } catch (error) {
    Logger.log('Error getting all like counts: ' + error.toString());
    return {};
  }
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

// Hàm test like
function testLike() {
  var testData = {
    messageId: "test-message-1",
    isLiked: true,
    userAgent: "Test Browser",
    action: "like"
  };
  
  var result = handleLikeAction(testData);
  Logger.log('Like test result: ' + result.getContent());
}
