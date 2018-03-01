var express = require('express');
var router = express.Router();

/* GET dashboard page. */

router.get('/', function (req, res, next) {
    res.render('translate', { title: 'BetaCall', subtitle: 'Translate' });
});



module.exports = router;


