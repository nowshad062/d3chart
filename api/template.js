var json2csv = require('json2csv').parse;

exports.get = function(req, res) {

    var fields = [
        'dob',
        'gender'
    ];
    var data = [{
      dob:'1990-06-02',
      gender:'male',
    }];
    var csv = json2csv(data,fields);
    res.set("Content-Disposition", "attachment;filename=dob.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);

};
