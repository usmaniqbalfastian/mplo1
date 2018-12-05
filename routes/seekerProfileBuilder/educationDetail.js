
const {EducationDetail} = require('../../modals/seekerProfileBuilder/educationDetail');
const {User} = require('../../modals/userManagement/UserAccount');
const Joi = require('joi');
const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
//get current educationDetail profile
/*
get list of all education 
 */
router.get('/myEducations',auth, async (req, res) => {
  try{
  const educationDetails = await EducationDetail.find({userAccount:req.user._id}).select('-userAccount -__v');
  res.status(200).send({status:200,educationDetails:educationDetails});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});
//create educationDetail account with email
router.post('/', auth,async (req, res) => {
  try{
    if(!req.body.cgpa&&!req.body.percentage){
      return res.status(400).send({status:400,
        error:'CGPA or Percentage required'});
    }
      //validate request
  const { error } = validateCreateEducationDetail(req.body); 
  if (error) return res.status(400).send({status:400,
    error:error.details[0].message});

    //is user exist
    let user=await User.findOne({_id:req.user._id});
    if(!user){
      return res.status(404).send({status:404,
        error:'user Does Not exist please provide a valid token'});
    }


  //is already register educationDetail primary key validation
  let  educationDetail= await EducationDetail.findOne({
      userAccount:req.user._id,
      certificateDegreeName:req.body.certificateDegreeName,
      major:req.body.major,
      });
      if(educationDetail){

          return res.status(400).send({
              status:400,
              error:" you have already add "+req.body.certificateDegreeName+" with "
              +req.body.major+" major",
            });
      }

  //post educationDetail
  educationDetail=new EducationDetail({
    userAccount:req.user._id,
    certificateDegreeName:req.body.certificateDegreeName,
    major:req.body.major,
    instituteUniversityName:req.body.instituteUniversityName,
    startingDate:req.body.startingDate,
    endingDate:req.body.endingDate,
    percentage:req.body.percentage?req.body.percentage:null,
    cgpa:req.body.cgpa?req.body.cgpa:null,
    });
    educationDetail=await educationDetail.save();
  //return result
  res.status(200).send({status:200,educationDetail:{
    _id:educationDetail._id,
    certificateDegreeName:educationDetail.certificateDegreeName,
    major:educationDetail.major,
    instituteUniversityName:educationDetail.instituteUniversityName,
    startingDate:educationDetail.startingDate,
    endingDate:educationDetail.endingDate,
    percentage:educationDetail.percentage,
    cgpa:educationDetail.cgpa,
  }});
  }
  catch(ex){
    res.status(500).send({status:500,error: 'something going wrong'});
  }
});
//update my  educationdetail
//url/educationDetail/
router.put('/:educationDetailId',auth,async (req, res) => {
  try{
    //validate request
const { error } = validateUpdateEducationDetail(req.body); 
if (error) return res.status(400).send({status:400,
  error:error.details[0].message});

//only posted user can update
let educationDetail= await EducationDetail.findById(req.params.educationDetailId);
if(educationDetail&&educationDetail.userAccount!=req.user._id){
  return res.status(401).send({status:401,error:'Access denied...'});
}


//is alraedy register educationDetail primary key validation
if(!req.body.certificateDegreeName&&!req.body.major)
 educationDetail= await EducationDetail.findOne({
    userAccount:req.user._id,
    certificateDegreeName:req.body.certificateDegreeName,
    major:req.body.major,
    });
    if(educationDetail&&educationDetail._id!=req.params.educationDetailId){

        return res.status(400).send({
            status:400,
            error:"can not update "+req.body.certificateDegreeName+
            " and "+req.body.major
            +" because already exist",
          });
    
      }
educationDetail=await EducationDetail.findById(req.params.educationDetailId);
if(!educationDetail){
 return res.status(404).send({status:404,error:"no Record found"});
}
//post educationDetail
educationDetail=await EducationDetail.findByIdAndUpdate(req.params.educationDetailId,
 {
  userAccount:req.user._id,
  certificateDegreeName:req.body.certificateDegreeName?req.body.certificateDegreeName:educationDetail.certificateDegreeName,
  major:req.body.major?req.body.major:educationDetail.major,
  instituteUniversityName:req.body.instituteUniversityName?req.body.instituteUniversityName:educationDetail.instituteUniversityName,
  startingDate:req.body.startingDate?req.body.startingDate:educationDetail.startingDate,
  endingDate:req.body.endingDate?req.body.endingDate:educationDetail.endingDate,
  percentage:req.body.percentage?req.body.percentage:educationDetail.percentage,
  cgpa:req.body.cgpa?req.body.cgpa:educationDetail.cgpa,
  },
  {
    new:true,
  },
  );

//return result
return res.status(200).send({status:200,educationDetail:{
  _id:educationDetail._id,
  certificateDegreeName:educationDetail.certificateDegreeName,
  major:educationDetail.major,
  instituteUniversityName:educationDetail.instituteUniversityName,
  startingDate:educationDetail.startingDate,
  endingDate:educationDetail.endingDate,
  percentage:educationDetail.percentage,
  cgpa:educationDetail.cgpa,
}});
}
catch(ex){
  res.status(500).send({status:500,error: 'something going wrong'});
}
});
//delete my  account
router.delete('/:educationDetailId', auth,async (req, res) => {
  try{
    //only posted user can delete
let educationDetail= await EducationDetail.findById(req.params.educationDetailId);
if(educationDetail&&educationDetail.userAccount!=req.user._id){
  return res.status(401).send({status:401,error:'Access denied...'});
}

  educationDetail = await EducationDetail.findByIdAndRemove(req.params.educationDetailId);

  if (!educationDetail) return res.status(404).send({
    status:404,
    error:'The EducationDetail with the given ID was not found.'}
    );

  res.status(200).send({status:200,deletedEducationDetail:educationDetail});
  }
  catch(ex){
    res.status(500).send({status:500,error: 'something going wrong'});
  }
});
//get educationDetail by Id
router.get('/:educationDetailId', async (req, res) => {
  try{
  const educationDetail = await EducationDetail.findById(req.params.educationDetailId);

  if (!educationDetail) return res.status(404).send({status:404,
   error: 'The EducationDetail with the given ID was not found.'});

  return res.status(200).send({status:200,educationDetail:educationDetail});
  }
  catch(ex){
    res.status(500).send({status:500,error: 'something going wrong'});
  }
});


/*Validations */
function validateCreateEducationDetail(educationDetail) {
  const schema = {
    certificateDegreeName:Joi.string().min(1).max(255).required(),
    major: Joi.string().min(1).max(255).required(),
    startingDate:Joi.date(),
    endingDate:Joi.date(),
    instituteUniversityName:Joi.string().min(1).max(255).required(),
    cgpa:Joi.number().min(0).max(5),
    percentage:Joi.number().min(0).max(100)
};

  return Joi.validate(educationDetail, schema);
}
function validateUpdateEducationDetail(educationDetail){
  const schema = {
    certificateDegreeName:Joi.string().min(1).max(255),
    major: Joi.string().min(1).max(255).required(),
    startingDate:Joi.date(),
    endingDate:Joi.date(),
    instituteUniversityName:Joi.string().min(1).max(255),
    cgpa:Joi.number().min(0).max(5),
    percentage:Joi.number().min(0).max(100)
};

  return Joi.validate(educationDetail, schema);
}


module.exports = router;
