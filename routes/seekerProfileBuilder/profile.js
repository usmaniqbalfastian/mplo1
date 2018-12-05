
const {Profile} = require('../../modals/seekerProfileBuilder/profile');
const {SkillSet}=require('../../modals/seekerProfileBuilder/skillSet');
const {EducationDetail} = require('../../modals/seekerProfileBuilder/educationDetail');
const {ExperienceDetail} = require('../../modals/seekerProfileBuilder/experienceDetail');
const {User} = require('../../modals/userManagement/UserAccount');
const Joi = require('joi');
const _=require('lodash');
const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
//update current salary ,currency,cv,personal statement,cover letter 
//url/profile/
router.get('/viewProfile/:userId', async (req, res) => {
  try{
    const user = await User.findOne({_id:req.params.userId}).select('-__v -password');
    if(!user){
      return res.status(404).send({status:404,error:'no user found'});
    }
  const experienceDetails = await ExperienceDetail.find({userAccount:req.params.userId}).select('-userAccount -__v');
  const educationDetail = await EducationDetail.find({userAccount:req.params.userId}).select('-userAccount -__v');
  const profile = await Profile.findOne({userAccount:req.params.userId}).select('-userAccount -__v');

  return res.status(200).send({status:200,profile:{
    _id:user._id,
    firstName:user.firstName,
    lastName:user.lastName,
    userTypeName:user.userTypeName,
    email:user.email,
    contactNo:user.contactNo,
    userImage:user.userImage,
    registrationDate:user.registrationDate,
    experiences:experienceDetails,
    education:educationDetail,
    currentSalary:profile.currentSalary||null,
    currency:profile.currency||null,
    cv:profile.cv||null,
    personalStatement:profile.personalStatement||null,
    coverLetter:profile.coverLetter||null,
    skills:profile.skills||[],
   }
    });
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});
router.get('/myProfile/',auth, async (req, res) => {
  try{
    const user = await User.findOne({_id:req.user._id}).select('-__v -password');
    if(!user){
      return res.status(404).send({status:404,error:'no user found'});
    }
  const experienceDetails = await ExperienceDetail.find({userAccount:req.user._id}).select('-userAccount -__v');
  const educationDetail = await EducationDetail.find({userAccount:req.user._id}).select('-userAccount -__v');
  const profile = await Profile.findOne({userAccount:req.user._id}).select('-userAccount -__v');
  
  return res.status(200).send({status:200,profile:{
    _id:user._id,
    firstName:user.firstName,
    lastName:user.lastName,
    userTypeName:user.userTypeName,
    email:user.email,
    contactNo:user.contactNo,
    userImage:user.userImage,
    registrationDate:user.registrationDate,
    experiences:experienceDetails,
    education:educationDetail,
    currentSalary:profile.currentSalary||null,
    currency:profile.currency||null,
    cv:profile.cv||null,
    personalStatement:profile.personalStatement||null,
    coverLetter:profile.coverLetter||null,
    skills:profile.skills||null,
   }
    });
  }
  catch(ex){
    return res.status(500).send({status:500,error:'something going wrong'});
  }
});
//add or update 
router.post('/updateProfile',auth,async (req, res) => {
  try{
    //validate request
const { error } = validateUpdateProfile(req.body); 
if (error) return res.status(400).send({status:400,
  error:error.details[0].message});

  
  if(req.body.skills){
    let skills_json=await SkillSet.find().select('skillSetName');
    let skills=[];
    for(var i in skills_json){
      skills.push(skills_json[i].skillSetName);
    }
    let notValidSkills=_.difference(req.body.skills,skills);
    if(notValidSkills!=[]){
      
      return res.status(400).send({status:400,error:'Invalid Skills are=',notValidSkills});
      
    }
    
  }

//only posted user can update
let profile= await Profile.findOne({userAccount:req.user._id});
if(profile&&profile.userAccount!=req.user._id){
  return res.status(401).send({status:401,error:'Access denied...'});
}
if(!profile){
  profile={
    userAccount:req.user._id,
    currentSalary:req.body.currentSalary?req.body.currentSalary:null,
    currency:req.body.currency?req.body.currency:null,
    cv:req.body.cv?req.body.cv:null,
    personalStatement:req.body.personalStatement?req.body.personalStatement:null,
    coverLetter:req.body.coverLetter?req.body.coverLetter:null,
    skills:req.body.skills?req.body.skills:[],
  };
  profile=await profile.save();
}
else{

profile=await Profile.findOneAndUpdate({userAccount:req.user._id},{
  currentSalary:req.body.currentSalary?req.body.currentSalary:profile.currentSalary,
  currency:req.body.currency?req.body.currency:profile.currency,
  cv:req.body.cv?req.body.cv:profile.cv,
  personalStatement:req.body.personalStatement?req.body.personalStatement:profile.personalStatement,
  coverLetter:req.body.coverLetter?req.body.coverLetter:profile.coverLetter,
  skills:req.body.skills?req.body.skills:profile.skills,
},{
  new:true,
  }
  );
}
  
//return result
return res.status(200).send({status:200,profile:{
  currentSalary:profile.currentSalary,
  currency:profile.currency,
  cv:profile.cv,
  personalStatement:profile.personalStatement,
  coverLetter:profile.coverLetter,
  skills:profile.skills,
}});

}
catch(ex){
  res.status(500).send({status:500,error: 'something going wrong'});
}
});

/*Validations */

function validateUpdateProfile(profile){
  const schema = {
    currentSalary:Joi.number(),
    currency: Joi.string(),
    cv:Joi.string().min(1).max(255),
    coverLetter:Joi.string().min(1).max(1000),
    personalStatement:Joi.string().min(1).max(255),
    skills:Joi.array().items(Joi.string())
};

  return Joi.validate(profile, schema);
}


module.exports = router;
