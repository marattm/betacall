//SAVE SCORE
$(function () {
    var submit_form = function (e) {
        $.getJSON('/savescore', {   // request
            name: $('input[name="input_name"]').val(),
            game: $('input[name="input_game"]').val(),
            score: $('input[name="input_score"]').val()
        }, function (data) {        // response
            $('#saved').text(data);
            $('input[name=name]').focus().select();
        });
        return false;
    };

    // binding
    $('a#submit_score').bind('click', submit_form);
    
    $('input[type=text]').bind('keydown', function (e) {
        if (e.keyCode == 13) {
            submit_form(e);
        }
    });

    // autofocus on the form
    $('input[name=a]').focus();
});