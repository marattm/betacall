var express = require('express');
var app = express();

app.get('/', function(req, res, next) {
    // translation function call
    res.json(req.query.text)
});

module.exports = app;
