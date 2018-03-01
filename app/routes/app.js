var express = require('express');
var path = require('path');


var app = express();


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/dashboard', function (req, res) {
    res.sendFile(path.join(__dirname + '/../html/dashboard.html'));
});

app.get('/translate', function (req, res) {
    res.sendFile(path.join(__dirname + '/../html/translate.html'));
});

app.get('/chat', function (req, res) {
    res.sendFile(path.join(__dirname + '/../html/chat.html'));
});



app.listen(3000, function(){
	console.info('Server listening on port ' + 3000);
});
