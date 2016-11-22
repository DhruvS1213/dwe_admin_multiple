/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /feedbacks              ->  index
 * POST    /feedbacks              ->  create
 * GET     /feedbacks/:id          ->  show
 */

'use strict';

var _ = require('lodash');
var Feedback = require('./feedback.model');


// Get list of contents
exports.index = function(req, res) {
  Feedback.find(function (err, feedbacks) {
    if(err) { 
        return handleError(res, err); 
    }
    console.log('******CONTENTS*******');
    console.log(feedbacks);
    return res.json(200, feedbacks);
  });
};

// Get a single content
exports.show = function(req, res) {
  Feedback.findById(req.params.id, function (err, feedback) {
    if(err) { return handleError(res, err); }
    if(!feedback) { return res.send(404); }
    return res.json(feedback);
  });
};

exports.sample = function(req, res) {
  console.log('sample get request made');
  res.end(200);
}

// Creates a new content in the DB.
exports.create = function(req, res) {
  Feedback.create(req.body, function(err, feedback) {
    if(err) { 
        return handleError(res, err); 
    }
    return res.json(201, feedback);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}