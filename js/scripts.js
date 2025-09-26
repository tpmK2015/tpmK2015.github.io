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

    /***************** Init Functions ******************/

    $(function () {
        App().init();
    });

});

function App() {
    return {
        init: function () {
            this.parallax();
            this.video();
            this.menu();
            this.testimonial();
            this.counter();
            this.masonry();
            this.scrollSpy();
            this.contactForm();
            this.rsvpForm();
            this.transportForm();
            this.attendanceForm();
            this.qrCode();
        },

        parallax: function () {
            if ($('.parallax').length > 0) {
                $('.parallax').parallax("50%", 0.1);
            }
        },

        video: function () {
            if ($('.player').length > 0) {
                $(".player").mb_YTPlayer();
            }
        },

        menu: function () {
            $('.header-nav').on('click', 'a', function (e) {
                if ($(this).hasClass('external')) {
                    return;
                }
                e.preventDefault();
                var target = this.hash;
                if (target) {
                    $('html, body').animate({
                        scrollTop: $(target).offset().top
                    }, 750, 'swing');
                    
                    // Close mobile menu after navigation
                    $('.header-nav').removeClass('mobile-open');
                    $('.mobile-menu-toggle i').removeClass('fa-times').addClass('fa-bars');
                }
            });
            
            // Handle scroll to bottom button
            $('#scroll-to-bottom').on('click', function (e) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: $(document).height()
                }, 1000, 'swing');
            });
        },

        testimonial: function () {
            // Testimonial carousel disabled - plugin not available
        },

        counter: function () {
            // Counter animation disabled - plugin not available
        },

        masonry: function () {
            // Masonry layout disabled - plugin not available
        },

        scrollSpy: function () {
            if ($('.header-nav').length > 0) {
                $('body').scrollspy({
                    target: '.header-nav',
                    offset: 80
                });
            }
        },

        contactForm: function () {
            $('#contact-form').on('submit', function (e) {
                e.preventDefault();
                var $form = $(this);
                var $submit = $form.find('button[type="submit"]');
                var $status = $form.find('.status');
                
                $submit.prop('disabled', true).text('Đang gửi...');
                
                // Simulate form submission
                setTimeout(function() {
                    $status.html('<div class="alert alert-success">Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.</div>');
                    $submit.prop('disabled', false).text('Gửi tin nhắn');
                    $form[0].reset();
                }, 2000);
            });
        },

        rsvpForm: function () {
            $('#rsvp-form').on('submit', function (e) {
                e.preventDefault();
                var $form = $(this);
                var $submit = $form.find('button[type="submit"]');
                var $status = $form.find('.status');
                
                // Validate form
                var attendanceStatus = $('#attendance_status').val();
                if (!attendanceStatus) {
                    $status.html('<div class="alert alert-danger">Vui lòng chọn trạng thái tham dự.</div>');
                    return;
                }
                
                if (attendanceStatus === 'attending') {
                    var inviteCode = $('#invite_code').val();
                    if (!inviteCode) {
                        $status.html('<div class="alert alert-danger">Vui lòng nhập mã mời.</div>');
                        return;
                    }
                } else if (attendanceStatus === 'declining') {
                    var inviteCodeDecline = $('#invite_code_decline').val();
                    if (!inviteCodeDecline) {
                        $status.html('<div class="alert alert-danger">Vui lòng nhập mã mời.</div>');
                        return;
                    }
                }
                
                $submit.prop('disabled', true).text('Đang gửi...');
                
                // Get form data
                var formData = {
                    name: $('input[name="name"]').val(),
                    email: '', // Không quan trọng
                    attendance_status: attendanceStatus,
                    extras: $('#extras').val() || 0,
                    invite_code: (attendanceStatus === 'attending') ? $('#invite_code').val() : $('#invite_code_decline').val(),
                    transport_seats: $('#transport_seats').val() || 0,
                    transport_phone: $('#transport_phone').val()
                };
                
                // Send to Google Apps Script
                $.ajax({
                    url: 'https://script.google.com/macros/s/AKfycbxbT20wJlX3fgzm1A384zn44zp3D22WNYzlei03MhE4g5i6Qit3m8eOgUDp6Dmhuir9Tg/exec',
                    method: 'POST',
                    data: formData,
                    success: function(response) {
                        var message = (attendanceStatus === 'attending') 
                            ? 'Cảm ơn bạn đã xác nhận tham dự! Chúng tôi rất mong được gặp bạn.'
                            : 'Cảm ơn bạn đã phản hồi! Hẹn dịp khác nhé!';
                        $status.html('<div class="alert alert-success">' + message + '</div>');
                        $submit.prop('disabled', false).text('Gửi xác nhận');
                        $form[0].reset();
                    },
                    error: function(xhr, status, error) {
                        $status.html('<div class="alert alert-danger">Có lỗi xảy ra. Vui lòng thử lại sau.</div>');
                        $submit.prop('disabled', false).text('Gửi xác nhận');
                    }
                });
            });
        },

        transportForm: function () {
            $('#transport-form').on('submit', function (e) {
                e.preventDefault();
                var $form = $(this);
                var $submit = $form.find('button[type="submit"]');
                var $status = $form.find('.status');
                
                $submit.prop('disabled', true).text('Đang gửi...');
                
                // Simulate form submission
                setTimeout(function() {
                    $status.html('<div class="alert alert-success">Cảm ơn bạn đã đăng ký xe đưa đón! Chúng tôi sẽ liên hệ lại.</div>');
                    $submit.prop('disabled', false).text('Đăng ký xe');
                    $form[0].reset();
                }, 2000);
            });
        },

        attendanceForm: function () {
            $('#attendance_status').on('change', function() {
                var status = $(this).val();
                console.log('Attendance status changed to:', status); // Debug log
                
                if (status === 'attending') {
                    $('#attending-fields').show();
                    $('#declining-fields').hide();
                    $('#qr-section').hide();
                } else if (status === 'declining') {
                    $('#attending-fields').hide();
                    $('#declining-fields').show();
                    $('#qr-section').show();
                    console.log('Showing QR section'); // Debug log
                } else {
                    $('#attending-fields').hide();
                    $('#declining-fields').hide();
                    $('#qr-section').hide();
                }
            });
        },

        qrCode: function () {
            // QR Code functionality
            window.showQRModal = function(src, title) {
                $('#modalTitle').text(title);
                $('#modalQR').attr('src', src);
                $('#qrModal').show();
            };
            
            window.closeQRModal = function() {
                $('#qrModal').hide();
            };
            
            // Close modal when clicking outside
            $('#qrModal').on('click', function(e) {
                if (e.target === this) {
                    closeQRModal();
                }
            });
        }
    };
}

// Alert markup function
function alert_markup(alert_type, msg) {
    return '<div class="alert alert-' + alert_type + ' alert-dismissible" role="alert">' +
           '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
           '<span aria-hidden="true">&times;</span></button>' + msg + '</div>';
}

// Generate decline QR function
function generateDeclineQR() {
    // This function would generate QR codes for declining guests
    // For now, it's a placeholder
    console.log('Generating decline QR codes...');
}
