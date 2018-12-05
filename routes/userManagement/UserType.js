const Joi = require('joi');
const {UserType} = require('../../modals/userManagement/UserType');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try{
  const userTypes_json = await UserType.find().sort('userTypeName');
  var userTypes=[];
  //convert into array usertypes
  for(var i in userTypes_json){
    userTypes.push(userTypes_json[i].userTypeName);
  }
  res.status(400).send({status:200,userTypes:userTypes});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});

router.post('/', async (req, res) => {
  try{

  const { error } = validateCreateUserType(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
    //validate primary key
    let userType = await UserType.findOne({ userTypeName:req.body.userTypeName });
    if (userType) return res.status(400).send({status:400,error:'userType already exist.'});
    
    userType=new UserType({userTypeName:req.body.userTypeName}); 
    userType = await userType.save();
  
   res.send(userType);
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});

router.put('/:id', async (req, res) => {
  try{
  const { error } = validateCreateUserType(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const userType = await UserType.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!userType) return res.status(404).send('The UserType with the given ID was not found.');
  
  res.send(userType);
}
catch(ex){
  res.send('something goning wrong');
}
});

router.delete('/:id', async (req, res) => {
  try{
  const userType = await UserType.findByIdAndRemove(req.params.id);

  if (!userType) return res.status(404).send('The UserType with the given ID was not found.');

  res.send(userType);
  }
  catch(ex){
    res.send('something goning wrong');
  }
});

router.get('/:id', async (req, res) => {
  try{
  const userType = await UserType.findById(req.params.id);

  if (!userType) return res.status(404).send('The UserType with the given ID was not found.');

  res.send(userType);
  }
  catch(ex){
    res.send('something goning wrong');
  }
});

/**validations */
function validateCreateUserType(userType) {
  const schema = {
    userTypeName: Joi.string().min(2).max(10).required(),
  };

  return Joi.validate(userType, schema);
}
module.exports = router;