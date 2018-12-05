const mongoose = require('mongoose');

const discardsJobsSchema = new mongoose.Schema({
  userAccount: {
  type: mongoose.Schema.Types.ObjectId,   
  ref:'User',
  required:true,
  },
  discardsJobs: [{//ids
    type: mongoose.Schema.Types.ObjectId,   
    ref:'Job',
    required:true,
    }],   
});

const DiscardsJobs = mongoose.model('DiscardsJob', discardsJobsSchema);

exports.DiscardsJobs = DiscardsJobs; 