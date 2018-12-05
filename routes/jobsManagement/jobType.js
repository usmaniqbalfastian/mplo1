const Joi = require('joi');
const {JobType} = require('../../modals/jobsManagement/jobType');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {objArrayToSinglePropertyArray}=require('../../utils/index');

router.get('/', async (req, res) => {
  try{
  const jobTypes_json = await JobType.find().sort('jobTypeName');
  //get array of jobtypes
  var jobTypes=objArrayToSinglePropertyArray(jobTypes_json,'jobTypeName');
  res.status(400).send({status:200,jobTypes:jobTypes});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});

router.post('/', async (req, res) => {
  try{

  const { error } = validateCreateJobType(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
    //validate primary key
    let jobType = await JobType.findOne({ jobTypeName:req.body.jobTypeName });
    if (jobType) return res.status(400).send({status:400,error:'jobType already exist.'});
    
    jobType=new JobType({jobTypeName:req.body.jobTypeName}); 
    jobType = await jobType.save();
  
   res.send(jobType);
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});

router.put('/:id', async (req, res) => {
  try{
  const { error } = validateCreateJobType(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const jobType = await JobType.findByIdAndUpdate(req.params.id, { jobTypeName: req.body.name }, {
    new: true
  });

  if (!jobType) return res.status(404).send('The JobType with the given ID was not found.');
  
  res.send(jobType);
}
catch(ex){
  res.send('something goning wrong');
}
});

router.delete('/:id', async (req, res) => {
  try{
  const jobType = await JobType.findByIdAndRemove(req.params.id);

  if (!jobType) return res.status(404).send('The JobType with the given ID was not found.');

  res.send(jobType);
  }
  catch(ex){
    res.send('something goning wrong');
  }
});

router.get('/:id', async (req, res) => {
  try{
  const jobType = await JobType.findById(req.params.id);

  if (!jobType) return res.status(404).send('The JobType with the given ID was not found.');

  res.send(jobType);
  }
  catch(ex){
    res.send('something goning wrong');
  }
});

/**validations */
function validateCreateJobType(jobType) {
  const schema = {
    jobTypeName: Joi.string().min(2).max(10).required(),
  };

  return Joi.validate(jobType, schema);
}
module.exports = router;