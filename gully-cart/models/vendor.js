// models/Vendor.js
// import mongoose from "mongoose";

// const vendorSchema = new mongoose.Schema({
//   vendorName: String,
//   phone: String,
//   cartType: String,
//   category: String,
//   description: String,
//   photo: String, // You can store base64 or a URL
//   username: String,
//   password: String
// });

// const Vendor = mongoose.model("Vendor", vendorSchema);
// export default Vendor;


import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  cartType: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Vendor', vendorSchema);