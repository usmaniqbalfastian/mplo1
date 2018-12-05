const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb://usman:AMMARAusman789!@mplo-shard-00-00-uegsn.mongodb.net:27017,mplo-shard-00-01-uegsn.mongodb.net:27017,mplo-shard-00-02-uegsn.mongodb.net:27017/test?ssl=true&replicaSet=mplo-shard-0&authSource=admin&retryWrites=true')
    //.then(() => winston.info('Connected to MongoDB...'));
    .then(() => console.log('Connected to MongoDB...'))
    .catch(()=>console.log('exceptions'));
}