var express = require('express');
var app = express();
var unirest = require('unirest');

app.get('/', function(req, res, next) {
    
    try {
    // translation function call

    

    var query = req.query.text;
    var targetLang = "fr";
    var sourceLang = "en";
    unirest.get(
        "https://google-translate-proxy.herokuapp.com/api/translate?"
        + "query=" + query
        + "&targetLang=" + targetLang
        + "&sourceLang=" + sourceLang)
        .end(function (result) {
            res.json(result.body.extract.translation);
        });



        
        
    } catch (error) {
        
        console.log("translation error");
        console.error(error);
        res.json("translation error");

    }

});

module.exports = app;
