
const {User} = require('../../modals/userManagement/UserAccount');
const {JobType} = require('../../modals/jobsManagement/jobType');
const {Job} = require('../../modals/jobsManagement/job');
const {SkillSet}=require('../../modals/seekerProfileBuilder/skillSet')
const Joi = require('joi');
const _=require('lodash');
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
//recieve x-auth-token and return current jobs
router.get('/myjobs', auth, async (req, res) => {
  try{
  const jobs = await Job.find({jobPostedBy:req.user._id});
  return res.status(200).send({status:200,jobs:jobs});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});
//get list of all jobs  

router.get('/', async (req, res) => {
  try{
    const jobs = await Job.find();
    return res.status(200).send({status:200,jobs:jobs});
    }
    catch(ex){
      res.status(500).send({status:500,error:'something going wrong'});
    }
});
//create user account with email
router.post('/', auth,async (req, res) => {
  try{
  //validate request
  const { error } = validateCreateJobPost(req.body);
  if (error) return res.status(400).send({status:400,error:error.details[0].message});

      //is valid jobType part time, full time or jobSeeker
      let jobType= await JobType.findOne({jobTypeName:req.body.jobTypeName});
      if(!jobType){
        let jobTypes_json=await JobType.find();
        jobTypes=[];
        //convert into array usertypes
        for(var i in jobTypes_json){
          jobTypes.push(jobTypes_json[i].jobTypeName);
        }
       return res.status(400).send({status:400,error:'invalid jobTypeName! jobTypeName must be one of these ',
        jobTypes:jobTypes});
      }
      //if skills provide
      if(req.body.skills){
        let skills_json=await SkillSet.find().select('skillSetName');
        let skills=[];
        for(var i in skills_json){
          skills.push(skills_json[i].skillSetName);
        }
        let notValidSkills=_.difference(req.body.skills,skills);
        if(notValidSkills.length!==0){
          
          return res.status(400).send({status:400,error:'Invalid Skills are=',notValidSkills});
          
        }
        
      } 

  //post user
 let job=new Job({
    jobTitle:req.body.jobTitle,
    jobPostedBy:req.user._id,
    jobTypeName:req.body.jobTypeName,
    company: req.body.companyId,
    isCompanyNameHidden:req.body.isCompanyNameHidden?req.body.isCompanyNameHidden:false,
    createdDate:new Date(),
    applyDate:req.body.applyDate?req.body.applyDate:null,
    description:req.body.description?req.body.description:null,
    address:{
        country:req.body.country?req.body.country:null,
        city:req.body.city?req.body.city:null,
        mapLocation:{
            latitude: req.body.latitude?req.body.latitude:null,
            longitude: req.body.longitude?req.body.longitude:null,
        }  
    },
    isActive:true,
    minSalary:req.body.minSalary?req.body.minSalary:0,
    maxSalary:req.body.maxSalary?req.body.maxSalary:0,
    skills:req.body.skills?req.body.skills:[],
    });
 job=await job.save();
  //return result
  res.status(200).send({status:200,
    job:job
  });
  }
  catch(ex){
    res.status(500).send({status:500,error: 'something going wrong'});
  }
});
//update my  account firstName,lastName,email,,contactNo,userImage
//url/user/
router.put('/:id',auth,async (req, res) => {
  try{
//validate request
const { error } = validateUpdateJobPost(req.body);
if (error) return res.status(400).send({status:400,error:error.details[0].message});

    //is valid jobType part time, full time or jobSeeker
    if(req.body.jobType){

    let jobType= await JobType.findOne({jobTypeName:req.body.jobTypeName});
    if(!jobType){
      let jobTypes_json=await JobType.find();
      jobTypes=[];
      //convert into array usertypes
      for(var i in jobTypes_json){
        jobTypes.push(jobTypes_json[i].jobTypeName);
      }
     return res.status(400).send({status:400,error:'invalid jobTypeName! jobTypeName must be one of these ',
      jobTypes:jobTypes});
    } 
  }
  //is valid skills
  if(req.body.skills){
    let skills_json=await SkillSet.find().select('skillSetName');
    let skills=[];
    for(var i in skills_json){
      skills.push(skills_json[i].skillSetName);
    }
    let notValidSkills=_.difference(req.body.skills,skills);
    if(notValidSkills.length!==0){
      
      return res.status(400).send({status:400,error:'Invalid Skills are=',notValidSkills});
      
    }
    
  }
//find job exist


let job=await Job.findById(req.params.id);
if(!job){
  return res.status(400).send({status:400,error:'no Job Found...'});
}
//only posted user can update post job
if(job.jobPostedBy!=req.user._id){
  return res.status(403).send({status:403,error:'Access denied...'});
}

job=await Job.findByIdAndUpdate(req.params.id,{
  jobTitle:req.body.jobTitle?req.body.jobTitle:job.jobTitle,
  jobPostedBy:job.jobPostedBy,
  jobTypeName:req.body.jobTypeName?req.body.jobTypeName:job.jobTypeName,
  company: req.body.companyId?req.body.companyId:job.company,
  isCompanyNameHidden:req.body.isCompanyNameHidden?req.body.isCompanyNameHidden:job.isCompanyNameHidden,
  applyDate:req.body.applyDate?req.body.applyDate:job.applyDate,
  description:req.body.description?req.body.description:job.description,
  address:{
      country:req.body.country?req.body.country:job.country,
      city:req.body.city?req.body.city:job.city,
      mapLocation:{
          latitude: req.body.latitude?req.body.latitude:job.latitude,
          longitude: req.body.longitude?req.body.longitude:job.longitude,
      }  
  },
  isActive:req.body.isActive?req.body.isActive:job.isActive,
  minSalary:req.body.minSalary?req.body.minSalary:job.minSalary,
  maxSalary:req.body.maxSalary?req.body.maxSalary:job.maxSalary,
  skills:req.body.skills?req.body.skills:job.maxSalary,
  },
  {
    new:true
  }
  );
//return result
return res.status(200).send({status:200,
  job:job
});

}
catch(ex){
  return res.status(500).send({status:500,error: 'something going wrong'});
}
});
//delete my  account other thing will add later
router.delete('/:id', auth,async (req, res) => {
  try{
    let job=await Job.findById(req.params.id);
    if (!job) return res.status(404).send('The job with the given ID was not found.');
    //only posted persons can delete post
    if(job.jobPostedBy!==req.params._id){
      return res.status(403).send({status:403,error:'Access Denied...'});
    } 
     job = await Job.findByIdAndRemove(req.params.id);


  return res.status(200).send({status:200,deletedJob:job});
  }
  catch(ex){
   return  res.status(500).send({status:500,error:'something going wrong'});
  }
});

/*Validations */
function validateCreateJobPost(user) {
  const schema = {
    jobTitle:Joi.string().min(1).max(255).required(),
    jobTypeName: Joi.string().min(1).max(255).required(),
    companyId: Joi.string().min(1).max(255).required(),
    isCompanyNameHidden:Joi.boolean(),
    applyDate:Joi.date().min('now'),
    description:Joi.string().min(1).max(255),
    country:Joi.string().min(1).max(15),
    city:Joi.string().min(1).max(255),
    latitude:Joi.number(),
    longitude:Joi.number(),
    isActive:Joi.boolean(),
    minSalary:Joi.number(),
    maxSalary:Joi.number(),
    skills:Joi.array().items(Joi.string().min(1).max(255))

};

  return Joi.validate(user, schema);
}
function validateUpdateJobPost(user){
  const schema = {
    jobTitle:Joi.string().min(1).max(255),  
    jobTypeName: Joi.string().min(1).max(255),
    companyId: Joi.string().min(1).max(255),
    isCompanyNameHidden:Joi.boolean(),
    applyDate:Joi.date().min('now'),
    description:Joi.string().min(1).max(255),
    country:Joi.string().min(1).max(15),
    city:Joi.string().min(1).max(255),
    latitude:Joi.number(),
    longitude:Joi.number(),
    isActive:Joi.boolean(),
    minSalary:Joi.number(),
    maxSalary:Joi.number(),
    skills:Joi.array().items(Joi.string().min(1).max(255))

};

  return Joi.validate(user, schema);
}


module.exports = router;
