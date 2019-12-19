const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ChildSchema = mongoose.Schema({
   dob: String,
   gender :String,
   year:Number,
   start_year:Number,
   end_year:Number,
  filter: { type: Schema.Types.ObjectId, ref: 'Filter' },

}, {
  timestamps: true
});

module.exports = mongoose.model('Child', ChildSchema);
