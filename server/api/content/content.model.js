'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContentSchema = new Schema({
  demoId: Number,
  title: String,
  textContent: String,
  videoContent: String,
  imageDetail : [
    {
      id: Number,
      imagePath: String,
      imageDescription: String
    }
  ],
  active: Boolean
});

module.exports = mongoose.model('Content', ContentSchema);