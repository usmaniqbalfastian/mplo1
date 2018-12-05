const Joi = require('joi');
const mongoose = require('mongoose');

const bussinessStreamSchema = new mongoose.Schema({
  bussinessStreamName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 10
  }
});

const bussinessStream = mongoose.model('BussinessStream', bussinessStreamSchema);

exports.bussinessStream = bussinessStream; 