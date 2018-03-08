var recognition;

// /!\ DISCLAIMER /!\ only work on Chrome
// function that start the speech transcription
function initTranscript(callback, language) {
    if (recognition) recognition.stop();

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();


    //English by default
    recognition.lang = language || 'en-US';

    console.log('SpeechRecognition Language', recognition.lang);

    recognition.continuous = true;
    recognition.interimResults = true;

    //call whenever machine decides
    recognition.onresult = function (event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                callback(event.results[i][0].transcript);
            }
        }
    };

    recognition.onend = function () {
        if (recognition.dontReTry === true) {
            return;
        }
        initTranscript(callback, language);
    };

    recognition.onerror = function (e) {
        if (e.error === 'audio-capture') {
            recognition.dontReTry = true;
            alert('Failed capturing audio i.e. microphone. Please check console-logs for hints to fix this issue.');
            console.error('No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly. https://support.google.com/chrome/bin/answer.py?hl=en&answer=1407892');
            console.error('Original', e.type, e.message.length || e);
            return;
        }

        console.error(e.type, e.error, e.message);
    };

    recognition.start();
}


// binding function to the button v1
document.getElementById('btn-convert-voice').onclick = function () {
    this.disabled = true;
    this.innerHTML = 'Start Speaking!';

    initTranscript(function (text) {
        var textareaFrom = document.getElementById('textarea-from'); //input
        var temporaryText = "";
        temporaryText += text; // here it writes the voice, and variable
        textareaFrom.value = temporaryText;
    }, 'en-US');
};

// ----------------------------

// binding function to the button v2
document.getElementById('btn-convert-voice').onclick = function () {
    this.disabled = true;
    this.innerHTML = 'Start Speaking!';
    
    initTranscript(function (text) {
        var textareaFrom = document.getElementById('textarea-from'); //input
        var temporaryText = "";
        temporaryText += text; // here it writes the voice, and variable
        textareaFrom.value = temporaryText;
        submit_text()
        }, 
    
        'en-US');
};

// binding function to the button v2 - still
//SEND TEXT -> SERVER

var submit_text = function (e) {
    $.getJSON('/speechToText', {   // request
        text: document.getElementById('textarea-from').value
    }, function (data) {        // response
        $('#saved').text(data);
    });
    return false;
};


// ----------------------------

/*
// binding function to the button v3
document.getElementById('btn-convert-voice').onclick = function () {
    this.disabled = true;
    this.innerHTML = 'Start Speaking!';

    initTranscript(function (text) {
        var textareaFrom = document.getElementById('textarea-from'); //input
        var temporaryText = "";
        temporaryText += text; // here it writes the voice, and variable
        textareaFrom.value = temporaryText;
    }, 'en-US');
};

//SEND TEXT -> SERVER
$(function () {
    var submit_form = function (e) {
        $.getJSON('/speechToText', {   // request
            text: initTranscript.... // a continuer de cette maniere, on embed la fonction de transcript dans la finction ajax
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

*/