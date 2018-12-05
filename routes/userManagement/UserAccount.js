
const {User} = require('../../modals/userManagement/UserAccount');
const {UserType} = require('../../modals/userManagement/UserType');
const {Profile} = require('../../modals/seekerProfileBuilder/profile');
const Joi = require('joi');
const auth = require('../../middleware/auth');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const serverAcceptsEmail = require('server-accepts-email')
const express = require('express');
const multer = require('multer');

const path = require('path');
const router = express.Router();
const saltRound=10;
//get current user Account
//recieve x-auth-token and return current user
router.get('/me', auth, async (req, res) => {
  try{
  const user = await User.findById(req.user._id).select('-password');
  return res.status(200).send({status:200,user:user});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});
//this is only access by admin
/*
get list of all users 
 */
router.get('/', async (req, res) => {
  try{
  const users = await User.find().sort('firstName').select('_id firstName lastName email contactNo userImage');
  res.status(200).send({status:200,users:users});
  }
  catch(ex){
    res.status(500).send({status:500,error:'something going wrong'});
  }
});
//create user account with email
router.post('/', async (req, res) => {
  try{
  //validate request
  const { error } = validateCreateUserWithEmail(req.body); 
  if (error) return res.status(400).send({status:400,error:error.details[0].message});

      //is valid userType HR or jobSeeker
      let userType= await UserType.findOne({userTypeName:req.body.userTypeName});
      if(!userType){
        let userTypes_json=await UserType.find();
        userTypes=[];
        //convert into array usertypes
        for(var i in userTypes_json){
          userTypes.push(userTypes_json[i].userTypeName);
        }
       return res.status(400).send({status:400,error:'invalid userTypeName! userTypeName must be one of these ',
        userTypes:userTypes});
      } 

      
  //is alraedy register user

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({status:400,error:'User already registered.'});
    
  /*const isValidEmail=await serverAcceptsEmail(req.body.email);
  if(!isValidEmail){
    return res.status(400).send({status:400,
      error:'Email rejected by mail server please provide a valid email address'});
     }*/
  //post user
  user=new User({
    
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    userTypeName:req.body.userTypeName,
    email:req.body.email,
    password:req.body.password,
    contactNo:req.body.contactNo?req.body.contactNo:null,
    userImage:null,
    registrationDate:new Date(),
    });
    //encrypt password
  const salt = await bcrypt.genSalt(saltRound);
  user.password = await bcrypt.hash(user.password, salt);
   user = await user.save();
  
   let profile=new Profile({
     userAccount:user._id,
     currentSalary:null,
     currency:null,
     CV:null,
     personalStatement:null,
     coverLetter:null,
     skills:null,
    
  });

  profile=await profile.save();

   //access token generate
  const token = user.generateAuthToken();
  //return result
  res.header('x_auth_token',token).status(200).send({status:200,
    'x_auth_token':token,
    user:{
    firstName:user.firstName,
    lastName:user.lastName,
    userTypeName:user.userTypeName,
    contactNo:user.contactNo,
    email:user.email,
    userImage:user.userImage
  }});
  }
  catch(ex){
    res.status(500).send({status:500,error: 'something going wrong'});
  }
});
//update my  account firstName,lastName,email,,contactNo,userImage
//url/user/
router.put('/',auth,async (req, res) => {
  try{
    //get from auth midddle ware
    let userId=req.user._id;
//validate request
  const { error } = validateUpdateUser(req.body); 
  if (error) return res.status(400).send({status:400,error:error.details[0].message});
//primary key validation
let user;
if(req.body.email){
  user = await User.findOne({ email: req.body.email });
  if (user&&userId!=user._id) return res.status(400).send({status:400,
    error:"can't change email because email already registered by a user."
  });
}
  //find user to update
  user = await User.findOne({ _id: req.user._id });
  if(!user){
    return res.status(404).send({status:404,error:'user does not exist please provide valid token'});
  }
    /*
    const isValidEmail=await serverAcceptsEmail(req.body.email);
    if(!isValidEmail){
      return res.status(400).send({status:400,
        error:'Email rejected by mail server please provide a valid email address'});
       }*/
//update by user

  user= await User.findOneAndUpdate({_id:user._id}, {
  _id:user._id,
  firstName: (req.body.firstName)?req.body.firstName:user.firstName,
  lastName:req.body.lastName?req.body.lastName:user.lastName,
  email:req.body.email?req.body.email:user.email,
  userTypeName:user.userTypeName,
  password:user.password,
  contactNo:(req.body.contactNo)?req.body.contactNo:user.contactNo,
  userImage:user.userImage,
  registrationDate:user.registrationDate
}, {
    new: true
  });

  if (!user) return res.status(404).send({status:404,error:'The User with the given ID was not found.'});
  
  return res.status(200).send({status:200,user:{
  firstName: user.firstName,
  lastName:user.lastName,
  email:user.email,
  contactNo:user.contactNo,
  userImage:user.userImage
  }});
}
catch(ex){
  return res.status(500).send({status:500,error: 'something going wrong'});
}
});
//delete my  account other thing will add later
router.delete('/', auth,async (req, res) => {
  try{
    let userId=req.user._id;
  const user = await User.findByIdAndRemove(userId);

  if (!user) return res.status(404).send('The User with the given ID was not found.');

  res.send(user);
  }
  catch(ex){
    res.send('something going wrong');
  }
});


// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,req.user._id + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('userImage');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  

router.post('/uploadImage', auth,(req, res) => {
    upload(req, res, (err) => {
      if(err){
          return res.status(400).send({status:400,error:err});
      } else {
        if(req.file == undefined){
          return res.status(400).send({status:400,error:'No file Selected'});
        } else {
          User.findByIdAndUpdate(req.user._id,{
            userImage: `uploads/${req.file.filename}`
          },
          {
            new:true
          }).then((err,user)=>{
            if(err){
              return res.status(500).send({status:500,error:err});
            }
            else{
              return res.status(200).send({status:200,user:user});
            }
          })
        }
      }
    });
  });

/*Validations */
function validateCreateUserWithEmail(user) {
  const schema = {
    firstName: Joi.string().min(1).max(255).required(),
    lastName: Joi.string().min(1).max(255).required(),
    email:Joi.string().email().min(5).max(255).required(),
    userTypeName:Joi.string().required(),
    password:Joi.string().min(5).max(255).required(),
    contactNo:Joi.string().min(11).max(15),
};

  return Joi.validate(user, schema);
}
function validateUpdateUser(user){
  const schema = {
    firstName: Joi.string().min(1).max(255),
    lastName: Joi.string().min(1).max(255),
    email:Joi.string().email().min(5).max(255),
    contactNo:Joi.string().min(11).max(15),

};

  return Joi.validate(user, schema);
}


module.exports = router;
