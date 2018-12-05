const Joi = require('joi');
const {AppliedsJobs} = require('../../modals/jobsManagement/appliedsJobs');
const {Job} = require('../../modals/jobsManagement/job');
const auth=require('../../middleware/auth');
const _=require('lodash');
const mongoose = require('mongoose');
const {objArrayToSinglePropertyArray,isValueExistInArray,removeElement}=require('../../utils/index');
const express = require('express');
const router = express.Router();

router.get('/myAppliedsJobs', auth,async (req, res) => {
  try{
  const userPlusAppliedsJobs = await AppliedsJobs.findOne({userAccount:req.user._id})
  .populate('appliedsJobs');
  if(!userPlusAppliedsJobs){
    res.status(200).send({status:200,appliedsJobs:[]});
  }
  
 return res.status(200).send({status:200,appliedsJobs:userPlusAppliedsJobs.appliedsJobs});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});

//add in discard jobs
router.post('/',auth,async(req, res) => {
  try{
    const { error } = validateCreateAppliedsJob(req.body); 
    if (error) return res.status(400).send({status:400,error:error.details[0].message});
    
    const session=await mongoose.startSession();
    session.startTransaction();
    try{

      let job= await Job.findOne({_id:req.body.jobId}).session(session);
      await session.commitTransaction();
      //session.endSession();
      return res.status(200).send('true');
    }
    catch(error){
      await session.abortTransaction();
      session.endSession();
      res.send( error);
    }
    
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
  


});

//remove discard job
router.delete('/:jobId',auth, async (req, res) => {
    try{

        let userPlusAppliedsJobs=await AppliedsJobs.findOne({userAccount:req.user._id});

        if(!userPlusAppliedsJobs || !isValueExistInArray(userPlusAppliedsJobs.appliedsJobs,req.params.jobId)){
          return res.status(404).send({status:404,error:'no discard Job Found with given ID'});
        }
        let dJobs=removeElement(userPlusAppliedsJobs.appliedsJobs,req.params.jobId);

        userPlusDiscardsJob=await AppliedsJobs.findOneAndUpdate({userAccount:req.user._id},{
          appliedsJobs:dJobs
        });
           return res.status(200).send({status:200,msg:'remove discard job successfully'});
    }
    catch(ex){
      res.status(500).send({status:500,error:'something going wrong'});
    }
  });

/**validations */
function validateCreateAppliedsJob(appliedsJob) {
  const schema = {
    jobId: Joi.string().min(1).max(255).required(),
  };

  return Joi.validate(appliedsJob, schema);
}
module.exports = router;