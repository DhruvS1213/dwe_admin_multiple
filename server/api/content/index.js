'use strict';

var express = require('express');
var controller = require('./content.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:demoId', controller.show);
router.put('/:id', controller.update);
router.post('/imageFile', controller.uploadImage);
router.post('/uploads', controller.showImage);
router.get('/forgot/password', controller.forgotPassword);

module.exports = router;