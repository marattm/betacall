var unirest = require('unirest');

var query = "where%20are%20my%20sunglasses";
var targetLang = "fr";
var sourceLang = "en";
unirest.get(
    "https://google-translate-proxy.herokuapp.com/api/translate?"
    + "query=" + query 
    + "&targetLang=" + targetLang 
    + "&sourceLang=" + sourceLang)
    .end(function (result) {
        console.log(result.body.extract.translation); //, result.headers, result.body
    });

