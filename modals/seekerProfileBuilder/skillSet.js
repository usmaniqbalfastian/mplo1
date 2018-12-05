
const mongoose = require('mongoose');

const skillSetSchema = new mongoose.Schema({
  skillSetName:{
      type:String,
      required:true,
      minlength:1,
      maxlength:255
  }
});

const SkillSet = mongoose.model('SkillSet', skillSetSchema);

exports.SkillSet = SkillSet; 