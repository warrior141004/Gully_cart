const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  cartType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false // optional field if needed
  }
});

// Add username and hashed password fields automatically
vendorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Vendor", vendorSchema);
