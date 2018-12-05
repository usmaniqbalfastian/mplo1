const Joi = require('joi');
const mongoose = require('mongoose');

const companyImageSchema = new mongoose.Schema({
    companyImage: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10
      },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Company',
  }
});

const companyImage = mongoose.model('CompanyImage', companyImageSchema);

exports.companyImage = companyImage; 