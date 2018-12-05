const Joi = require('joi');
const {DiscardsJobs} = require('../../modals/jobsManagement/discardsJobs');
const {Job} = require('../../modals/jobsManagement/job');
const auth=require('../../middleware/auth');
const _=require('lodash');
const mongoose = require('mongoose');
const {objArrayToSinglePropertyArray,isValueExistInArray,removeElement}=require('../../utils/index');
const express = require('express');
const router = express.Router();

router.get('/myDiscardsJobs', auth,async (req, res) => {
  try{
  const userPlusDiscardsJobs = await DiscardsJobs.findOne({userAccount:req.user._id})
  .populate('discardsJobs');
  if(!userPlusDiscardsJobs){
    return res.status(200).send({status:200,discardsJobs:[]});
  }
  
 return res.status(200).send({status:200,discardsJobs:userPlusDiscardsJobs.discardsJobs});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});

//add in discard jobs
router.post('/',auth,(req, res) => {

  const { error } = validateCreateDiscardsJob(req.body); 
  if (error) return res.status(400).send({status:400,error:error.details[0].message});
  Job.findOne({_id:req.body.jobId})
  .then((job,err)=>{
    if(err){
      return res.status(500).
      send({status:500,error:err});      
    }
    if(!job){
      return res.status(404).
      send({status:404,error:'job with given id not found'});         
    }
    DiscardsJobs.findOne({userAccount:req.user._id})
    .then((userPlusDiscardsJobs,err)=>{
      if(err){
        return res.status(500).
        send({status:500,error:'something going wrong'});
      }
      if(!userPlusDiscardsJobs){
        userPlusDiscardsJobs=new DiscardsJobs({
          userAccount:req.user._id,
          discardsJobs:[req.body.jobId],
        });
        userPlusDiscardsJobs.save()
        .then((userPlusDiscardsJobs,err)=>{
          if(err){
            return res.status(500).
            send({status:500,error:'something going wrong'});
          }
          return res.status(200).send({status:200,discardsJobs:userPlusDiscardsJobs.discardsJobs});
        })
      }
      else{
        let dJobs=userPlusDiscardsJobs.discardsJobs;
        if(isValueExistInArray(dJobs,req.body.jobId)){
          return res.status(400).
          send({status:400,error:'you have already discarded this job'});
        }
        dJobs.push(req.body.jobId);
        DiscardsJobs.findOneAndUpdate({userAccount:req.user._id},{
          discardsJobs:dJobs,
        },
        {
          new:true
        }).then((userPlusDiscardsJobs,err)=>{
          if(err){
            return res.status(500).
            send({status:500,error:'something going wrong'});
          }
          return res.status(200).send({status:200,msg:'discard job Successfully'}); 
        })
      }
    });

  });
});
//remove discard job
router.delete('/:jobId',auth, async (req, res) => {
    try{

        let userPlusDiscardsJobs=await DiscardsJobs.findOne({userAccount:req.user._id});

        if(!userPlusDiscardsJobs || !isValueExistInArray(userPlusDiscardsJobs.discardsJobs,req.params.jobId)){
          return res.status(404).send({status:404,error:'no discard Job Found with given ID'});
        }
        let dJobs=removeElement(userPlusDiscardsJobs.discardsJobs,req.params.jobId);

        userPlusDiscardsJob=await DiscardsJobs.findOneAndUpdate({userAccount:req.user._id},{
          discardsJobs:dJobs
        });
           return res.status(200).send({status:200,msg:'remove discard job successfully'});
    }
    catch(ex){
      res.status(500).send({status:500,error:'something going wrong'});
    }
  });

/**validations */
function validateCreateDiscardsJob(discardsJob) {
  const schema = {
    jobId: Joi.string().min(1).max(255).required(),
  };

  return Joi.validate(discardsJob, schema);
}
module.exports = router;