define(['jquery'], function($) {

    // Register page logic
    return function() {
        var warnUsername = false;
        var warnPassword = false;
        var warnPassword2 = false;

        // Registration handler
        $('#btn_create').click(function() {
            var username = $('#txt_new_username').val();
            var password = $('#txt_new_password').val();
            var password2 = $('#txt_new_password2').val();
            // Make sure the fields are not empty
            if (username.length === 0) {
                $('#warn_new_username').html('<-- Username cannot be empty');
                warnUsername = true;
            }
            if (password.length === 0) {
                $('#warn_new_password').html('<-- Password cannot be empty');
                warnPassword = true;
            }
            if (password2.length === 0) {
                $('#warn_new_password2').html('<-- Password cannot be empty');
                warnPassword2 = true;
            }
            if (warnUsername || warnPassword || warnPassword2) {
                return;
            }
            // Make sure passwords match
            if (password !== password2) {
                // Clear both passwords and indicate error
                $('#txt_new_password').val('');
                $('#txt_new_password2').val('');
                $('#warn_register').html('Passwords do not match. Try again.');
                return;
            }
            // Send registration request to server
            $.ajax({
                type: "POST",
                url: '/register',
                data: {
                    player: username,
                    password: password
                },
                success: function(data) {
                    if (!data.success) {
                        // Registration attempt was not successful
                        // Clear password and prompt to retry
                        $('#txt_new_password').val('');
                        $('#txt_new_password2').val('');
                        $('#warn_register').html('Username already exists. Try again.');
                    } else {
                        // Hide login page and display lobby
                        $('#registration').addClass('hidden');
                        $('#content').removeClass('hidden').trigger('start', [username]);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#warn_register').html('AJAX call failed: ' + textStatus + ' ' + errorThrown);
                },
                dataType: "json"
            });
        });

        // Username text field changed handler
        $('#txt_new_username').keyup(function() {
            if (warnUsername && $(this).val().length > 0) {
                $('#warn_new_username').html('');
                warnUsername = false;
            }
        });

        // Password text field changed handler
        $('#txt_new_password').keyup(function() {
            if (warnPassword && $(this).val().length > 0) {
                $('#warn_new_password').html('');
                warnPassword = false;
            }
        });

        // Password2 text field changed handler
        $('#txt_new_password2').keyup(function() {
            if (warnPassword2 && $(this).val().length > 0) {
                $('#warn_new_password2').html('');
                warnPassword2 = false;
            }
        });
    };
});
