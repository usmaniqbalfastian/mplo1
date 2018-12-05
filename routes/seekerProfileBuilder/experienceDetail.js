
const {ExperienceDetail} = require('../../modals/seekerProfileBuilder/experienceDetail');
const Joi = require('joi');
const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
//get current experienceDetail profile
/*
get list of all education 
 */
router.get('/myExperiences',auth, async (req, res) => {
  try{
  const experienceDetails = await ExperienceDetail.find({userAccount:req.user._id}).select('-userAccount -__v');
  res.status(200).send({status:200,experienceDetails:experienceDetails});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});
//create experienceDetail account with email
router.post('/', auth,async (req, res) => {
  try{
    if(!req.body.isCurrentJob&&!req.body.endDate){
      return res.status(400).send({status:400,
        error:'it is not a current job so End date required'});
    }
      //validate request
  const { error } = validateCreateExperienceDetail(req.body); 
  if (error) return res.status(400).send({status:400,
    error:error.details[0].message});

        //is user exist
        let user=await User.findOne({_id:req.user._id});
        if(!user){
          return res.status(404).send({status:404,
            error:'user Does Not exist please provide a valid token'});
        }

  //post experienceDetail
  let experienceDetail=new ExperienceDetail({
    userAccount:req.user._id,
    jobTitle:req.body.jobTitle,
    companyName:req.body.companyName,
    startDate:req.body.startDate,
    endDate:req.body.endDate,
    isCurrentJob:req.body.isCurrentJob,
    description:req.body.description,
    });
    experienceDetail=await experienceDetail.save();
  //return result
  res.status(200).send({status:200,experienceDetail:{
    _id:experienceDetail._id,
    jobTitle:experienceDetail.jobTitle,
    companyName:experienceDetail.companyName,
    startDate:experienceDetail.startDate,
    endDate:experienceDetail.endDate,
    isCurrentJob:experienceDetail.isCurrentJob,
    description:experienceDetail.description,
  }});
  }

  catch(ex){
    res.status(500).send({status:500,error: 'something going wrong'});
  }
});
//update my  educationdetail
//url/experienceDetail/
router.put('/:experienceDetailId',auth,async (req, res) => {
  try{
    //validate request

    if(!req.body.isCurrentJob&&!req.body.endDate){
        return res.status(400).send({status:400,
          error:'it is not a current job so End date required'});
      }

const { error } = validateUpdateExperienceDetail(req.body); 
if (error) return res.status(400).send({status:400,
  error:error.details[0].message});

//only posted user can update
let experienceDetail= await ExperienceDetail.findById(req.params.experienceDetailId);
if(experienceDetail&&experienceDetail.userAccount!=req.user._id){
  return res.status(401).send({status:401,error:'Access denied...'});
}


//post experienceDetail
experienceDetail=await ExperienceDetail.findByIdAndUpdate(req.params.experienceDetailId,{
    userAccount:req.user._id,
    jobTitle:req.body.jobTitle,
    companyName:req.body.companyName,
    startDate:req.body.startDate,
    endDate:req.body.endDate,
    isCurrentJob:req.body.isCurrentJob,
    description:req.body.description,
  },{
  new:true,
  }
  );
//return result
res.status(200).send({status:200,experienceDetail:{
    _id:experienceDetail._id,
    jobTitle:experienceDetail.jobTitle,
    companyName:experienceDetail.companyName,
    startDate:experienceDetail.startDate,
    endDate:experienceDetail.endDate,
    isCurrentJob:experienceDetail.isCurrentJob,
    description:experienceDetail.description,
}});
}
catch(ex){
  res.status(500).send({status:500,error: 'something going wrong'});
}
});
//delete my  account
router.delete('/:experienceDetailId', auth,async (req, res) => {
  try{
    //only posted user can delete
let experienceDetail= await ExperienceDetail.findById(req.params.experienceDetailId);
if(experienceDetail&&experienceDetail.userAccount!=req.user._id){
  return res.status(401).send({status:401,error:'Access denied...'});
}

  experienceDetail = await ExperienceDetail.findByIdAndRemove(req.params.experienceDetailId);

  if (!experienceDetail) return res.status(404).send({
    status:404,
    error:'The ExperienceDetail with the given ID was not found.'}
    );

  res.send({deletedEducationDetail:experienceDetail});
  }
  catch(ex){
    res.status(500).send({status:500,error: 'something going wrong'});
  }
});
//get experienceDetail by Id
router.get('/:experienceDetailId', async (req, res) => {
  try{
  const experienceDetail = await ExperienceDetail.findById(req.params.experienceDetailId);

  if (!experienceDetail) return res.status(404).send({status:404,
   error: 'The ExperienceDetail with the given ID was not found.'});

  res.status(200).send({status:200,experienceDetail:experienceDetail});
  }
  catch(ex){
    res.status(500).send({status:500,error: 'something going wrong'});
  }
});


/*Validations */
function validateCreateExperienceDetail(experienceDetail) {
  const schema = {
    jobTitle:Joi.string().min(1).max(255).required(),
    companyName: Joi.string().min(1).max(255).required(),
    startDate:Joi.date().required(),
    endDate:Joi.date(),
    isCurrentJob:Joi.boolean(),
    description:Joi.string().min(1).max(255)
};

  return Joi.validate(experienceDetail, schema);
}
function validateUpdateExperienceDetail(experienceDetail){
  const schema = {
    jobTitle:Joi.string().min(1).max(255),
    companyName: Joi.string().min(1).max(255),
    startDate:Joi.date(),
    endDate:Joi.date(),
    isCurrentJob:Joi.boolean(),
    description:Joi.string().min(1).max(255)
};

  return Joi.validate(experienceDetail, schema);
}


module.exports = router;
