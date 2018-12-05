const mongoose = require('mongoose');

const appliedsJobsSchema = new mongoose.Schema({
  userAccount: {
  type: mongoose.Schema.Types.ObjectId,   
  ref:'User',
  required:true,
  },
  appliedsJobs: [{//ids
    type: mongoose.Schema.Types.ObjectId,   
    ref:'Job',
    required:true,
    }],   
});

const AppliedsJobs = mongoose.model('AppliedsJob', appliedsJobsSchema);

exports.AppliedsJobs = AppliedsJobs; 