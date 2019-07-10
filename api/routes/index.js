var express = require('express');
var router = express.Router();
const { search } = require('./elastic');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/search', (...props) => {
  search(...props);
});


module.exports = router;
