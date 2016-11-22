'use strict';

var express = require('express');
var controller = require('./feedback.controller');

var router = express.Router();

router.post('/', controller.create);
router.get('/', controller.index);
router.get('/title', controller.show);

module.exports = router;