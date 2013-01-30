define(['jquery'], function($) {

    // Login page logic
    return function() {
        var warnUsername = false;
        var warnPassword = false;

        // Register handler
        $('#btn_register').click(function() {
            // Hide login page and display lobby
            $('#login').addClass('hidden');
            $('#registration').removeClass('hidden');
        });

        // Login handler
        $('#btn_login').click(function() {
            var username = $('#txt_username').val();
            var password = $('#txt_password').val();
            // Make sure the username and password fields are not empty
            if (username.length === 0) {
                $('#warn_username').html('<-- Username cannot be empty');
                warnUsername = true;
            }
            if (password.length === 0) {
                $('#warn_password').html('<-- Password cannot be empty');
                warnPassword = true;
            }
            if (warnUsername || warnPassword) {
                return;
            }
            // Send login request to server
            $.ajax({
                type: "POST",
                url: '/login',
                data: {
                    player: username,
                    password: password
                },
                success: function(data) {
                    if (!data.success) {
                        // Login attempt was not successful
                        // Clear password and prompt to retry
                        $('#txt_password').val('');
                        $('#warn_login').html('Invalid username or password. Try again.');
                    } else {
                        // Hide login page and display lobby
                        $('#login').addClass('hidden');
                        $('#content').removeClass('hidden').trigger('start', [username]);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#warn_login').html('AJAX call failed: ' + textStatus + ' ' + errorThrown);
                },
                dataType: "json"
            });
        });

        // Username text field changed handler
        $('#txt_username').keyup(function() {
            if (warnUsername && $(this).val().length > 0) {
                $('#warn_username').html('');
                warnUsername = false;
            }
        });

        // Password text field changed handler
        $('#txt_password').keyup(function() {
            if (warnPassword && $(this).val().length > 0) {
                $('#warn_password').html('');
                warnPassword = false;
            }
        });
    };
});
