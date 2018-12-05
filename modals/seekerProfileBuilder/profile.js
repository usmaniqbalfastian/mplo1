const Joi = require('joi');
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
 userAccount: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref:'User',
 },
 currentSalary: {
    type:Number,
  },
 currency:{
      type:String,
  },
  cv:{
    type:String,
    minlength:1,
    maxlength:255
  },
  personalStatement:{
    type:String,
    minlength:1,
    maxlength:1000
  },
  coverLetter:{
    type:String,
    minlength:1,
    maxlength:1000
  },
  skills:[{
    type:String,
    minlength:1,
    maxlength:255,
  }]

});

const Profile = mongoose.model('Profile', ProfileSchema);

exports.Profile = Profile; 