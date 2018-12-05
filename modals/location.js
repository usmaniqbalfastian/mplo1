
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    minlength: 2,
    maxlength: 255
  },
  state: {
    type: String,
    minlength: 2,
    maxlength: 255
  },
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  streetAdress: {
    type: String,
    minlength: 1,
    maxlength: 255
  },
  zip: {
    type: String,
    minlength: 1,
    maxlength: 255
  },  
  mapLocation:{
      logitude:{
          type:Number
      },
      latitude:{
          type:Number
      }
  }    
});

const location = mongoose.model('Location', locationSchema);

exports.location = location; 