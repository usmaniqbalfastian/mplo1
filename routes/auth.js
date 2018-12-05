const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth=require('../middleware/auth');
const {User} = require('../modals/userManagement/UserAccount');
const express = require('express');
const router = express.Router();
const saltRound=10;

router.post('/',async (req, res) => {
  try{
  const { error } = validateLogin(req.body); 
  if (error) return res.status(400).send({status:400,
    error:error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({status:400,error:'Invalid email or password.'});

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({status:400,error:'Invalid email or password.'});

  const token = user.generateAuthToken();
  res.status(200).send({status:200,'x_auth_token':token});
  }
  catch(ex){
    return res.status(500).send({status:500,error:'Something going wrong'});
  }
});
router.put('/changePassword',auth, async (req, res) => {
  try{
  const { error } = validateChangePassword(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(saltRound);
  let password = await bcrypt.hash(req.body.password, salt);

  let user = await User.findOneAndUpdate({_id:req.user._id },{
    password:password
  },{
    new:true
  });
  if (!user) return res.status(404).send(
    {status:404,error:'No user found...'});

  return res.status(200).send({status:200,
    detail:'password change successfully...'});  
  }
  catch(ex){
    return res.status(500).send({status:500,error:'Something going wrong'});
  }
});


function validateLogin(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().required()
  };

  return Joi.validate(req, schema);
}

function validateChangePassword(req) {
  const schema = {
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
