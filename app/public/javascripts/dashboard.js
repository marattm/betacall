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


// // binding function to the button v1
// document.getElementById('btn-convert-voice').onclick = function () {
//     this.disabled = true;
//     this.innerHTML = 'Start Speaking!';

//     initTranscript(function (text) {
//         var textareaFrom = document.getElementById('textarea-from'); //input
//         var temporaryText = "";
//         temporaryText += text; // here it writes the voice, and variable
//         textareaFrom.value = temporaryText;
//     }, 'en-US');
// };

// ----------------------------

// binding function to the button v2
// document.getElementById('btn-convert-voice').onclick = function () {
//     this.disabled = true;
//     this.innerHTML = 'Start Speaking!';
    
//     initTranscript(function (text) {
//         var textareaFrom = document.getElementById('textarea-from'); //input
//         var temporaryText = "";
//         temporaryText += text; // here it writes the voice, and variable
//         textareaFrom.value = temporaryText;
//         submit_text()
//         }, 
    
//         'en-US');
// };

// binding function to the button v2 - still
//SEND TEXT -> SERVER

var submit_text = function (e) {
    $.getJSON('/speechToText', {   // request
        text: document.getElementById('textarea-from').value
    }, function (data) {        // response
        $('#saved').text(data);
    });

    // var msg = document.getElementById('textarea-from').value;
    // if (!msg) {
    //     return;
    // }
    // // send the message as an ordinary text
    // connection.send(msg);
    // $(this).val('');
    // // disable the input field to make the user wait until server
    // // sends back response
    // input.attr('disabled', 'disabled');

    // // we know that the first message sent from a user their name
    // if (myName === false) {
    //     myName = msg;
    // }

    return false;
};

/*
* -------------------------------------------------------------------------------------------------------------
*                                                       CHAT
* -------------------------------------------------------------------------------------------------------------
*/

$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', {
            text: 'Sorry, but your browser doesn\'t '
                + 'support WebSockets.'
        }));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket('wss://86772242.ngrok.io');

    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        status.text('Choose name:');
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', {
            text: 'Sorry, but there\'s some problem with your '
                + 'connection or the server is down.'
        }));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the message is not chunked or otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'color') { // first response from the server with user's color
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disabled').focus();
            // from now user can start sending messages
        } else if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (var i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                    json.data[i].color, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') { // it's a single message
            input.removeAttr('disabled'); // let the user write another message
            addMessage(json.data.author, json.data.text,
                json.data.color, new Date(json.data.time));
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };

    /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function (e) {
        if (e.keyCode === 13) {

            var msg = $(this).val(); //temporary commented 
            // var msg = document.getElementById('textarea-from').value;
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');

            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });

    document.getElementById('btn-convert-voice').onclick = function () {
        this.disabled = true;
        this.innerHTML = 'Start Speaking!';

        initTranscript(function (text) {
            
            $.getJSON('/speechToText', {   // request
                text: text
            }, function (data) {        // response
                // $('#saved').text(data);

                // sending message to the chatserver //
                var msg = data;
                if (!msg) {
                    return;
                }
                var original = " (original: " + text + ")";
                var styles = {
                    backgroundColor: "#ddd",
                    fontWeight: ""
                };
                // send the message as an ordinary text
                connection.send(msg + original);
                $(this).val('');
                // disable the input field to make the user wait until server
                // sends back response
                input.attr('disabled', 'disabled');

                // we know that the first message sent from a user their name
                if (myName === false) {
                    myName = msg;
                }
            });

        },

            'en-US');
    };

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function () {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate '
                + 'with the WebSocket server.');
        }
    }, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.prepend('<p><span style="color:' + color + '">' + author + '</span> @ ' +
            + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
            + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
            + ': ' + message + '</p>');
    }
});

