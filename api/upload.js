var csv = require('fast-csv');
var mongoose = require('mongoose');
var Author = require('./models/master.js');

exports.post = function (req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  var authorFile = req.files.file;

  var authors = [];

    csv
     .fromString(authorFile.data.toString(), {
       headers:true,
         ignoreEmpty: true
     })
     .on("data", function(data){
          var dobyear = data['dob'].substring(0,4);
         data['_id'] = new mongoose.Types.ObjectId();
         data['year'] = parseInt(dobyear);
         authors.push(data);
     })
     .on("error",function(data){
       return false;
     })
     .on("end", function(){
       console.log(authors);
         Author.create(authors, function(err, documents) {
            if (err) throw err;
         });

      // res.send(authors.length + ' authors have been successfully uploaded.');
      res.status(200).json({
        status: 200,
        message: authors.length + ' records have been successfully uploaded.'
      });
    });
};
