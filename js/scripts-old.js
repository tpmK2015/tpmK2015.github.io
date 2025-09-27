$(document).ready(function () {

    /***************** URL Parameter Handling ******************/
    // Check for decline parameter in URL
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('decline') === 'true') {
        var declineCode = urlParams.get('code');
        if (declineCode && declineCode !== 'YOUR_CODE') {
            // Auto-fill decline form
            $('#attendance_status').val('declining').trigger('change');
            $('#invite_code_decline').val(declineCode);
            generateDeclineQR();
            
            // Show thank you message
            setTimeout(function() {
                $('#alert-wrapper').html(alert_markup('success', '<strong>Cảm ơn bạn đã phản hồi!</strong> Hẹn dịp khác 🌸'));
            }, 1000);
        }
    }

    /***************** Waypoints ******************/

    $('.wp1').waypoint(function () {
        $('.wp1').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp2').waypoint(function () {
        $('.wp2').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp3').waypoint(function () {
        $('.wp3').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp4').waypoint(function () {
        $('.wp4').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp5').waypoint(function () {
        $('.wp5').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp6').waypoint(function () {
        $('.wp6').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp7').waypoint(function () {
        $('.wp7').addClass('animated fadeInUp');
    }, {
        offset: '75%'
    });
    $('.wp8').waypoint(function () {
        $('.wp8').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp9').waypoint(function () {
        $('.wp9').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });

    /***************** Initiate Flexslider ******************/
    $('.flexslider').flexslider({
        animation: "slide"
    });

    /***************** Initiate Fancybox ******************/

    $('.single_image').fancybox({
        padding: 4
    });

    $('.fancybox').fancybox({
        padding: 4,
        width: 1000,
        height: 800
    });

    /***************** Tooltips ******************/
    $('[data-toggle="tooltip"]').tooltip();

    /***************** Nav Transformicon ******************/

    /* When user clicks the Icon */
    $('.nav-toggle').click(function () {
        $(this).toggleClass('active');
        $('.header-nav').toggleClass('open');
        event.preventDefault();
    });
    /* When user clicks a link */
    $('.header-nav li a').click(function () {
        $('.nav-toggle').toggleClass('active');
        $('.header-nav').toggleClass('open');

    });

    /***************** Header BG Scroll ******************/

    $(function () {
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();

            if (scroll >= 20) {
                $('section.navigation').addClass('fixed');
                $('header').css({
                    "border-bottom": "none",
                    "padding": "35px 0"
                });
                $('header .member-actions').css({
                    "top": "26px",
                });
                $('header .navicon').css({
                    "top": "34px",
                });
            } else {
                $('section.navigation').removeClass('fixed');
                $('header').css({
                    "border-bottom": "solid 1px rgba(255, 255, 255, 0.2)",
                    "padding": "50px 0"
                });
                $('header .member-actions').css({
                    "top": "41px",
                });
                $('header .navicon').css({
                    "top": "48px",
                });
            }
        });
    });
    /***************** Smooth Scrolling ******************/

    $(function () {

        $('a[href*=#]:not([href=#])').click(function () {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 90
                    }, 2000);
                    return false;
                }
            }
        });

    });

    /********************** Social Share buttons ***********************/
    var share_bar = document.getElementsByClassName('share-bar');
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/platform.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);

    for (var i = 0; i < share_bar.length; i++) {
        var html = '<iframe allowtransparency="true" frameborder="0" scrolling="no"' +
            'src="https://platform.twitter.com/widgets/tweet_button.html?url=' + encodeURIComponent(window.location) + '&amp;text=' + encodeURIComponent(document.title) + '&amp;via=ramswarooppatra&amp;hashtags=ramandantara&amp;count=horizontal"' +
            'style="width:105px; height:21px;">' +
            '</iframe>' +

            '<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURIComponent(window.location) + '&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=21&amp;appId=101094500229731&amp;width=150" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:150px; height:21px;" allowTransparency="true"></iframe>' +

            '<div class="g-plusone" data-size="medium"></div>';

        // '<iframe src="https://plusone.google.com/_/+1/fastbutton?bsv&amp;size=medium&amp;url=' + encodeURIComponent(window.location) + '" allowtransparency="true" frameborder="0" scrolling="no" title="+1" style="width:105px; height:21px;"></iframe>';

        share_bar[i].innerHTML = html;
        share_bar[i].style.display = 'inline-block';
    }

    /********************** Embed youtube video *********************/
    $('.player').YTPlayer();


    /********************** Toggle Map Content **********************/
    $('#btn-show-map').click(function () {
        $('#map-content').toggleClass('toggle-map-content');
        $('#btn-show-content').toggleClass('toggle-map-content');
    });
    $('#btn-show-content').click(function () {
        $('#map-content').toggleClass('toggle-map-content');
        $('#btn-show-content').toggleClass('toggle-map-content');
    });

    /********************** Add to Calendar **********************/
    // Tạo multiple calendar events cho các sự kiện khác nhau
    var events = [
        {
            title: "Lễ Ăn Hỏi - Trung & Thư",
            start: new Date('Dec 13, 2025 09:00'),
            end: new Date('Dec 13, 2025 12:00'),
            address: 'Tam Xuân, Đà Nẵng, Việt Nam',
            description: "Lễ Ăn Hỏi của Trung & Thư. Liên hệ: Trung - 0384101606"
        },
        {
            title: "Tiệc Nhà Gái - Trung & Thư", 
            start: new Date('Dec 19, 2025 11:00'),
            end: new Date('Dec 19, 2025 15:00'),
            address: 'Tam Xuân, Đà Nẵng, Việt Nam',
            description: "Tiệc Nhà Gái của Trung & Thư. Liên hệ: Trung - 0384101606"
        },
        {
            title: "Lễ Thành Hôn & Tiệc Nhà Trai - Trung & Thư",
            start: new Date('Dec 21, 2025 10:00'),
            end: new Date('Dec 21, 2025 15:00'),
            address: 'Tam Xuân, Đà Nẵng, Việt Nam',
            description: "Lễ Thành Hôn & Tiệc Nhà Trai của Trung & Thư. Liên hệ: Trung - 0384101606"
        }
    ];

    var calendarHtml = '<div class="calendar-events">';
    events.forEach(function(event, index) {
        var calendar = createCalendar({
            options: {
                class: 'calendar-btn',
                id: 'calendar-' + index
            },
            data: event
        });
        calendarHtml += '<div class="calendar-event">';
        calendarHtml += '<h5>' + event.title + '</h5>';
        calendarHtml += '<p>' + event.start.toLocaleDateString('vi-VN') + ' - ' + 
                       event.start.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}) + 
                       ' đến ' + event.end.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}) + '</p>';
        calendarHtml += calendar;
        calendarHtml += '</div>';
    });
    calendarHtml += '</div>';

    $('#add-to-cal').html(calendarHtml);


    /********************** Attendance Status Toggle **********************/
    $('#attendance_status').on('change', function() {
        var status = $(this).val();
        
        if (status === 'attending') {
            $('#attending-fields').show();
            $('#declining-fields').hide();
            $('#transport-section').show();
            $('#qr-decline-section').hide();
            
            // Set required fields for attending
            $('#attending-fields input').prop('required', true);
            $('#declining-fields input').prop('required', false);
        } else if (status === 'declining') {
            console.log('Declining selected - showing QR section');
            $('#attending-fields').hide();
            $('#declining-fields').show();
            $('#transport-section').hide();
            $('#qr-decline-section').show();
            
            // Set required fields for declining
            $('#attending-fields input').prop('required', false);
            $('#declining-fields input').prop('required', true);
            
            // Generate QR code for declining
            generateDeclineQR();
        } else {
            $('#attending-fields').hide();
            $('#declining-fields').hide();
            $('#transport-section').hide();
            $('#qr-decline-section').hide();
            
            // Clear required fields
            $('#attending-fields input').prop('required', false);
            $('#declining-fields input').prop('required', false);
        }
    });

    /********************** Generate QR Code for Decline **********************/
    function generateDeclineQR() {
        // QR code đã được load từ hình ảnh, không cần generate nữa
        console.log('QR section should be visible now');
    }

    /********************** RSVP **********************/
    $('#rsvp-form').on('submit', function (e) {
        e.preventDefault();
        var data = $(this).serialize();

        $('#alert-wrapper').html(alert_markup('info', '<strong>Xin chờ một chút!</strong> Chúng mình đang lưu thông tin của bạn.'));

        // Get attendance status
        var attendanceStatus = $('#attendance_status').val();
        var inviteCode = attendanceStatus === 'attending' ? $('#invite_code').val() : $('#invite_code_decline').val();
        
        // Validate invite code (simple validation)
        if (!inviteCode || inviteCode.length < 6) {
            $('#alert-wrapper').html(alert_markup('danger', '<strong>Rất tiếc!</strong> Mã mời phải có ít nhất 6 số.'));
            return;
        }
        
        // Handle declining response
        if (attendanceStatus === 'declining') {
            $('#alert-wrapper').html(alert_markup('success', '<strong>Cảm ơn bạn đã phản hồi!</strong> Hẹn dịp khác 🌸'));
            return;
        }
        
        // Validate số ghế
                // Validate số ghế (đã có min/max trong HTML, không cần validation phức tạp)

        // Gửi data đến Google Apps Script
        var scriptUrl = 'YOUR_NEW_DEPLOYMENT_URL_HERE';
        
        console.log('RSVP Data:', data);
        
        // Debug: kiểm tra form fields
        console.log('Form fields count:', $('#rsvp-form input').length);
        $('#rsvp-form input').each(function(i, field) {
            console.log('Field ' + i + ':', field.name, '=', field.value);
        });
        
        // Form đã serialize bao gồm cả transport fields, không cần merge thêm
        var allData = data;
        
        console.log('All Data:', allData);
        
        $.post(scriptUrl, allData)
            .done(function (response) {
                console.log('RSVP Response:', response);
                if (response.result === "error") {
                    $('#alert-wrapper').html(alert_markup('danger', '<strong>Rất tiếc!</strong> ' + response.message));
                } else {
                    $('#alert-wrapper').html(alert_markup('success', '<strong>Cảm ơn bạn!</strong> ' + response.message));
                }
            })
            .fail(function (error) {
                console.log(error);
                $('#alert-wrapper').html(alert_markup('danger', '<strong>Rất tiếc!</strong> Có lỗi xảy ra, vui lòng thử lại sau. '));
            });
    });

});

/********************** Extras **********************/

// Google map
function initMap() {
    var location = {lat: 15.4874189, lng: 108.5806652}; // Tam Xuân, Đà Nẵng
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 16,
        center: location,
        scrollwheel: false,
        mapTypeId: 'roadmap'
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Địa điểm cưới - Tam Xuân, Đà Nẵng',
        animation: google.maps.Animation.DROP
    });

    // Thêm info window
    var infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 10px;"><h4>Địa điểm cưới</h4><p>Tam Xuân, Đà Nẵng<br>Liên hệ: Trung - 0384101606</p></div>'
    });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
}

function initBBSRMap() {
    var la_fiesta = {lat: 20.305826, lng: 85.85480189999998};
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: la_fiesta,
        scrollwheel: false
    });

    var marker = new google.maps.Marker({
        position: la_fiesta,
        map: map
    });
}

// alert_markup
function alert_markup(alert_type, msg) {
    return '<div class="alert alert-' + alert_type + '" role="alert">' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span>&times;</span></button></div>';
}

// QR Modal functions
function showQRModal(imageSrc, title) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalQR').src = imageSrc;
    document.getElementById('qrModal').style.display = 'block';
}

function closeQRModal() {
    document.getElementById('qrModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    var modal = document.getElementById('qrModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Guestbook functionality
$('#guestbook-form').on('submit', function(e) {
    e.preventDefault();
    
    var name = $('#guest-name').val();
    var email = $('#guest-email').val();
    var message = $('#guest-message').val();
    
    if (!name || !message) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Show loading message
    var submitBtn = $(this).find('button[type="submit"]');
    var originalText = submitBtn.text();
    submitBtn.text('Đang gửi...').prop('disabled', true);
    
    // Send to Google Apps Script
    $.ajax({
        url: 'https://script.google.com/macros/s/AKfycbwmCVEuLxjXEKgDHJNIjGMgPQfO_b-WKcTbI_Qg7QEVsEVtcQ4pOPJjWJJvL1lnNrGf/exec',
        method: 'POST',
        data: {
            action: 'guestbook',
            guest_name: name,
            guest_email: email,
            guest_message: message
        },
        success: function(response) {
            console.log('Guestbook response:', response);
            
            // Create new message element (hiển thị local)
            var newMessage = '<div class="message-item">' +
                '<div class="message-content">' +
                '<h4>' + name + '</h4>' +
                '<p>' + message + '</p>' +
                '<div class="message-meta">' +
                '<span class="message-author">- ' + name + '</span>' +
                '<span class="message-date">Vừa xong</span>' +
                '</div>' +
                '</div>' +
                '</div>';
            
            // Add to top of messages
            $('#guestbook-messages').prepend(newMessage);
            
            // Clear form
            $('#guestbook-form')[0].reset();
            
            // Show success message
            alert('Cảm ơn bạn đã gửi lời chúc! Lời chúc đã được lưu vào hệ thống 💕');
            
            // Reset button
            submitBtn.text(originalText).prop('disabled', false);
        },
        error: function(xhr, status, error) {
            console.error('Guestbook error:', error);
            alert('Có lỗi xảy ra khi gửi lời chúc. Vui lòng thử lại!');
            
            // Reset button
            submitBtn.text(originalText).prop('disabled', false);
        }
    });
});

// Music Player functionality
var musicPlayer;
var isPlaying = false;
var musicStarted = false;

// Check if YouTube API is loaded
function checkYouTubeAPI() {
    if (typeof YT !== 'undefined' && YT.Player) {
        youtubeApiLoaded = true;
        console.log('YouTube API is available');
        onYouTubeIframeAPIReady();
    } else {
        console.log('YouTube API not ready, retrying...');
        setTimeout(function() {
            checkYouTubeAPI();
        }, 1000);
    }
    
    // Fallback after 10 seconds
    setTimeout(function() {
        if (!youtubeApiLoaded) {
            console.log('YouTube API failed to load, using fallback');
            $('#music-status').text('Nhạc không khả dụng');
        }
    }, 10000);
}

// Load YouTube API
function onYouTubeIframeAPIReady() {
    console.log('YouTube API loaded');
    try {
        player = new YT.Player('youtube-player', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            },
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'showinfo': 0,
                'rel': 0,
                'modestbranding': 1,
                'loop': 1,
                'mute': 0,
                'start': 0,
                'origin': window.location.origin
            }
        });
        console.log('YouTube player created successfully');
    } catch (error) {
        console.error('Error creating YouTube player:', error);
        $('#music-status').text('Lỗi tải nhạc');
    }
}

// List of backup videos - Nhạc Đám Cưới Hay Nhất
var backupVideos = [
    'uQzGdzzDtLA',
    'OHqEONCuiFk',
    'O7yBcmD_g_s', // Để tôi ôm em bằng giai điệu này - LINH NẮNG (current - working)
    'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up (classic)
    '09R8_2nJtjg', // Maroon 5 - Sugar (wedding classic)
    'YQHsXMglC9A', // Adele - Hello (romantic)
    'kJQP7kiw5Fk'  // Despacito (romantic)
];
var currentVideoIndex = 0;
var retryCount = 0;
var maxRetries = 2; // Giới hạn số lần retry

function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    retryCount++;
    
    // Error codes: 2=not found, 5=not allowed, 100=not available, 150=not allowed
    if (event.data === 2 || event.data === 5 || event.data === 100 || event.data === 150) {
        if (retryCount <= maxRetries) {
            $('#music-status').text('Video không khả dụng - thử video khác (' + retryCount + '/' + maxRetries + ')');
            console.log('Video not available, trying alternative... (' + retryCount + '/' + maxRetries + ')');
            
            // Thử load video khác
            setTimeout(function() {
                if (player && typeof player.loadVideoById === 'function' && retryCount <= maxRetries) {
                    currentVideoIndex = (currentVideoIndex + 1) % backupVideos.length;
                    var nextVideoId = backupVideos[currentVideoIndex];
                    player.loadVideoById(nextVideoId);
                    console.log('Loading alternative video:', nextVideoId);
                } else {
                    console.log('Player not ready or loadVideoById not available');
                    // Chuyển sang backup audio ngay lập tức
                    switchToBackupAudio();
                }
            }, 2000);
        } else {
            // Dừng retry và chuyển sang backup audio
            switchToBackupAudio();
        }
    } else {
        $('#music-status').text('Lỗi video - thử lại sau');
    }
}

function switchToBackupAudio() {
    $('#music-status').text('Tất cả video không khả dụng');
    console.log('All videos failed, no backup audio available');
}

function onPlayerReady(event) {
    console.log('YouTube player ready');
    $('#music-status').text('Đang phát nhạc...');
    
    // Tự động phát nhạc với delay nhỏ
    setTimeout(function() {
        try {
            // Đảm bảo unmute và set volume
            if (typeof player.unMute === 'function') {
                player.unMute();
            }
            if (typeof player.setVolume === 'function') {
                player.setVolume(100);
            }
            
            // Thử phát nhạc
            if (typeof player.playVideo === 'function') {
                player.playVideo();
            }
            
            // Kiểm tra lại sau 2 giây và retry nếu cần
            setTimeout(function() {
                if (player && typeof player.getPlayerState === 'function') {
                    var state = player.getPlayerState();
                    console.log('Player state:', state);
                    
                    if (state === YT.PlayerState.PLAYING) {
                        isPlaying = true;
                        $('#play-pause-btn').addClass('playing');
                        $('#play-pause-btn i').removeClass('fa-play').addClass('fa-pause');
                        $('#music-status').text('Đang phát nhạc...');
                        console.log('Music is playing successfully');
                    } else {
                        console.log('Music failed to auto-play, user interaction required');
                        $('#music-status').text('Click để phát nhạc');
                    }
                } else {
                    console.log('Player methods not available');
                    $('#music-status').text('Click để phát nhạc');
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error auto-playing music:', error);
            $('#music-status').text('Click để phát nhạc');
        }
    }, 1000);
}

function onPlayerStateChange(event) {
    console.log('Player state changed:', event.data);
    
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        $('#play-pause-btn').addClass('playing');
        $('#play-pause-btn i').removeClass('fa-play').addClass('fa-pause');
        $('#music-status').text('Đang phát nhạc...');
        
        // Debug: Check volume and mute status
        console.log('Volume:', player.getVolume());
        console.log('Is muted:', player.isMuted());
        console.log('Music is now playing successfully!');
    } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        $('#play-pause-btn').removeClass('playing');
        $('#play-pause-btn i').removeClass('fa-pause').addClass('fa-play');
        $('#music-status').text('Đã tạm dừng');
    } else if (event.data == YT.PlayerState.ENDED) {
        isPlaying = false;
        $('#play-pause-btn').removeClass('playing');
        $('#play-pause-btn i').removeClass('fa-pause').addClass('fa-play');
        $('#music-status').text('Bài hát đã kết thúc');
    } else if (event.data == YT.PlayerState.BUFFERING) {
        $('#music-status').text('Đang tải nhạc...');
    } else if (event.data == YT.PlayerState.CUED) {
        $('#music-status').text('Sẵn sàng phát nhạc');
    }
}

// Play/Pause button
$('#play-pause-btn').on('click', function() {
    if (!player) {
        console.log('Player not ready');
        $('#music-status').text('Đang tải nhạc...');
        return;
    }
    
    try {
        if (isPlaying) {
            if (typeof player.pauseVideo === 'function') {
                player.pauseVideo();
            }
        } else {
            // Đảm bảo unmute và set volume khi click
            if (typeof player.unMute === 'function') {
                player.unMute();
            }
            if (typeof player.setVolume === 'function') {
                player.setVolume(100);
            }
            if (typeof player.playVideo === 'function') {
                player.playVideo();
            }
            console.log('YouTube play clicked - volume set to 100');
            
            // Kiểm tra lại sau 1 giây
            setTimeout(function() {
                if (player && typeof player.getPlayerState === 'function') {
                    var state = player.getPlayerState();
                    console.log('Manual play state:', state);
                    if (state === YT.PlayerState.PLAYING) {
                        isPlaying = true;
                        $('#play-pause-btn').addClass('playing');
                        $('#play-pause-btn i').removeClass('fa-play').addClass('fa-pause');
                        $('#music-status').text('Đang phát nhạc...');
                    }
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Error playing music:', error);
        $('#music-status').text('Lỗi phát nhạc');
    }
});

// Volume control
$('#volume-slider').on('input', function() {
    if (!player) return;
    
    var volume = $(this).val();
    player.setVolume(volume);
    
    if (volume == 0) {
        $('.music-volume i').removeClass('fa-volume-up').addClass('fa-volume-off');
    } else {
        $('.music-volume i').removeClass('fa-volume-off').addClass('fa-volume-up');
    }
    
    console.log('Volume set to:', volume + '%');
});

// Start checking for YouTube API when page loads
$(document).ready(function() {
    console.log('Document ready, checking YouTube API...');
    checkYouTubeAPI();
    
    // Simple autoplay approach - try after 2 seconds
    setTimeout(function() {
        var iframe = document.getElementById('youtube-player');
        if (iframe) {
            console.log('Attempting direct YouTube autoplay');
            // Force autoplay by reloading iframe
            var currentSrc = iframe.src;
            iframe.src = currentSrc + '&t=' + Date.now();
            console.log('Reloaded iframe for autoplay');
        }
    }, 2000);
    
    // Fallback: Thử phát nhạc khi user click vào trang
    var userInteracted = false;
    $(document).on('click', function() {
        if (!userInteracted) {
            userInteracted = true;
            
            // Hide music notification
            $('.music-notification, .music-notification-mobile').fadeOut(500);
            
            // Try YouTube player first
            if (player && !isPlaying) {
                try {
                    if (typeof player.unMute === 'function') {
                        player.unMute();
                    }
                    if (typeof player.setVolume === 'function') {
                        player.setVolume(100);
                    }
                    if (typeof player.playVideo === 'function') {
                        player.playVideo();
                    }
                    console.log('YouTube music started on user click');
                    
                    // Kiểm tra lại sau 1 giây
                    setTimeout(function() {
                        if (player && typeof player.getPlayerState === 'function') {
                            var state = player.getPlayerState();
                            console.log('Click play state:', state);
                            if (state === YT.PlayerState.PLAYING) {
                                isPlaying = true;
                                $('#play-pause-btn').addClass('playing');
                                $('#play-pause-btn i').removeClass('fa-play').addClass('fa-pause');
                                $('#music-status').text('Đang phát nhạc...');
                            } else {
                                // YouTube failed
                                console.log('YouTube failed');
                                $('#music-status').text('Video không khả dụng');
                            }
                        }
                    }, 1000);
                } catch (error) {
                    console.log('YouTube play failed:', error);
                    $('#music-status').text('Video không khả dụng');
                }
            } else {
                // No player available
                $('#music-status').text('Đang tải nhạc...');
            }
        }
    });
});

// MD5 Encoding
var MD5 = function (string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
        return (x ^ y ^ z);
    }

    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }

    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
};