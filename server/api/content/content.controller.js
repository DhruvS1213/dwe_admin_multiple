/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /contents              ->  index
 * POST    /contents              ->  create
 * GET     /contents/:id          ->  show
 */

'use strict';

var _ = require('lodash');
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
var Content = require('./content.model');
var url = 'http://localhost:9000';
// var sendgrid = require("sendgrid")("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");
var Sendgrid = require("sendgrid-web");


// Get list of contents
exports.index = function(req, res) {
  Content.find(function (err, contents) {
    if(err) { 
        return handleError(res, err); 
    }
    return res.json(200, contents);
  });
};

exports.showImage = function(req, res){
    console.log(res.body);
};

// Get a single content
exports.show = function(req, res) {
  console.log('invoked');
  //Content.findById(req.params.id, function (err, content) {
  Content.findOne({demoId: req.params.demoId}, function(err, content){
    if(err) { return handleError(res, err); }
    if(!content) { return res.send(404); }
    return res.json(content);
  });
  
};

// Creates a new content in the DB.
exports.create = function(req, res) {
  Content.create(req.body, function(err, content) {
    if(err) { 
        return handleError(res, err); 
    }
    return res.json(201, content);
  });
};


exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Content.findById(req.params.id, function (err, content) {
    if (err) { return handleError(res, err); }
    if(!content) { return res.send(404); }
    var updated = _.extend(content, req.body);
    updated.save(function (err, updated_content) {
      if (err) { return handleError(res, err); }
      return res.json(200, updated_content);
    });
  });
};

exports.uploadImage = function(req, res){
    upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
    });
};

exports.forgotPassword = function (req, res) {
  console.log('invoked server side');
  var sendgrid = new Sendgrid({
      user: "dhruv.shah4192@gmail.com",
      key: "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"
    });
 
  sendgrid.send({
    to: 'dhruv.shah4192@gmail.com',
    from: 'dhruv.shah4192@gmail.com',
    subject: 'Hello world!',
    html: '<h1>Hello world!</h1>'
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success.");
    }
  });
  res.end();
}

var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './server/temp/');
        },
        filename: function (req, file, cb) {
            
            var extension = file.originalname.split('.')[file.originalname.split('.').length -1];
            if (extension == 'jpg' || extension == 'png' || extension == 'jpeg' || extension == 'bmp' || extension == 'tiff') {
                cb(null, file.originalname);
                
            }
            if (extension == 'mp4' || extension == 'ogv' || extension == 'wmv' || extension == 'webm') {
                cb(null, file.originalname);
            }
        }
    });

   var upload = multer({ //multer settings
                    storage: storage
                }).single('file');



function handleError(res, err) {
  return res.send(500, err);
}