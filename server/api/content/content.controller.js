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
var url = 'http://localhost:9000'

// Get list of contents
exports.index = function(req, res) {
  Content.find(function (err, contents) {
    if(err) { 
        return handleError(res, err); 
    }
    console.log('******CONTENTS*******');
    console.log(contents);
    return res.json(200, contents);
  });
};

exports.showImage = function(req, res){
    console.log(res.body);
};

// Get a single content
exports.show = function(req, res) {
  Content.findById(req.params.id, function (err, content) {
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
    console.log('request');
    console.log(req.body);
    console.log('content');
    console.log(content);
    var updated = _.extend(content, req.body);
    console.log('merged content');
    console.log(updated);
    updated.save(function (err, updated_content) {
      if (err) { return handleError(res, err); }
      return res.json(200, updated_content);
    });
  });
};

exports.uploadImage = function(req, res){
    console.log('*** UPLOAD IMAGE FUNCTION ***');
    upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
    });
};

 var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log('filename', file.originalname);
            cb(null, './server/temp/');
        },
        filename: function (req, file, cb) {
            
            var extension = file.originalname.split('.')[file.originalname.split('.').length -1];
            if (extension == 'jpg' || extension == 'png' || extension == 'jpeg' || extension == 'bmp' || extension == 'tiff') {
                console.log(' extension', extension);
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