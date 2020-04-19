const mongoose = require('mongoose');

// Remove the '_id' from all JSON responses
mongoose.plugin((schema) => {
  schema.options.toJSON = {
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
    },
  };
});

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  employeeId: String,
  hourlyWage: Number,
  phoneNumber: String,
  certifications: String,
});

module.exports = mongoose.model('Employee', employeeSchema);
