
const mongoose = require('mongoose');

const seekerSkillSetSchema = new mongoose.Schema({
 userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User',
  },
  
  skillSet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'SkillSet',
  },
  skillLevel:{
      type:Number,
   }
});

const seekerSkillSet = mongoose.model('SeekerSkillSet', seekerSkillSetSchema);

exports.seekerSkillSet = seekerSkillSet; 