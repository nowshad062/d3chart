const mongoose = require('mongoose');

const MasterSchema = mongoose.Schema({
   dob: String,
   gender :String,
   year: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Master', MasterSchema);
