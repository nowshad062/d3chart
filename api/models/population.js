const mongoose = require('mongoose');

const PopulationSchema = mongoose.Schema({
  state: String,
  population: String
}, {
  timestamps: true
}, {
  versionKey: false
});

module.exports = mongoose.model('Population', PopulationSchema);
