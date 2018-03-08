var express = require('express');
var app = express();

/* GET home page. */
app.get('/', function (req, res) {
    console.log('\n' + 'params: ' + JSON.stringify(req.params));
    console.log('body: ' + JSON.stringify(req.body));
    console.log('query: ' + JSON.stringify(req.query));
    res.json("Saved" + " " + req.query.name + " " + req.query.game + " " + req.query.score);
});

module.exports = app;