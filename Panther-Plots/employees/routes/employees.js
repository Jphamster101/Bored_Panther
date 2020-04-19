const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const mongoUrl = 'mongodb://db/employees';

const Employee = require('../models/employee');

// Auto-reconnect taken from
// https://team.goodeggs.com/reconnecting-to-mongodb-when-mongoose-connect-
// fails-at-startup-83ca8496ca02
const connectWithRetry = function() { // Changed
  return mongoose.connect(mongoUrl, {useNewUrlParser: true,
  useUnifiedTopology: true}).
      then(() => console.log('Connected to database')).
      catch( (err) => {
        console.error(err);
        setTimeout(connectWithRetry, 5000);
      });
};

connectWithRetry();
// const db = mongoose.connection;

/* GET all employees */
router.get('/all', async function(req, res, next) {
  try {
    const results = await Employee.find({}, 'firstName lastName employeeId\
                                        hourlyWage phoneNumber certifications');
    res.json(results);
  } catch (err) {
    res.status(500).json({message: err.message});
  };
});

router.get('/get-profile/:id', async function(req, res, next) {
  try {
    const results = await Employee.findOne({employeeId: req.params.id});
    res.render('results', {title: 'Employee Found', message: "Name: " + results.firstName + " " + results.lastName, 
    e_id: "Employee Id: " + results.employeeId,
    hourlyWage: "Hourly Wage: " + results.hourlyWage.toFixed(2) + "$/hr", 
    phoneNumber:"Phone Number: " + results.phoneNumber, 
    certifications: "Certifications: " + results.certifications});
  } catch (err) {
    res.send("Employee " + req.params.id +  " does not exist");
    // res.status(500).json({message: err.message});
  };
});

// Webpage where you can find employee by Id
router.get('/get-profile/', async function(req, res, next) {
  try {
    return res.render('find_employee', {title: 'WALDO', message: 'FIND AN EMPLOYEE'});
  } catch (err) {
    res.status(500).json({message: err.message});
  };
});

router.get('/submit/', async function(req, res, next) {
  try {
    return res.redirect('http://localhost:3000/employees/get-profile/' + req.query.employeeId);
  } catch (err) {
    res.status(500).json({message: err.message});
  };
});


// Referenced this site for help
// https://dev.to/beznet/build-a-rest-api-with-node-express-mongodb-4ho4
router.post('/add-new/', async function(req, res, next) {
  const employee = new Employee({
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    employeeId: req.query.employeeId,
    hourlyWage: req.query.hourlyWage,
    phoneNumber: req.query.phoneNumber,
    certifications: req.query.certifications,
  });
  try {
    const newEmployee = await employee.save();
    res.send(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({message: err.message});
  };
});

// Function that will allow user to specify existing employee (by employeeId)
// and update specific fields of that employee (first/lastName, eId, etc...
// Referenced this site https://masteringjs.io/tutorials/mongoose/update
router.post('/update/:id', async function(req, res, next) {
  try {
    const results = await Employee.findOne({employeeId: req.params.id});
    if (req.query.firstName) {
      results.firstName = req.query.firstName;
    }
    if (req.query.lastName) {
      results.lastName = req.query.lastName;
    }
    if (req.query.employeeId) {
      results.employeeId = req.query.employeeId;
    }
    if (req.query.hourlyWage) {
      results.hourlyWage = req.query.hourlyWage;
    }
    if (req.query.phoneNumber) {
      results.phoneNumber = req.query.phoneNumber;
    }
    if (req.query.certifications) {
      results.certifications = req.query.certifications;
    }

    await results.save();
    res.send(201).json(results);
  } catch (err) {
    res.status(500).json({message: err.message});
  };
});

// Utilized this resource:
// https://www.thepolyglotdeveloper.com/2019/02/building-rest-api-mongodb-
// mongoose-nodejs/
router.delete('/delete/:id', async function(req, res, next) {
  try {
    // const results = await Employee.findOne({employeeId: req.params.id});
    await Employee.deleteOne({'employeeId': req.params.id}).exec();
    // await results.save();
    res.send('Deleted employee with id of: ' + req.params.id);
  } catch (err) {
    res.status(500).json({message: err.message});
  };
});

module.exports = router;
