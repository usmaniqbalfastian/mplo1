const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required:true,
    },
  jobPostedBy: {
  type: mongoose.Schema.Types.ObjectId,   
  ref:'User',
  required:true,
  },
  jobTypeName: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },

  isCompanyNameHidden:{
    type:Boolean,
    required:true,
  },
  createdDate:{
    type:Date,
    required:true
  },
  applyDate:{
    type:Date,
  },
  description:{
    type:String,
  },
  address: {
    country:{
      type:String,
    },
    city:{
      type:String,
    },
    mapLocation:{
      latitude:{
        type:Number,
      },
      longitude:{
        type:Number,
      }
    }
  },
  isActive:{
    type:Boolean,
  },
  minSalary:{
    type:Number,
  },
  maxSalary:{
    type:Number,
  },
  skills:[{
    type:String
  }]
});

const Job = mongoose.model('Job', jobSchema);

exports.Job = Job; 