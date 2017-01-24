/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /feedbacks              ->  index
 * POST    /feedbacks              ->  create
 * GET     /feedbacks/:id          ->  show
 */

'use strict';

var _ = require('lodash');
var troubleTicket = require('./troubleTicket.model');


// Get list of contents
exports.index = function(req, res) {
  troubleTicket.find(function (err, troubleTickets) {
    if(err) { 
        return handleError(res, err); 
    }
    console.log('******CONTENTS*******');
    console.log(troubleTickets);
    return res.json(200, troubleTickets);
  });
};

// Get a single content
exports.show = function(req, res) {
  Feedback.findById(req.params.id, function (err, troubleTicket) {
    if(err) { return handleError(res, err); }
    if(!troubleTicket) { return res.send(404); }
    return res.json(troubleTicket);
  });
};

exports.sample = function(req, res) {
  console.log('sample get request made');
  res.end(200);
}

// Creates a new content in the DB.
exports.create = function(req, res) {
  troubleTicket.create(req.body, function(err, troubleTicket) {
    if(err) { 
        return handleError(res, err); 
    }
    return res.json(201, troubleTicket);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}