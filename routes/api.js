var express = require('express');
var router = express.Router();
const modules = require(require('path').resolve(process.cwd(), 'modules.js'));
let loader = require('./loader');


// add the router in here
router.use(require('./access'));
router.use('/wx', require('./wx'));

router.get('/', function (req, res) {
    res.render('index', { title: 'API' });
});

module.exports = router;
