'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
  demoId: Number,
  feedbackType: String,
  functionality: String,
  comments: String,
  experience: String,
  dateTime: String,
  active: Boolean
});

module.exports = mongoose.model('Feedback', FeedbackSchema);