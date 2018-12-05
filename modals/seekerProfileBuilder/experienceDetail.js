const mongoose = require('mongoose');

const experienceDetailSchema = new mongoose.Schema({
 userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User',
  },
  isCurrentJob:{
   type:Boolean
  },
  startDate: {
    type:Date,
    required:true
  },
  endDate: {
    type:Date,
  },
  jobTitle:{
    type:String,
    minlength:1,
    maxlength:255,
    required:true
},
companyName:{
    type:String,
    minlength:1,
    maxlength:255,
    required:true
},
description:{
    type:String,
}
});

const ExperienceDetail = mongoose.model('ExperienceDetail', experienceDetailSchema);

exports.ExperienceDetail = ExperienceDetail; 