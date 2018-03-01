var express = require('express');
var router = express.Router();

/* GET dashboard page. */

router.get('/', function (req, res, next) {
    res.render('chat', { title: 'BetaCall', subtitle: 'Chat' });
});

module.exports = router;



