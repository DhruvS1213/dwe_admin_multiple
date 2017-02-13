'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var troubleTicketSchema = new Schema({
  demoId: Number,
  userName: String,
  comments: String,
  issue: String,
  functionality : String,
  dateTime : String,
  active: Boolean
});

module.exports = mongoose.model('troubleTicket', troubleTicketSchema);