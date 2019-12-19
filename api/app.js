const express = require('express');
const bodyParser = require('body-parser');
var fileUpload = require('express-fileupload'),
    router = express.Router(),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// create express app - rest API requirements
const app = express();
app.use(fileUpload());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))
// parse requests of content-type - application/json
app.use(bodyParser.json())


// Get sample CSV format template for upload user data in to the system
var template = require('./template.js');
var getTemplate = function (req, res) {
    template.get(req, res);
};

// Upload CSV file
var upload = require('./upload.js');
var uploadData = function (req, res) {
    upload.post(req, res);
};

const Master = require('./models/master.js');
const Child = require('./models/child.js');
const Filter = require('./models/filter.js');
var generate = function (req, res) {
    var startyear = req.body.year;
    var range = req.body.round;
    var percentage = parseInt(req.body.percentage);
    var limit = parseInt(req.body.noOfRecords);
    var range_type = "max";
    var gender = (req.body.filterGender == true) ? '1' : '0';
    var fyear = (req.body.filterYear == true) ? '1' : '0';
    var searchParams = {};

    if (range_type == "min") {
        var endyear = parseInt(startyear) - parseInt(range);
        searchParams = {
            year: {
                $gte: parseInt(endyear),
                $lte: parseInt(startyear),
            }
        };
    } else {
        var endyear = parseInt(startyear) + parseInt(range);
        searchParams = {
            year: {
                $gte: parseInt(startyear),
                $lte: parseInt(endyear)
            }
        };
    }

    var du = Master.aggregate([{
        $match: searchParams
    }, {
        $sample: {
            size: limit
        }
    }]);
    du.exec(function (err, accounts) {
        if (err) {
            res.status(500).send({
                message: "error occured",
                errors: err
            });
        } else {
            var total_rows = accounts.length;
            var filterRow = new Filter({
                start_year: parseInt(startyear),
                end_year: parseInt(endyear),
                range: parseInt(range),
                percentage: parseInt(percentage),
                limit: parseInt(limit),
                range_type: range_type,
            });
            filterRow.save((err) => {
                if (err) return handleError(err);
                Child.remove({}).exec();
                var limitPer = Math.round(total_rows / 100 * parseInt(percentage));
                if (fyear == '1' && gender == '1') {
                    var remaining_rows = Math.round(total_rows / 2);
                    var start_year = parseInt(startyear) - parseInt(range);
                    var end_year = parseInt(startyear) + parseInt(range);
                } else if (fyear == '1' && gender == '0') {
                    var remaining_rows = total_rows;
                    var start_year = parseInt(startyear) - parseInt(range);
                    var end_year = parseInt(startyear) + parseInt(range);
                } else if (gender == '1' && fyear == '0') {
                    var remaining_rows = total_rows;
                    var start_year = startyear;
                    var end_year = startyear;
                }
                for (let i = 0; i < total_rows; i++) {
                    if (i < limitPer) {
                        var childs = new Child({
                            dob: accounts[i].dob,
                            year: accounts[i].year,
                            start_year: accounts[i].year,
                            end_year: accounts[i].year,
                            gender: accounts[i].gender,
                            filter: filterRow._id
                        });
                        childs.save();
                    } else {
                        if (i < remaining_rows) {
                            if (gender == '1') {
                                if (accounts[i].gender == "male") {
                                    var childGender = "female";
                                } else {
                                    var childGender = "male";
                                }
                            } else {
                                var childGender = accounts[i].gender;
                            }
                        } else {
                            var childGender = accounts[i].gender;
                        }
                        var childs = new Child({
                            dob: accounts[i].dob,
                            year: accounts[i].year,
                            start_year: start_year,
                            end_year: end_year,
                            gender: childGender,
                            filter: filterRow._id
                        });
                        childs.save();
                    }
                }
            });
            var filterID = filterRow._id;
            console.log(filterID);
            var finalData = Child.find().then(function (results) {
                res.status(200).send({
                    status: 200,
                    message: "Successfully Generated Record",
                    result: results
                });
            })
        }
    });
};

var getGeneratedData = function (req, res) {
    Child.find()
        .then(notes => {
            res.status(200).send({
                message: 'OK',
                result: notes
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving data."
            });
        });
};

router.route('/template')
    .get(getTemplate);

router.route('/import')
    .post(uploadData);

router.route('/generate')
    .post(generate);

router.route('/getGeneratedData')
    .get(getGeneratedData);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
module.exports = app;