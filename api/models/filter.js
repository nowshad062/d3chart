const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const FilterSchema = mongoose.Schema({
    start_year: Number,
    end_year: Number,
    range: Number,
    percentage : Number,
    limit : Number,
    range_type : String,
    childs: [{
        type: Schema.Types.ObjectId,
        ref: 'Child'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Filter', FilterSchema);
