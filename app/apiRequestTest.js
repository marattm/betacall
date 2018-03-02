var unirest = require('unirest');

unirest.post("https://translate.google.com/#fr/en/bonjour%20monsieur")
    .end(function (result) {
        console.log(result.status, result.headers, result.body);
    });

