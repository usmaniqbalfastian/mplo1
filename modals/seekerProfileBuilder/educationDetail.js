
const mongoose = require('mongoose');

const educationDetailSchema = new mongoose.Schema({
 userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User',
  },
  certificateDegreeName: {
    type:String,
    minlength:1,
    maxlength:255,
    required:true
  },
  major:{
      type:String,
      minlength:1,
      maxlength:255,
      required:true
  },
  instituteUniversityName:{
      type:String,
      minlength:1,
      maxlength:255,
      required:true
      },
   startingDate:{
       type:Date,
       required:true,
     },
   endingDate:{
        type:Date,
      },
    percentage:{
        type:Number,
    },
    cgpa:{
        type:Number,
    }        
});

const EducationDetail = mongoose.model('EducationDetail', educationDetailSchema);

exports.EducationDetail = EducationDetail; 