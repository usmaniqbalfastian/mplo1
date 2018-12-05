const Joi = require('joi');
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  bussinessStream: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'BussinessStream',
  },
  establishmentDate: {
    type: Date,
    required: true,
 },
 websiteUrl:{
     type:URL,
     required:true
}
  
});

const company = mongoose.model('Company', companySchema);

exports.company = company; 