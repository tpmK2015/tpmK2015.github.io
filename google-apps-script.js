// Google Apps Script cho RSVP System
// Copy code này vào Google Apps Script Editor

var TO_ADDRESS = "trungnghiep.nt@gmail.com"; // Thay bằng email của bạn

/**
 * Entry point cho GET request (để test)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      result: "success",
      message: "Google Apps Script is working!"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Entry point cho POST request
 */
function doPost(e) {
  try {
    Logger.log(e);
    
    var mailData = e.parameter;
    var name = mailData.name;
    var email = mailData.email;
    var extras = mailData.extras;
    var inviteCode = mailData.invite_code;
    var needTransport = mailData.need_transport;
    var transportSeats = mailData.transport_seats;
    var transportPhone = mailData.transport_phone || '';
    
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
    
    // Tìm khách theo mã mời (cột E - index 4)
    var found = false;
    for (var i = 1; i < values.length; i++) { // Bỏ qua header row
      if (values[i][4] == inviteCode) { // Cột E (index 4) là mã mời
        // Cập nhật tên khách (cột B - index 1) nếu có
        if (name) {
          sheet.getRange(i + 1, 2, 1, 1).setValue(name);
        }
        
        // Cập nhật SĐT (cột D - index 3) nếu có
        if (transportPhone) {
          sheet.getRange(i + 1, 4, 1, 1).setValue(transportPhone);
        }
        
        // Cập nhật cột "Đã RSVP" (index 6) và "Số người đi cùng" (index 7)
        sheet.getRange(i + 1, 7, 1, 2).setValues([["Yes", extras]]);
        
        // Cập nhật cột "Đăng ký xe" (index 8) nếu có transport data
        if (needTransport && transportSeats) {
          var transportInfo = needTransport + " - " + transportSeats + " ghế";
          if (transportPhone) {
            transportInfo += " (" + transportPhone + ")";
          }
          sheet.getRange(i + 1, 9, 1, 1).setValue(transportInfo);
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
    sendEmailNotification(name, email, extras, needTransport, transportSeats, transportPhone);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Cảm ơn bạn đã xác nhận tham dự!"
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

/**
 * Xử lý đăng ký xe đưa đón
 */
function handleTransportRegistration(data) {
  try {
    var name = data.name;
    var email = data.email;
    var pickupLocation = data.pickup_location;
    var transportDate = data.transport_date;
    var transportNote = data.transport_note || '';
    
    // Cập nhật cột "Đăng ký xe" trong sheet chính
    var sheet = SpreadsheetApp.getActiveSheet();
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    // Tìm khách theo email (cột C - index 2)
    var found = false;
    for (var i = 1; i < values.length; i++) { // Bỏ qua header row
      if (values[i][2] == email) { // Cột C (index 2) là email
        // Cập nhật cột "Đăng ký xe" (index 8) với thông tin chi tiết
        var transportInfo = pickupLocation + " - " + transportDate;
        if (transportNote) {
          transportInfo += " (" + transportNote + ")";
        }
        sheet.getRange(i + 1, 9, 1, 1).setValue(transportInfo);
        found = true;
        break;
      }
    }
    
    if (!found) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          message: "Không tìm thấy khách với email này"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Gửi email thông báo đăng ký xe
    sendTransportEmailNotification(name, email, pickupLocation, transportDate, transportNote);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Đăng ký xe thành công!"
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

/**
 * Setup function - chạy một lần để tạo sheet với header đúng
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // Tạo header nếu chưa có
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 10).setValues([[
      'STT',
      'Tên khách',
      'Email',
      'SĐT',
      'Mã mời',
      'Nhóm',
      'Đã RSVP',
      'Số người đi cùng',
      'Đăng ký xe',
      'Ghi chú'
    ]]);
  }
}

/**
 * Gửi email thông báo đăng ký xe
 */
function sendTransportEmailNotification(name, email, pickupLocation, transportDate, transportNote) {
  var subject = 'Đăng ký xe đưa đón mới - ' + name;
  var body = `
    <h2>Thông báo đăng ký xe đưa đón</h2>
    <p><strong>Tên:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Điểm đón:</strong> ${pickupLocation}</p>
    <p><strong>Ngày:</strong> ${transportDate}</p>
    <p><strong>Ghi chú:</strong> ${transportNote}</p>
    <p><strong>Thời gian đăng ký:</strong> ${new Date().toLocaleString('vi-VN')}</p>
  `;
  
  MailApp.sendEmail({
    to: TO_ADDRESS,
    subject: subject,
    htmlBody: body
  });
}

/**
 * Validate invite code
 */
function validateInviteCode(code) {
  // 800 mã mời của bạn
  var validCodes = [
    "255905", "255906", "255907", "255908", "255909", "255910", "255911", "255912", "255913", "255914",
    "255915", "255916", "255917", "255918", "255919", "255920", "255921", "255922", "255923", "255924",
    "255925", "255926", "255927", "255928", "255929", "255930", "255931", "255932", "255933", "255934",
    "255935", "255936", "255937", "255938", "255939", "255940", "255941", "255942", "255943", "255944",
    "255945", "255946", "255947", "255948", "255949", "255950", "255951", "255952", "255953", "255954",
    "255955", "255956", "255957", "255958", "255959", "255960", "255961", "255962", "255963", "255964",
    "255965", "255966", "255967", "255968", "255969", "255970", "255971", "255972", "255973", "255974",
    "255975", "255976", "255977", "255978", "255979", "255980", "255981", "255982", "255983", "255984",
    "255985", "255986", "255987", "255988", "255989", "255990", "255991", "255992", "255993", "255994",
    "255995", "255996", "255997", "255998", "255999", "256000", "256001", "256002", "256003", "256004",
    "256005", "256006", "256007", "256008", "256009", "256010", "256011", "256012", "256013", "256014",
    "256015", "256016", "256017", "256018", "256019", "256020", "256021", "256022", "256023", "256024",
    "256025", "256026", "256027", "256028", "256029", "256030", "256031", "256032", "256033", "256034",
    "256035", "256036", "256037", "256038", "256039", "256040", "256041", "256042", "256043", "256044",
    "256045", "256046", "256047", "256048", "256049", "256050", "256051", "256052", "256053", "256054",
    "256055", "256056", "256057", "256058", "256059", "256060", "256061", "256062", "256063", "256064",
    "256065", "256066", "256067", "256068", "256069", "256070", "256071", "256072", "256073", "256074",
    "256075", "256076", "256077", "256078", "256079", "256080", "256081", "256082", "256083", "256084",
    "256085", "256086", "256087", "256088", "256089", "256090", "256091", "256092", "256093", "256094",
    "256095", "256096", "256097", "256098", "256099", "256100", "256101", "256102", "256103", "256104",
    "256105", "256106", "256107", "256108", "256109", "256110", "256111", "256112", "256113", "256114",
    "256115", "256116", "256117", "256118", "256119", "256120", "256121", "256122", "256123", "256124",
    "256125", "256126", "256127", "256128", "256129", "256130", "256131", "256132", "256133", "256134",
    "256135", "256136", "256137", "256138", "256139", "256140", "256141", "256142", "256143", "256144",
    "256145", "256146", "256147", "256148", "256149", "256150", "256151", "256152", "256153", "256154",
    "256155", "256156", "256157", "256158", "256159", "256160", "256161", "256162", "256163", "256164",
    "256165", "256166", "256167", "256168", "256169", "256170", "256171", "256172", "256173", "256174",
    "256175", "256176", "256177", "256178", "256179", "256180", "256181", "256182", "256183", "256184",
    "256185", "256186", "256187", "256188", "256189", "256190", "256191", "256192", "256193", "256194",
    "256195", "256196", "256197", "256198", "256199", "256200", "256201", "256202", "256203", "256204",
    "256205", "256206", "256207", "256208", "256209", "256210", "256211", "256212", "256213", "256214",
    "256215", "256216", "256217", "256218", "256219", "256220", "256221", "256222", "256223", "256224",
    "256225", "256226", "256227", "256228", "256229", "256230", "256231", "256232", "256233", "256234",
    "256235", "256236", "256237", "256238", "256239", "256240", "256241", "256242", "256243", "256244",
    "256245", "256246", "256247", "256248", "256249", "256250", "256251", "256252", "256253", "256254",
    "256255", "256256", "256257", "256258", "256259", "256260", "256261", "256262", "256263", "256264",
    "256265", "256266", "256267", "256268", "256269", "256270", "256271", "256272", "256273", "256274",
    "256275", "256276", "256277", "256278", "256279", "256280", "256281", "256282", "256283", "256284",
    "256285", "256286", "256287", "256288", "256289", "256290", "256291", "256292", "256293", "256294",
    "256295", "256296", "256297", "256298", "256299", "256300", "256301", "256302", "256303", "256304",
    "256305", "256306", "256307", "256308", "256309", "256310", "256311", "256312", "256313", "256314",
    "256315", "256316", "256317", "256318", "256319", "256320", "256321", "256322", "256323", "256324",
    "256325", "256326", "256327", "256328", "256329", "256330", "256331", "256332", "256333", "256334",
    "256335", "256336", "256337", "256338", "256339", "256340", "256341", "256342", "256343", "256344",
    "256345", "256346", "256347", "256348", "256349", "256350", "256351", "256352", "256353", "256354",
    "256355", "256356", "256357", "256358", "256359", "256360", "256361", "256362", "256363", "256364",
    "256365", "256366", "256367", "256368", "256369", "256370", "256371", "256372", "256373", "256374",
    "256375", "256376", "256377", "256378", "256379", "256380", "256381", "256382", "256383", "256384",
    "256385", "256386", "256387", "256388", "256389", "256390", "256391", "256392", "256393", "256394",
    "256395", "256396", "256397", "256398", "256399", "256400", "256401", "256402", "256403", "256404",
    "256405", "256406", "256407", "256408", "256409", "256410", "256411", "256412", "256413", "256414",
    "256415", "256416", "256417", "256418", "256419", "256420", "256421", "256422", "256423", "256424",
    "256425", "256426", "256427", "256428", "256429", "256430", "256431", "256432", "256433", "256434",
    "256435", "256436", "256437", "256438", "256439", "256440", "256441", "256442", "256443", "256444",
    "256445", "256446", "256447", "256448", "256449", "256450", "256451", "256452", "256453", "256454",
    "256455", "256456", "256457", "256458", "256459", "256460", "256461", "256462", "256463", "256464",
    "256465", "256466", "256467", "256468", "256469", "256470", "256471", "256472", "256473", "256474",
    "256475", "256476", "256477", "256478", "256479", "256480", "256481", "256482", "256483", "256484",
    "256485", "256486", "256487", "256488", "256489", "256490", "256491", "256492", "256493", "256494",
    "256495", "256496", "256497", "256498", "256499", "256500", "256501", "256502", "256503", "256504",
    "256505", "256506", "256507", "256508", "256509", "256510", "256511", "256512", "256513", "256514",
    "256515", "256516", "256517", "256518", "256519", "256520", "256521", "256522", "256523", "256524",
    "256525", "256526", "256527", "256528", "256529", "256530", "256531", "256532", "256533", "256534",
    "256535", "256536", "256537", "256538", "256539", "256540", "256541", "256542", "256543", "256544",
    "256545", "256546", "256547", "256548", "256549", "256550", "256551", "256552", "256553", "256554",
    "256555", "256556", "256557", "256558", "256559", "256560", "256561", "256562", "256563", "256564",
    "256565", "256566", "256567", "256568", "256569", "256570", "256571", "256572", "256573", "256574",
    "256575", "256576", "256577", "256578", "256579", "256580", "256581", "256582", "256583", "256584",
    "256585", "256586", "256587", "256588", "256589", "256590", "256591", "256592", "256593", "256594",
    "256595", "256596", "256597", "256598", "256599", "256600", "256601", "256602", "256603", "256604",
    "256605", "256606", "256607", "256608", "256609", "256610", "256611", "256612", "256613", "256614",
    "256615", "256616", "256617", "256618", "256619", "256620", "256621", "256622", "256623", "256624",
    "256625", "256626", "256627", "256628", "256629", "256630", "256631", "256632", "256633", "256634",
    "256635", "256636", "256637", "256638", "256639", "256640", "256641", "256642", "256643", "256644",
    "256645", "256646", "256647", "256648", "256649", "256650", "256651", "256652", "256653", "256654",
    "256655", "256656", "256657", "256658", "256659", "256660", "256661", "256662", "256663", "256664",
    "256665", "256666", "256667", "256668", "256669", "256670", "256671", "256672", "256673", "256674",
    "256675", "256676", "256677", "256678", "256679", "256680", "256681", "256682", "256683", "256684",
    "256685", "256686", "256687", "256688", "256689", "256690", "256691", "256692", "256693", "256694",
    "256695", "256696", "256697", "256698", "256699", "256700", "256701", "256702", "256703", "256704"
  ];
  return validCodes.includes(code);
}

/**
 * Gửi email thông báo
 */
function sendEmailNotification(name, email, extras, needTransport, transportSeats, transportPhone) {
  var subject = "Có người mới RSVP - " + name;
  var body = `
    <h2>Thông báo RSVP mới</h2>
    <p><strong>Tên:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Số người đi cùng:</strong> ${extras}</p>
    <p><strong>Cần xe đưa đón:</strong> ${needTransport || 'Không có thông tin'}</p>
    <p><strong>Số ghế:</strong> ${transportSeats || 'Không có thông tin'}</p>
    <p><strong>Số điện thoại:</strong> ${transportPhone || 'Không có'}</p>
    <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
  `;
  
  MailApp.sendEmail({
    to: TO_ADDRESS,
    subject: subject,
    htmlBody: body
  });
}

