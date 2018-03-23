var express = require('express');
var app = express();

app.get('/', function(req, res, next) {
    
    try {
    // translation function call

        function Translator() {

            //needed
            this.speakTextUsingGoogleSpeaker = function (args) {
                var textToSpeak = args.textToSpeak;
                var targetLanguage = args.targetLanguage;

                textToSpeak = textToSpeak.replace(/%20| /g, '+');
                if (textToSpeak.substr(0, 1) == ' ' || textToSpeak.substr(0, 1) == '+') {
                    textToSpeak = textToSpeak.substr(1, textToSpeak.length - 1);
                }

                var audio_url = 'https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=' + textToSpeak.length + '&tl=' + targetLanguage + '&q=' + textToSpeak;

                if (args.callback) args.callback(audio_url);
                else {
                    var audio = document.createElement('audio');
                    audio.onerror = function (event) {
                        audio.onerror = null;
                        audio.src = 'https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=' + textToSpeak.length + '&tl=' + targetLanguage + '&q= ' + textToSpeak;
                    };
                    audio.src = audio_url;
                    audio.autoplay = true;
                    audio.play();
                }
            };


            //needed
            this.translateLanguage = function (text, config) {
                config = config || {};
                // please use your own API key; if possible
                var api_key = config.api_key || Google_Translate_API_KEY;

                var newScript = document.createElement('script');
                newScript.type = 'text/javascript';

                var sourceText = encodeURIComponent(text); // escape

                var randomNumber = 'method' + (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
                window[randomNumber] = function (response) {
                    if (response.data && response.data.translations[0] && config.callback) {
                        config.callback(response.data.translations[0].translatedText);
                        return;
                    }

                    if (response.error && response.error.message == 'Daily Limit Exceeded') {
                        config.callback('Google says, "Daily Limit Exceeded". Please try this experiment a few hours later.');
                        return;
                    }

                    if (response.error) {
                        console.error(response.error.message);
                        return;
                    }

                    console.error(response);
                };

                var source = 'https://www.googleapis.com/language/translate/v2?key=' + api_key + '&target=' + (config.to || 'en-US') + '&callback=window.' + randomNumber + '&q=' + sourceText;
                newScript.src = source;
                document.getElementsByTagName('head')[0].appendChild(newScript);
            };


            //Needed
            this.getListOfLanguages = function (callback, config) {
                config = config || {};

                var api_key = config.api_key || Google_Translate_API_KEY;

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        var response = JSON.parse(xhr.responseText);

                        if (response && response.data && response.data.languages) {
                            callback(response.data.languages);
                            return;
                        }

                        if (response.error && response.error.message === 'Daily Limit Exceeded') {
                            console.error('Text translation failed. Error message: "Daily Limit Exceeded."');
                            return;
                        }

                        if (response.error) {
                            console.error(response.error.message);
                            return;
                        }

                        console.error(response);
                    }
                }
                var url = 'https://www.googleapis.com/language/translate/v2/languages?key=' + api_key + '&target=en';
                xhr.open('GET', url, true);
                xhr.send(null);
            };



            var Google_Translate_API_KEY = '';
        }



        
        // TRANSLATION 
        var translator = new Translator();
    
        // var MessageTranslated;
    
        // var languages = getLanguages();
        // var temporaryMessageTranslated;

        //get the value from the speech recognized
        translator.translateLanguage(req.query.text, { // here i need to put the message.data from the websocket, textareaFrom.value === temporaryText variable
            // from: languages.from,
            // to: languages.to,
            from: "english",
            to: "spanish",
            callback: function (translatedText) {
                res.json(translatedText)
                // temporaryMessageTranslated += translatedText; // here i need to send the result to the websocket, textareaTo.value === temporaryMessageTranslated
                // sessionStorage.setItem('textarea-to', temporaryMessageTranslated);

            }
        });

        // res.json(MessageTranslated)
        
    } catch (error) {
        
        console.log("translation error");
        console.error(error);
        res.json("translation error");

    }

});

module.exports = app;
