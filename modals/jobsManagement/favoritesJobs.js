const mongoose = require('mongoose');

const favoritesJobsSchema = new mongoose.Schema({
  userAccount: {
  type: mongoose.Schema.Types.ObjectId,   
  ref:'User',
  required:true,
  },
  favoritesJobs: [{//ids
    type: mongoose.Schema.Types.ObjectId,   
    ref:'Job',
    required:true,
    }],   
});

const FavoritesJobs = mongoose.model('FavoritesJob', favoritesJobsSchema);

exports.FavoritesJobs = FavoritesJobs; 