
const mongoose = require('mongoose');

const jobTypeSchema = new mongoose.Schema({
  jobTypeName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 10
  },
});
const JobType = mongoose.model('JobType', jobTypeSchema);

exports.JobType = JobType; 