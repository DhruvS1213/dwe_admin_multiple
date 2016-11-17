'use strict';

var express = require('express');
var controller = require('./content.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/title', controller.show);
router.put('/:id', controller.update);
router.post('/imageFile', controller.uploadImage);
router.post('/uploads', controller.showImage);

module.exports = router;