var recognition;

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