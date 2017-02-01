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
      imageDescription: String,
      label:String,
      subImages: Array
    }
  ],
  active: Boolean
});

module.exports = mongoose.model('Content', ContentSchema);