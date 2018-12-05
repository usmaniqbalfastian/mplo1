const express = require('express');
const userType = require('../routes/userManagement/UserType');
const user = require('../routes/userManagement/UserAccount');
const educationDetail=require('../routes/seekerProfileBuilder/educationDetail');
const experienceDetail=require('../routes/seekerProfileBuilder/experienceDetail');
const profile=require('../routes/seekerProfileBuilder/profile')
const skillSet = require('../routes/skillSet');
const jobType=require('../routes/jobsManagement/jobType');
const job=require('../routes/jobsManagement/job');
const appliedsJobs=require('../routes/jobsManagement/appliedsJobs');
const discardsJobs=require('../routes/jobsManagement/discardsJobs');
const favoritesJobs=require('../routes/jobsManagement/favoritesJobs');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const ejs = require('ejs');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/userType', userType);
  app.use('/api/skillSet', skillSet);
  app.use('/api/profile/education', educationDetail);
  app.use('/api/profile/experience', experienceDetail);
  app.use('/api/profile', profile);
  app.use('/api/jobType', jobType);
  app.use('/api/job', job);
  app.use('/api/user', user);
  app.use('/api/user/discardsJobs',discardsJobs);
  app.use('/api/user/favoritesJobs',favoritesJobs);
  app.use('/api/user/appliedsJobs',appliedsJobs);
  app.use('/api/auth', auth);
  app.set('view engine', 'ejs');
  app.use(express.static('./public'));
  app.use(error);
}