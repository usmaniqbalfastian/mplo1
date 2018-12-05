
const Joi = require('joi');
function validateUserLog(userLog) {
    const schema = {
      name: Joi.string().min(2).max(10).required(),
    };
  
    return Joi.validate(userLog, schema);
  }