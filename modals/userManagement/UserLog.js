const Joi = require('joi');
const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  lastLoginDate:{
      type:Date,
      required:true
  },
  lastApplyDate:{
      type:Date,
  }

});

const UserLog = mongoose.model('UserLog', userLogSchema);

exports.UserLog = UserLog; 