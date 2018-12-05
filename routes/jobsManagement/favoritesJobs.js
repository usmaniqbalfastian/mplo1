const Joi = require('joi');
const {FavoritesJobs} = require('../../modals/jobsManagement/favoritesJobs');
const {Job} = require('../../modals/jobsManagement/job');
const auth=require('../../middleware/auth');
const _=require('lodash');
const mongoose = require('mongoose');
const {objArrayToSinglePropertyArray,isValueExistInArray,removeElement}=require('../../utils/index');
const express = require('express');
const router = express.Router();

router.get('/myFavoritesJobs', auth,async (req, res) => {
  try{
  const userPlusFavoritesJobs = await FavoritesJobs.findOne({userAccount:req.user._id})
  .populate('favoritesJobs');
  if(!userPlusFavoritesJobs){
    res.status(200).send({status:200,favoritesJobs:[]});
  }
  
 return res.status(200).send({status:200,favoritesJobs:userPlusFavoritesJobs.favoritesJobs});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});

//add in discard jobs
router.post('/',auth,(req, res) => {

  const { error } = validateCreateFavoritesJob(req.body); 
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
    FavoritesJobs.findOne({userAccount:req.user._id})
    .then((userPlusFavoritesJobs,err)=>{
      if(err){
        return res.status(500).
        send({status:500,error:'something going wrong'});
      }
      if(!userPlusFavoritesJobs){
        userPlusFavoritesJobs=new FavoritesJobs({
          userAccount:req.user._id,
          favoritesJobs:[req.body.jobId],
        });
        userPlusFavoritesJobs.save()
        .then((userPlusFavoritesJobs,err)=>{
          if(err){
            return res.status(500).
            send({status:500,error:'something going wrong'});
          }
          return res.status(200).send({status:200,favoritesJobs:userPlusFavoritesJobs.favoritesJobs});
        })
      }
      else{
        let dJobs=userPlusFavoritesJobs.favoritesJobs;
        if(isValueExistInArray(dJobs,req.body.jobId)){
          return res.status(400).
          send({status:400,error:'you have already add as favorite this job'});
        }
        dJobs.push(req.body.jobId);
        FavoritesJobs.findOneAndUpdate({userAccount:req.user._id},{
          favoritesJobs:dJobs,
        },
        {
          new:true
        }).then((userPlusFavoritesJobs,err)=>{
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

        let userPlusFavoritesJobs=await FavoritesJobs.findOne({userAccount:req.user._id});

        if(!userPlusFavoritesJobs || !isValueExistInArray(userPlusFavoritesJobs.favoritesJobs,req.params.jobId)){
          return res.status(404).send({status:404,error:'no discard Job Found with given ID'});
        }
        let dJobs=removeElement(userPlusFavoritesJobs.favoritesJobs,req.params.jobId);

        userPlusDiscardsJob=await FavoritesJobs.findOneAndUpdate({userAccount:req.user._id},{
          favoritesJobs:dJobs
        });
           return res.status(200).send({status:200,msg:'remove discard job successfully'});
    }
    catch(ex){
      res.status(500).send({status:500,error:'something going wrong'});
    }
  });

/**validations */
function validateCreateFavoritesJob(favoritesJob) {
  const schema = {
    jobId: Joi.string().min(1).max(255).required(),
  };

  return Joi.validate(favoritesJob, schema);
}
module.exports = router;