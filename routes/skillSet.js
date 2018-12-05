const Joi = require('joi');
const {SkillSet} = require('../modals/seekerProfileBuilder/skillSet');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
//get List of skill set
router.get('/', async (req, res) => {
  try{
  const skillSets_json = await SkillSet.find();
  skillSets=[];
  //convert into array skillSet
  for(var i in skillSets_json){
    skillSets.push(skillSets_json[i].skillSetName);
  }
  res.status(200).send({status:200,skillSets:skillSets});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});
//
router.post('/', async (req, res) => {
  try{

  const { error } = validateCreateSkillSet(req.body); 
  if (error) return res.status(400).send({status:400,error:error.details[0].message});
  //validate primary key
  let skillSet = await SkillSet.findOne({ skillSetName:req.body.skillSetName });
  if (skillSet) return res.status(400).send({status:400,error:'Skill Set already exist.'});
  
  skillSet=new SkillSet({skillSetName:req.body.skillSetName}); 
  skillSet = await skillSet.save();
  
  res.status(200).send({status:200,skillSet:skillSet});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});

router.put('/:id', async (req, res) => {
  try{
  const { error } = validateCreateSkillSet(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const skillSet = await SkillSet.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!skillSet) return res.status(404).send('The SkillSet with the given ID was not found.');
  
  res.send(skillSet);
}
catch(ex){
  res.send('something going wrong');
}
});

router.delete('/:id', async (req, res) => {
  try{
  const skillSet = await SkillSet.findByIdAndRemove(req.params.id);

  if (!skillSet) return res.status(404).send('The SkillSet with the given ID was not found.');

  res.send(skillSet);
  }
  catch(ex){
    res.send('something going wrong');
  }
});

router.get('/:id', async (req, res) => {
  try{
  const skillSet = await SkillSet.findById(req.params.id);

  if (!skillSet) return res.status(404).send('The SkillSet with the given ID was not found.');

  res.send(skillSet);
  }
  catch(ex){
    res.send('something going wrong');
  }
});

/**validations */
/**request validation */
function validateCreateSkillSet(skillSet) {
  const schema = {
    skillSetName: Joi.string().min(1).max(10).required(),
  };

  return Joi.validate(skillSet, schema);
}

module.exports = router;